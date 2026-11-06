import { Discography } from "@/components/discography";
import { NewRelease } from "@/components/new-release";
import { SiteHeader } from "@/components/site-header";
import { UpcomingShows } from "@/components/upcoming-shows";
import { siteConfig } from "@/config/site";
import { getAlbums, getUpcomingShows } from "@/sanity/queries";

// Nuevo lanzamiento: lo primero que se ve después de la intro.
const NEW_RELEASE = {
  cover: "/images/lanzamientos/la-puerta.jpg",
  coverAlt:
    "Los cuatro integrantes de Roberto el Diablo, vestidos de negro y con lentes oscuros, posan en una plaza de ladrillo rojo rodeada de escalones de concreto.",
  eyebrow: "Nuevo álbum",
  kind: "Álbum",
  title: "La Puerta",
  // Álbum en Sanity del que sale la liga del botón "Escucha aquí".
  slug: "la-puerta",
};

export default async function HomePage() {
  const [albums, shows] = await Promise.all([getAlbums(), getUpcomingShows()]);

  // La liga se carga en el Studio, en los enlaces del álbum: Spotify si hay,
  // si no, la primera. Sin enlaces no se muestra el play.
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
      <NewRelease {...release} listenUrl={listenUrl} />
      <Discography albums={albums} />
      <UpcomingShows shows={shows} />
    </main>
  );
}
