import { Discography } from "@/components/discography";
import { NewRelease } from "@/components/new-release";
import { SiteHeader } from "@/components/site-header";
import { UpcomingShows } from "@/components/upcoming-shows";
import { siteConfig } from "@/config/site";
import { getAlbums, getNewRelease, getUpcomingShows } from "@/sanity/queries";

export default async function HomePage() {
  const [newRelease, albums, shows] = await Promise.all([
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
      {/* Se elige en el Studio, en "Nuevo lanzamiento". Sin lanzamiento
          elegido no se muestra. */}
      {newRelease && (
        <NewRelease
          title={newRelease.title}
          eyebrow={newRelease.eyebrow}
          kind={newRelease.kind}
          cover={newRelease.image}
          coverAlt={newRelease.imageAlt}
          listenUrl={newRelease.listenUrl}
        />
      )}
      <Discography albums={albums} />
      <UpcomingShows shows={shows} />
    </main>
  );
}
