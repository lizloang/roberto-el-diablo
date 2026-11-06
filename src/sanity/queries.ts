import { cacheLife } from "next/cache";
import { defineQuery } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PLATFORMS } from "@/sanity/platforms";
import { SHOW_STATUSES } from "@/sanity/show-statuses";
import type { Album } from "@/types/album";
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
