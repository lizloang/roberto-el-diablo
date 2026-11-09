import { Discography } from "@/components/discography";
import { NewRelease } from "@/components/new-release";
import { SiteHeader } from "@/components/site-header";
import { UpcomingShows } from "@/components/upcoming-shows";
import { siteConfig } from "@/config/site";
import { getAlbums, getUpcomingShows } from "@/sanity/queries";

// Nuevo lanzamiento: lo primero que se ve después de la intro.
const NEW_RELEASE = {
  eyebrow: "Nuevo álbum",
  kind: "Álbum",
  title: "La Puerta",
  // Álbum en Sanity del que salen la imagen del CD y la liga del play.
  slug: "la-puerta",
};

export default async function HomePage() {
  const [albums, shows] = await Promise.all([getAlbums(), getUpcomingShows()]);

  // La imagen del CD es la portada del álbum en el Studio (con su texto
  // alternativo y recortada en cuadrado según el hotspot). La liga sale de
  // sus enlaces: Spotify si hay, si no, la primera; sin enlaces no hay play.
  // Si el álbum no está publicado, no se muestra la sección.
  const { slug, ...release } = NEW_RELEASE;
  const album = albums.find((album) => album.slug === slug);
  const links = album?.links ?? [];
  const listenUrl = (
    links.find((link) => link.platform === "spotify") ?? links[0]
  )?.href;

  return (
    <main>
      {/* El logo grande lo presenta la intro; la portada empieza con el
          header y el nuevo lanzamiento. El h1 queda para lectores de
          pantalla y SEO. */}
      <SiteHeader />
      <h1 className="sr-only">{siteConfig.name}</h1>
      {album && (
        <NewRelease
          {...release}
          cover={album.cover}
          coverAlt={album.coverAlt}
          listenUrl={listenUrl}
        />
      )}
      <Discography albums={albums} />
      <UpcomingShows shows={shows} />
    </main>
  );
}
