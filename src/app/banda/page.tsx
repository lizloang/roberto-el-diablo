import type { Metadata } from "next";
import { BandHero } from "@/components/band-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getBandPage } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Nosotros",
};

// Sale del Studio, de "Historia de la banda".
export default async function BandaPage() {
  const { intro, caption, mainPhoto, secondaryPhoto } = await getBandPage();

  return (
    <>
      <main>
        <SiteHeader />
        <BandHero
          intro={intro}
          caption={caption}
          mainPhoto={mainPhoto}
          secondaryPhoto={secondaryPhoto}
          headingLevel="h1"
          preload
        />
        <section aria-label="Video" className="px-5 pb-20 md:px-16 md:pb-28">
          <div className="mx-auto max-w-5xl">
            <iframe
              className="block aspect-video w-full bg-negro"
              src="https://www.youtube-nocookie.com/embed/tdLzIhiyGYI"
              title="Video de Roberto el Diablo en YouTube"
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
