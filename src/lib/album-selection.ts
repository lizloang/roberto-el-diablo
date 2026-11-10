"use client";

import { useSyncExternalStore } from "react";

// Álbum elegido para el reproductor de la sección #musica. Vive en la URL
// (?album=slug#musica) para que el enlace se pueda compartir: quien entra
// con esa URL llega con ese álbum cargado.
export const MUSIC_SECTION_ID = "musica";
const PARAM = "album";
const EVENT = "album-selection";

export function albumHref(slug: string) {
  return `/?${PARAM}=${encodeURIComponent(slug)}#${MUSIC_SECTION_ID}`;
}

function readSlug() {
  return new URLSearchParams(window.location.search).get(PARAM);
}

function subscribe(onChange: () => void) {
  // popstate: atrás/adelante del navegador.
  window.addEventListener("popstate", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

// null si nadie ha elegido un álbum (el reproductor muestra el más reciente).
export function useSelectedAlbumSlug(): string | null {
  return useSyncExternalStore(subscribe, readSlug, () => null);
}

// Carga el álbum en el reproductor: actualiza la URL sin recargar y baja a
// #musica (sin animación si se pidió reducir movimiento).
export function selectAlbum(slug: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM, slug);
  url.hash = MUSIC_SECTION_ID;
  if (url.href !== window.location.href) {
    window.history.pushState(window.history.state, "", url);
    window.dispatchEvent(new Event(EVENT));
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(MUSIC_SECTION_ID)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
