"use client";

import type { ComponentProps, MouseEvent } from "react";
import { albumHref, selectAlbum } from "@/lib/album-selection";

type AlbumLinkProps = Omit<ComponentProps<"a">, "href"> & {
  slug: string;
};

// Enlace real a ?album=slug#musica (funciona sin JavaScript y se puede abrir
// en otra pestaña). Con un clic normal carga el álbum en el reproductor sin
// recargar la página.
export function AlbumLink({ slug, onClick, ...props }: AlbumLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    // Ctrl/Cmd/Shift o clic medio: que el navegador lo abra donde se pidió.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    selectAlbum(slug);
  };

  return <a href={albumHref(slug)} onClick={handleClick} {...props} />;
}
