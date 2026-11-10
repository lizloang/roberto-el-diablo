"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { AlbumLink } from "@/components/album-link";
import { MUSIC_SECTION_ID, useSelectedAlbumSlug } from "@/lib/album-selection";
import { spotifyAlbumEmbedUrl } from "@/lib/spotify";
import type { Album } from "@/types/album";

// Título de la sección: cámbialo aquí.
const TITLE = "...Música...";

// Alto del reproductor: muestra la lista completa de canciones.
const PLAYER_HEIGHT = 352;

type MusicSectionProps = {
  // Del más reciente al más antiguo (getAlbums).
  albums: Album[];
};

const noop = () => () => {};

// Sección #musica: el reproductor de Spotify con el álbum elegido y, para
// cambiar de uno a otro, las portadas de todos. En desktop las portadas van a
// la izquierda y el reproductor a la derecha; en móvil, el reproductor arriba
// y las portadas en una fila con scroll horizontal. El álbum elegido sale de
// la URL (?album=slug); si no hay, el más reciente.
export function MusicSection({ albums }: MusicSectionProps) {
  const selectedSlug = useSelectedAlbumSlug();
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
      id={MUSIC_SECTION_ID}
      aria-labelledby="musica-title"
      className="scroll-mt-6 px-5 pt-10 pb-24 text-crema md:px-16 md:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="musica-title"
          className="font-pixel text-xl tracking-[0.3em] uppercase md:text-2xl"
        >
          {TITLE}
        </h2>

        <div className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-14">
          {/* Reproductor: primero en el código (arriba en móvil), a la
              derecha en desktop. */}
          <div className="lg:order-2">
            <p className="font-pixel text-xs tracking-[0.25em] text-crema/60 uppercase">
              {current.year}
            </p>
            <h3
              aria-live="polite"
              className="mt-2 font-display text-3xl leading-none uppercase md:text-4xl"
            >
              {current.title}
            </h3>

            <div className="mt-6">
              {embedUrl ? (
                mounted ? (
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
                  className="flex items-center justify-center rounded-[12px] border border-dashed border-crema/20 px-6 text-center font-pixel text-sm tracking-[0.25em] text-crema/70 uppercase"
                  style={{ height: PLAYER_HEIGHT }}
                >
                  Próximamente en Spotify
                </div>
              )}
            </div>

            {embedUrl && current.spotifyUrl && (
              <a
                href={current.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex items-center gap-2 rounded-sm font-pixel text-sm tracking-[0.25em] text-rojo-vivo uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema"
              >
                <span className="underline-offset-6 group-hover:underline">
                  Escuchar en Spotify
                </span>
                <span aria-hidden>→</span>
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            )}
          </div>

          {/* Portadas: fila con scroll horizontal en móvil, rejilla de 3 en
              desktop. La activa va completa y con borde; las demás, más
              tenues. */}
          <ul
            ref={rowRef}
            className="relative -mx-5 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 md:-mx-16 md:scroll-px-16 md:px-16 lg:order-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {albums.map((album) => {
              const active = album.slug === current.slug;
              return (
                <li
                  key={album.slug}
                  className="w-28 shrink-0 snap-start sm:w-32 lg:w-auto"
                >
                  <AlbumLink
                    slug={album.slug}
                    aria-current={active ? "true" : undefined}
                    className={`group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema ${
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
                          className="absolute inset-x-0 bottom-0 bg-black/75 py-1 text-center font-pixel text-[10px] tracking-[0.2em] uppercase"
                        >
                          ▶ Sonando
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block truncate font-pixel text-[11px] tracking-[0.15em] text-crema/80 uppercase">
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
