import { Discography } from "@/components/discography";
import { SiteHeader } from "@/components/site-header";
import { UpcomingShows } from "@/components/upcoming-shows";
import { siteConfig } from "@/config/site";
import { getAlbums, getUpcomingShows } from "@/sanity/queries";

export default async function HomePage() {
  const [albums, shows] = await Promise.all([getAlbums(), getUpcomingShows()]);

  return (
    <main>
      {/* El logo grande lo presenta la intro; la portada empieza con el
          header y la música. El h1 queda para lectores de pantalla y SEO. */}
      <SiteHeader />
      <h1 className="sr-only">{siteConfig.name}</h1>
      <Discography albums={albums} />
      <UpcomingShows shows={shows} />
    </main>
  );
}
