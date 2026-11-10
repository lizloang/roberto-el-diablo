"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { albumHref, selectAlbum } from "@/lib/album-selection";

type AlbumLinkProps = Omit<ComponentProps<"a">, "href"> & {
  slug: string;
  // true dentro de /musica: cambia de álbum sin navegar. Fuera de /musica
  // (portada, discografía) lleva a /musica con ese álbum cargado.
  inPage?: boolean;
};

// Enlace real a /musica?album=slug: se puede abrir en otra pestaña o
// compartir, y funciona sin JavaScript.
export function AlbumLink({
  slug,
  inPage = false,
  onClick,
  ...props
}: AlbumLinkProps) {
  const href = albumHref(slug);

  if (!inPage) return <Link href={href} onClick={onClick} {...props} />;

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

  return <a href={href} onClick={handleClick} {...props} />;
}
