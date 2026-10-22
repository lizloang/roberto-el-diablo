import { cacheLife } from "next/cache";
import { defineQuery } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PLATFORMS } from "@/sanity/platforms";
import type { Album } from "@/types/album";

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
      label:
        PLATFORMS.find((p) => p.value === link.platform)?.title ??
        link.platform,
      href: link.url,
    })),
  }));
}
