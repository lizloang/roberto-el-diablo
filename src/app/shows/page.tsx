import type { Metadata } from "next";
import { ShowList } from "@/components/show-list";
import { ShowsTitle } from "@/components/shows-title";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getUpcomingShows } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Shows",
  description: "Próximas fechas de Roberto el Diablo en vivo.",
};

export default async function ShowsPage() {
  const shows = await getUpcomingShows();

  return (
    <>
      <main className="flex-1 bg-negro text-crema">
        <SiteHeader />
        <section
          aria-labelledby="shows-title"
          className="px-5 pt-10 pb-24 md:px-16 md:pt-16 md:pb-32"
        >
          <ShowsTitle id="shows-title" as="h1" />

          <div className="mx-auto mt-16 max-w-5xl">
            <ShowList shows={shows} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
