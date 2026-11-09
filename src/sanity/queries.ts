import { cacheLife } from "next/cache";
import { defineQuery } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PLATFORMS } from "@/sanity/platforms";
import { SHOW_STATUSES } from "@/sanity/show-statuses";
import type { Album, NewRelease } from "@/types/album";
import type { Show, ShowStatus } from "@/types/show";

// Solo lanzamientos con portada: sin ella no hay nada que colgar en la pared.
const ALBUMS_QUERY = defineQuery(`
  *[_type == "album" && defined(slug.current) && defined(cover.asset)]
    | order(releaseDate desc) {
      "slug": slug.current,
      title,
      releaseDate,
      cover,
      links[]{ platform, url }
    }
`);

type AlbumResult = {
  slug: string;
  title: string;
  releaseDate: string;
  cover: SanityImageSource & { alt?: string };
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
  }));
}

// Nuevo lanzamiento de la portada: el elegido en el Studio (Portada → Nuevo
// lanzamiento) o, si no hay, el más reciente. Los dos necesitan portada.
const RELEASE_FIELDS = `
  "slug": slug.current,
  title,
  releaseType,
  cover,
  discImage,
  links[]{ platform, url }
`;

const NEW_RELEASE_QUERY = defineQuery(`{
  "featured": *[
    _type == "album" &&
    _id == *[_id == "homePage"][0].featuredRelease._ref &&
    defined(slug.current) && defined(cover.asset)
  ][0]{ ${RELEASE_FIELDS} },
  "latest": *[_type == "album" && defined(slug.current) && defined(cover.asset)]
    | order(releaseDate desc)[0]{ ${RELEASE_FIELDS} }
}`);

type ReleaseResult = {
  slug: string;
  title: string;
  releaseType: string | null;
  cover: SanityImageSource & { alt?: string };
  discImage: (SanityImageSource & { alt?: string; asset?: unknown }) | null;
  links: { platform: string; url: string }[] | null;
};

// Textos según el tipo: "canción" es femenino, por eso "Escúchala".
const RELEASE_COPY: Record<
  string,
  Pick<NewRelease, "eyebrow" | "kind" | "listenLabel">
> = {
  album: { eyebrow: "Nuevo álbum", kind: "álbum", listenLabel: "Escúchalo aquí" },
  ep: { eyebrow: "Nuevo EP", kind: "EP", listenLabel: "Escúchalo aquí" },
  single: {
    eyebrow: "Nueva canción",
    kind: "canción",
    listenLabel: "Escúchala aquí",
  },
};

export async function getNewRelease(): Promise<NewRelease | null> {
  "use cache";
  cacheLife("minutes");

  const { featured, latest } = await client.fetch<{
    featured: ReleaseResult | null;
    latest: ReleaseResult | null;
  }>(NEW_RELEASE_QUERY);
  const release = featured ?? latest;
  if (!release) return null;

  // La imagen del CD si la subieron; si no, la portada del lanzamiento.
  const image = release.discImage?.asset ? release.discImage : release.cover;
  const links = release.links ?? [];

  return {
    title: release.title,
    ...(RELEASE_COPY[release.releaseType ?? ""] ?? RELEASE_COPY.album),
    // Recorte cuadrado que respeta el hotspot elegido en el Studio.
    cover: urlFor(image).width(1200).height(1200).url(),
    coverAlt: image.alt || `Portada de ${release.title}`,
    // Spotify si hay; si no, el primer enlace. Sin enlaces no hay play.
    listenUrl: (links.find((link) => link.platform === "spotify") ?? links[0])
      ?.url,
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
