"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { AlbumLink } from "@/components/album-link";
import { PLAYER_ID, useSelectedAlbumSlug } from "@/lib/album-selection";
import { spotifyAlbumEmbedUrl } from "@/lib/spotify";
import type { Album } from "@/types/album";

// Alto del reproductor: muestra la lista completa de canciones.
const PLAYER_HEIGHT = 352;

type MusicSectionProps = {
  // Del más reciente al más antiguo (getAlbums).
  albums: Album[];
};

// Lee el álbum elegido de la URL (?album=slug). Va dentro de un <Suspense>
// (useSearchParams); de respaldo, <MusicPlayer> sin álbum elegido.
export function MusicSection({ albums }: MusicSectionProps) {
  const selectedSlug = useSelectedAlbumSlug();
  return <MusicPlayer albums={albums} selectedSlug={selectedSlug} />;
}

const noop = () => () => {};

type MusicPlayerProps = MusicSectionProps & {
  // Slug de ?album=; null: nadie eligió (el más reciente). Sin definir:
  // todavía no se lee la URL (respaldo), así no se marca ninguno de más.
  selectedSlug?: string | null;
};

// Página /musica: el reproductor de Spotify con el álbum elegido y, para
// cambiar de uno a otro, las portadas de todos. En desktop las portadas van a
// la izquierda y el reproductor a la derecha; en móvil, el reproductor arriba
// y las portadas en una fila con scroll horizontal.
export function MusicPlayer({ albums, selectedSlug }: MusicPlayerProps) {
  const pending = selectedSlug === undefined;
  // El iframe se monta ya en el navegador, con el álbum de la URL: así no se
  // carga primero el más reciente para luego cambiarlo.
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const rowRef = useRef<HTMLUListElement>(null);

  const current =
    albums.find((album) => album.slug === selectedSlug) ?? albums[0];
  const currentSlug = current?.slug;

  // En móvil (fila con scroll) la portada activa se centra en la fila. Solo
  // se mueve la fila, nunca la página.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || row.scrollWidth <= row.clientWidth) return;
    const item = row
      .querySelector('[aria-current="true"]')
      ?.closest("li") as HTMLElement | null;
    if (!item) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({
      left: item.offsetLeft - (row.clientWidth - item.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [currentSlug]);

  if (!current) return null;

  const embedUrl = spotifyAlbumEmbedUrl(current.spotifyUrl);

  return (
    <section
      id="musica"
      aria-labelledby="musica-title"
      className="px-5 pt-6 pb-24 text-crema md:px-16 md:pt-8 md:pb-32"
    >
      {/* Encabezado solo para lectores de pantalla. Es el h1 porque la
          sección es toda la página /musica. */}
      <h1 id="musica-title" className="sr-only">
        Música
      </h1>

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-14">
          {/* Reproductor: primero en el código (arriba en móvil), a la
              derecha en desktop. */}
          <div id={PLAYER_ID} className="scroll-mt-6 lg:order-2">
            {/* Año: como los metadatos del sitio (detalle del álbum). */}
            <p
              className={`text-xs font-bold tracking-[0.2em] text-crema/60 ${pending ? "invisible" : ""}`}
            >
              {current.year}
            </p>
            {/* Título: como los títulos de álbum del sitio (Anton). */}
            <h2
              aria-live="polite"
              className={`mt-3 font-display text-4xl leading-[0.95] uppercase md:text-5xl ${pending ? "invisible" : ""}`}
            >
              {current.title}
            </h2>

            <div className="mt-6">
              {embedUrl || pending ? (
                mounted && !pending && embedUrl ? (
                  <iframe
                    key={embedUrl}
                    src={embedUrl}
                    title={`Reproductor de Spotify: ${current.title}`}
                    width="100%"
                    height={PLAYER_HEIGHT}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="block w-full rounded-[12px] border-0"
                  />
                ) : (
                  <div
                    aria-hidden
                    className="animate-pulse rounded-[12px] bg-crema/5 motion-reduce:animate-none"
                    style={{ height: PLAYER_HEIGHT }}
                  />
                )
              ) : (
                <div
                  className="flex items-center justify-center rounded-[12px] border border-dashed border-crema/20 px-6 text-center text-xs font-bold tracking-[0.2em] text-crema/70 uppercase"
                  style={{ height: PLAYER_HEIGHT }}
                >
                  Próximamente en Spotify
                </div>
              )}
            </div>
          </div>

          {/* Portadas: fila con scroll horizontal en móvil, rejilla de 3 en
              desktop. La activa va completa y con borde; las demás, más
              tenues. */}
          <ul
            ref={rowRef}
            className="relative -mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 md:-mx-16 md:scroll-px-16 md:px-16 lg:order-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {albums.map((album) => {
              const active = !pending && album.slug === current.slug;
              return (
                <li
                  key={album.slug}
                  className="w-28 shrink-0 snap-start sm:w-32 lg:w-auto"
                >
                  <AlbumLink
                    slug={album.slug}
                    inPage
                    aria-current={active ? "true" : undefined}
                    className={`block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema ${
                      active
                        ? ""
                        : "opacity-55 hover:opacity-100 focus-visible:opacity-100"
                    } transition-opacity duration-300 motion-reduce:transition-none`}
                  >
                    <span
                      className={`relative block aspect-square overflow-hidden ${
                        active ? "ring-2 ring-rojo-vivo" : ""
                      }`}
                    >
                      <Image
                        src={album.cover}
                        alt={album.coverAlt}
                        fill
                        sizes="(min-width: 1024px) 140px, 128px"
                        className="object-cover"
                      />
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 bg-black/75 py-1 text-center text-[0.625rem] font-bold tracking-[0.2em] uppercase"
                        >
                          ▶ Sonando
                        </span>
                      )}
                    </span>
                    {/* Etiqueta: como las del sitio (menú, «Escuchar»). */}
                    <span className="mt-2 block truncate text-[0.625rem] font-bold tracking-[0.2em] text-crema/80 uppercase sm:text-xs">
                      {album.title}
                    </span>
                  </AlbumLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
