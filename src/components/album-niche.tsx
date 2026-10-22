import Image from "next/image";
import type { Album } from "@/types/album";

type AlbumNicheProps = {
  album: Album;
  onSelect: (album: Album) => void;
  // Disco seleccionado: se enciende con luz de neón roja.
  selected?: boolean;
  className?: string;
};

// Portada de un disco en la pared. Los estilos y la luz viven en globals.css
// (.niche-*); aquí solo va la estructura.
export function AlbumNiche({
  album,
  onSelect,
  selected = false,
  className = "",
}: AlbumNicheProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-selected={selected || undefined}
      onClick={() => onSelect(album)}
      className={`niche-cell group block w-full cursor-pointer text-left outline-none ${className}`}
    >
      <span className="niche">
        <span className="niche-cover">
          <Image
            src={album.cover}
            alt={album.coverAlt}
            fill
            sizes="(min-width: 1024px) 18rem, (min-width: 768px) 15rem, (min-width: 640px) 20rem, 50vw"
            className="object-cover"
          />

          {/* Placa sobre la parte baja de la portada: visible mientras la luz
              del disco está encendida (globals.css). */}
          <span className="niche-label absolute inset-x-0 bottom-0 z-2 flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-1 bg-linear-to-t from-black/80 to-transparent px-2 pt-10 pb-2 text-center sm:px-3 sm:pb-3">
            <span className="font-display text-sm leading-none uppercase sm:text-base md:text-lg">
              {album.title}
            </span>
            <span className="text-[0.625rem] font-bold tracking-[0.2em] text-crema/60">
              {album.year}
            </span>
          </span>

          {/* Tubos de neón justo sobre y bajo la foto: van dentro de la
              portada para seguirla cuando crece con el hover. */}
          <span aria-hidden className="niche-led" />
          <span aria-hidden className="niche-led niche-led--bottom" />
        </span>
      </span>
    </button>
  );
}
