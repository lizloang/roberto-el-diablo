import { Discography } from "@/components/discography";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";
import { UpcomingShows } from "@/components/upcoming-shows";
import { getAlbums, getUpcomingShows } from "@/sanity/queries";

export default async function HomePage() {
  const [albums, shows] = await Promise.all([getAlbums(), getUpcomingShows()]);

  return (
    <main>
      {/* Pantalla completa desde tablet; en móvil solo lo que ocupa el logo,
          para no dejar un hueco grande antes de la música. */}
      <section className="flex flex-col bg-negro pb-8 text-crema md:min-h-svh md:pb-0">
        <SiteHeader revealOnScroll />
        <div className="flex justify-center px-5 pt-10 md:px-16 md:pt-16">
          <h1 className="w-4/5 max-w-2xl md:w-2/5">
            <Logo />
          </h1>
        </div>
      </section>
      <Discography albums={albums} />
      <UpcomingShows shows={shows} />
    </main>
  );
}
