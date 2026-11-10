import { BandHero } from "@/components/band-hero";
import { Discography } from "@/components/discography";
import { NewRelease } from "@/components/new-release";
import { SiteHeader } from "@/components/site-header";
import { UpcomingShows } from "@/components/upcoming-shows";
import { siteConfig } from "@/config/site";
import {
  getAlbums,
  getBandPage,
  getNewRelease,
  getUpcomingShows,
} from "@/sanity/queries";

export default async function HomePage() {
  const [newRelease, band, albums, shows] = await Promise.all([
    getNewRelease(),
    getBandPage(),
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
      {/* La misma presentación de /banda ("Historia de la banda" en el
          Studio); la invitación lleva a los integrantes de /banda. */}
      <BandHero
        intro={band.intro}
        caption={band.caption}
        mainPhoto={band.mainPhoto}
        secondaryPhoto={band.secondaryPhoto}
        hasMembers={band.members.length > 0}
        membersHref="/banda#banda"
        headingLevel="h2"
      />
      <Discography albums={albums} />
      <UpcomingShows shows={shows} />
    </main>
  );
}
