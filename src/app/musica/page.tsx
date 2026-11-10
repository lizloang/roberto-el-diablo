import type { Metadata } from "next";
import { Suspense } from "react";
import { MusicPlayer, MusicSection } from "@/components/music-section";
import { SiteHeader } from "@/components/site-header";
import { getAlbums } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Música",
};

// Reproductor de Spotify con todos los lanzamientos. /musica?album=slug abre
// con ese álbum; las portadas del CD y de la discografía de la portada llegan
// aquí así.
export default async function MusicaPage() {
  const albums = await getAlbums();

  return (
    <main>
      <SiteHeader />
      {/* MusicSection lee ?album= de la URL; mientras, el reproductor sin
          álbum elegido. */}
      <Suspense fallback={<MusicPlayer albums={albums} />}>
        <MusicSection albums={albums} />
      </Suspense>
    </main>
  );
}
