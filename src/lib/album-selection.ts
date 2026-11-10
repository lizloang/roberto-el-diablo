"use client";

import { useSearchParams } from "next/navigation";

// Álbum elegido para el reproductor de la página /musica. Vive en la URL
// (/musica?album=slug) para que el enlace se pueda compartir: quien entra
// con esa URL llega con ese álbum cargado.
const PARAM = "album";
export const MUSIC_PATH = "/musica";
// id del bloque del reproductor (para volver a él en móvil).
export const PLAYER_ID = "reproductor";

export function albumHref(slug: string) {
  return `${MUSIC_PATH}?${PARAM}=${encodeURIComponent(slug)}`;
}

// null si nadie ha elegido un álbum (el reproductor muestra el más reciente).
// Usa useSearchParams: el componente debe ir dentro de un <Suspense>.
export function useSelectedAlbumSlug(): string | null {
  return useSearchParams().get(PARAM);
}

// Dentro de /musica: cambia de álbum sin recargar la página (Next sincroniza
// pushState con useSearchParams). Si el reproductor quedó arriba fuera de
// vista (en móvil las portadas van debajo), sube a él; sin animación si se
// pidió reducir movimiento.
export function selectAlbum(slug: string) {
  window.history.pushState(null, "", albumHref(slug));

  const player = document.getElementById(PLAYER_ID);
  if (player && player.getBoundingClientRect().top < 0) {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    player.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }
}
