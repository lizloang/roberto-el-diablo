import { cacheLife } from "next/cache";
import { defineQuery } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PLATFORMS } from "@/sanity/platforms";
import { RELEASE_NOUNS } from "@/sanity/release-types";
import { SHOW_STATUSES } from "@/sanity/show-statuses";
import type { Album, NewRelease } from "@/types/album";
import type { BandPage, SwappablePhoto } from "@/types/band";
import type { Show, ShowStatus } from "@/types/show";

// Solo lanzamientos con portada: sin ella no hay nada que colgar en la pared.
const ALBUMS_QUERY = defineQuery(`
  *[_type == "album" && defined(slug.current) && defined(cover.asset)]
    | order(releaseDate desc) {
      "slug": slug.current,
      title,
      releaseDate,
      cover,
      spotifyUrl,
      links[]{ platform, url }
    }
`);

type AlbumResult = {
  slug: string;
  title: string;
  releaseDate: string;
  cover: SanityImageSource & { alt?: string };
  spotifyUrl: string | null;
  links: { platform: string; url: string }[] | null;
};

// Del más reciente al más antiguo.
export async function getAlbums(): Promise<Album[]> {
  "use cache";
  cacheLife("minutes");

  const results = await client.fetch<AlbumResult[]>(ALBUMS_QUERY);

  return results.map((album) => ({
    slug: album.slug,
    title: album.title,
    year: Number(album.releaseDate.slice(0, 4)),
    // Recorte cuadrado que respeta el hotspot elegido en el Studio.
    cover: urlFor(album.cover).width(1200).height(1200).url(),
    coverAlt: album.cover.alt || `Portada de ${album.title}`,
    links: (album.links ?? []).map((link) => ({
      platform: link.platform,
      label:
        PLATFORMS.find((p) => p.value === link.platform)?.title ??
        link.platform,
      href: link.url,
    })),
    spotifyUrl: album.spotifyUrl?.trim() || null,
  }));
}

// Documento único "Nuevo lanzamiento": el lanzamiento elegido (solo si está
// publicado) y, opcionales, la imagen del CD y el rótulo.
const NEW_RELEASE_QUERY = defineQuery(`
  *[_id == "newRelease"][0]{
    eyebrow,
    discImage,
    release->{
      "slug": slug.current,
      title,
      releaseType,
      cover,
      links[]{ platform, url }
    }
  }
`);

type ImageResult = SanityImageSource & { asset?: unknown; alt?: string };

type NewReleaseResult = {
  eyebrow: string | null;
  discImage: ImageResult | null;
  release: {
    slug: string;
    title: string;
    releaseType: string | null;
    cover: ImageResult | null;
    links: { platform: string; url: string }[] | null;
  } | null;
} | null;

// null si no hay lanzamiento elegido o si no tiene ninguna imagen.
export async function getNewRelease(): Promise<NewRelease | null> {
  "use cache";
  cacheLife("minutes");

  const result = await client.fetch<NewReleaseResult>(NEW_RELEASE_QUERY);
  const release = result?.release;
  if (!release) return null;

  // La imagen del CD si se cargó; si no, la portada.
  const image = result.discImage?.asset ? result.discImage : release.cover;
  if (!image?.asset) return null;

  const noun = RELEASE_NOUNS[release.releaseType ?? ""] ?? "lanzamiento";
  const links = release.links ?? [];

  return {
    slug: release.slug,
    title: release.title,
    eyebrow: result.eyebrow?.trim() || `Nuevo ${noun}`,
    kind: noun,
    // Recorte cuadrado que respeta el hotspot elegido en el Studio.
    image: urlFor(image).width(1200).height(1200).url(),
    imageAlt: image.alt || `Portada de ${release.title}`,
    // Spotify si hay; si no, el primer enlace. Sin enlaces no hay play.
    listenUrl: (links.find((link) => link.platform === "spotify") ?? links[0])
      ?.url,
  };
}

// Presentación de la banda (/banda y la portada): "Historia de la banda".
const BAND_PAGE_QUERY = defineQuery(`
  *[_id == "bandInfo"][0]{
    intro,
    caption,
    "collageMain": collageMain[defined(asset)],
    "collageSecondary": collageSecondary[defined(asset)]
  }
`);

type BandImageResult = SanityImageSource & { asset?: unknown; alt?: string };

type BandPageResult = {
  intro: string | null;
  caption: string | null;
  collageMain: BandImageResult[] | null;
  collageSecondary: BandImageResult[] | null;
} | null;

// Recorta cada foto a la proporción de su lugar respetando el hotspot (y el
// recorte) elegidos en el Studio. La primera es la que se ve.
function toSwappable(
  images: BandImageResult[] | null,
  width: number,
  height: number,
): SwappablePhoto | null {
  const [first, ...rest] = (images ?? []).map((image) => ({
    src: urlFor(image).width(width).height(height).url(),
    alt: image.alt ?? "",
  }));
  return first ? { ...first, alternates: rest } : null;
}

export async function getBandPage(): Promise<BandPage> {
  "use cache";
  cacheLife("minutes");

  const info = await client.fetch<BandPageResult>(BAND_PAGE_QUERY);

  return {
    intro: info?.intro?.trim() || null,
    caption: info?.caption?.trim() || null,
    mainPhoto: toSwappable(info?.collageMain ?? null, 1600, 1200),
    secondaryPhoto: toSwappable(info?.collageSecondary ?? null, 800, 1000),
  };
}

// Fechas de hoy en adelante, la más cercana primero.
const UPCOMING_SHOWS_QUERY = defineQuery(`
  *[_type == "show" && dateTime(date) >= dateTime(now())] | order(date asc) {
    _id,
    date,
    eventName,
    venue,
    city,
    state,
    country,
    status,
    ticketUrl,
    notes
  }
`);

type ShowResult = {
  _id: string;
  date: string;
  eventName: string | null;
  venue: string;
  city: string;
  state: string | null;
  country: string;
  status: ShowStatus;
  ticketUrl: string | null;
  notes: string | null;
};

// La banda toca en Nuevo León: las horas se muestran en la hora local de
// allá, sin importar dónde corra el servidor.
const showDate = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Monterrey",
    ...options,
  });

const formatDay = showDate({ day: "2-digit" });
const formatMonth = showDate({ month: "short" });
const formatYear = showDate({ year: "numeric" });
const formatLongDate = showDate({ dateStyle: "long" });
const formatTime = showDate({
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// Sin puntos de abreviatura: "nov." → "nov".
const short = (text: string) => text.replace(".", "");

export async function getUpcomingShows(): Promise<Show[]> {
  "use cache";
  cacheLife("minutes");

  const results = await client.fetch<ShowResult[]>(UPCOMING_SHOWS_QUERY);

  return results.map((show) => {
    const date = new Date(show.date);

    return {
      id: show._id,
      date: show.date,
      day: formatDay.format(date),
      month: short(formatMonth.format(date)),
      year: formatYear.format(date),
      longDate: formatLongDate.format(date),
      time: formatTime.format(date),
      eventName: show.eventName,
      venue: show.venue,
      city: show.city,
      state: show.state,
      country: show.country,
      status: show.status,
      statusLabel:
        SHOW_STATUSES.find((s) => s.value === show.status)?.title ??
        show.status,
      ticketUrl: show.ticketUrl,
      notes: show.notes,
    };
  });
}
