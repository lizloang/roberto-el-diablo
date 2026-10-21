"use client";

import { MotionConfig } from "motion/react";
import { useState } from "react";
import type { Album } from "@/types/album";
import { AlbumNiche } from "@/components/album-niche";
import { NeonSign } from "@/components/neon-sign";

type DiscographyProps = {
  albums: Album[];
};

// Portadas en la pared: 2 columnas en móvil y tablet chica, 3 desde tablet. Seleccionar un disco solo lo enciende; un segundo clic lo
// apaga.
export function Discography({ albums }: DiscographyProps) {
  const [selected, setSelected] = useState<Album | null>(null);

  const toggle = (album: Album) =>
    setSelected((current) => (current?.slug === album.slug ? null : album));

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
            className="mx-auto block w-full max-w-sm md:max-w-xl"
          />
        </h2>

        <div className="mt-16 px-4 md:px-8">
          {albums.length > 0 ? (
            <ul className="niche-shelf mx-auto grid max-w-2xl grid-cols-2 md:max-w-3xl md:grid-cols-3 lg:max-w-4xl">
              {albums.map((album) => (
                <li key={album.slug}>
                  <AlbumNiche
                    album={album}
                    onSelect={toggle}
                    selected={selected?.slug === album.slug}
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
