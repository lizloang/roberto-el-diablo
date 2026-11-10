"use client";

import { MotionConfig } from "motion/react";
import { useRouter } from "next/navigation";
import type { Album } from "@/types/album";
import { AlbumNiche } from "@/components/album-niche";
import { NeonSign } from "@/components/neon-sign";
import { albumHref } from "@/lib/album-selection";

type DiscographyProps = {
  albums: Album[];
};

// Portadas en la pared: 2 columnas en móvil y tablet chica, 3 desde tablet.
// Un clic en un disco lleva a /musica con ese álbum en el reproductor; el
// neón se enciende al pasar el cursor o con el foco.
export function Discography({ albums }: DiscographyProps) {
  const router = useRouter();

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="discografia-title"
        className="niche-wall overflow-hidden pt-10 pb-24 text-crema md:py-32"
      >
        {/* Letrero de neón: el SVG es decorativo y el texto accesible va
            oculto a la vista. */}
        <h2 id="discografia-title" className="px-5 md:px-16">
          <span className="sr-only">Música</span>
          <NeonSign
            text="MÚSICA"
            className="mx-auto block w-full max-w-[15rem] md:max-w-[24rem]"
          />
        </h2>

        <div className="mt-16 px-4 md:px-8">
          {albums.length > 0 ? (
            <ul className="niche-shelf mx-auto grid max-w-2xl grid-cols-2 md:max-w-3xl md:grid-cols-3 lg:max-w-4xl">
              {albums.map((album) => (
                <li key={album.slug}>
                  <AlbumNiche
                    album={album}
                    onSelect={(album) => router.push(albumHref(album.slug))}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-crema/60">
              La discografía estará disponible pronto.
            </p>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
