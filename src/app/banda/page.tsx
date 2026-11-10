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
      </main>
      <SiteFooter />
    </>
  );
}
