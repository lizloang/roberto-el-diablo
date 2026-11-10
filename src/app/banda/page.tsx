import type { Metadata } from "next";
import { BandHero } from "@/components/band-hero";
import { BandMembers } from "@/components/band-members";
import { SiteHeader } from "@/components/site-header";
import { getBandPage } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "La banda",
};

// Todo sale del Studio: "Historia de la banda" (hero) e "Integrantes".
export default async function BandaPage() {
  const { intro, caption, mainPhoto, secondaryPhoto, members } =
    await getBandPage();

  return (
    <main>
      <SiteHeader />
      <BandHero
        intro={intro}
        caption={caption}
        mainPhoto={mainPhoto}
        secondaryPhoto={secondaryPhoto}
        hasMembers={members.length > 0}
      />
      <BandMembers members={members} />
    </main>
  );
}
