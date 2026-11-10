import type { Metadata } from "next";
import { BandHero } from "@/components/band-hero";
import { BandMembers } from "@/components/band-members";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "La banda",
};

export default function BandaPage() {
  return (
    <main>
      <SiteHeader />
      <BandHero />
      <BandMembers />
    </main>
  );
}
