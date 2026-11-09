import { Discography } from "@/components/discography";
import { NewRelease } from "@/components/new-release";
import { SiteHeader } from "@/components/site-header";
import { UpcomingShows } from "@/components/upcoming-shows";
import { siteConfig } from "@/config/site";
import {
  getAlbums,
  getNewRelease,
  getUpcomingShows,
} from "@/sanity/queries";

export default async function HomePage() {
  // El nuevo lanzamiento (lo primero después de la intro) se elige en el
  // Studio, en Portada; si no hay uno elegido, es el más reciente.
  const [release, albums, shows] = await Promise.all([
    getNewRelease(),
    getAlbums(),
    getUpcomingShows(),
  ]);

  return (
    <main>
      {/* El logo grande lo presenta la intro; la portada empieza con el
          header y el nuevo lanzamiento. El h1 queda para lectores de
          pantalla y SEO. */}
      <SiteHeader />
      <h1 className="sr-only">{siteConfig.name}</h1>
      {release && <NewRelease {...release} />}
      <Discography albums={albums} />
      <UpcomingShows shows={shows} />
    </main>
  );
}
