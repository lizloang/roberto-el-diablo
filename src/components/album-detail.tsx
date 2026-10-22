"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { Album } from "@/types/album";

type AlbumDetailProps = {
  album: Album | null;
  onClose: () => void;
};

// <dialog> nativo: atrapa el foco, cierra con Escape y devuelve el foco al
// disco que lo abrió.
export function AlbumDetail({ album, onClose }: AlbumDetailProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (album && dialog && !dialog.open) dialog.showModal();
  }, [album]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="album-detail-title"
      onCancel={(event) => {
        // Escape: deja que la animación de salida termine antes de cerrar.
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 text-crema backdrop:bg-black/80"
    >
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {album && (
          <motion.div
            key={album.slug}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="relative grid max-h-[92svh] w-[min(92vw,60rem)] gap-8 overflow-y-auto bg-negro p-6 shadow-[0_40px_80px_rgb(0_0_0/0.7)] ring-1 ring-crema/10 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-12 md:p-10"
          >
            <div className="relative aspect-square w-full shadow-[0_24px_48px_-12px_rgb(0_0_0/0.9)]">
              <Image
                src={album.cover}
                alt={album.coverAlt}
                fill
                sizes="(min-width: 768px) 32rem, 92vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-crema/60">
                  {album.year}
                </p>
                <h2
                  id="album-detail-title"
                  className="mt-3 font-display text-5xl leading-[0.95] uppercase md:text-6xl"
                >
                  {album.title}
                </h2>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase">
                  Escuchar
                </h3>
                {album.links.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {album.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-12 items-center bg-rojo px-5 text-sm font-bold tracking-[0.12em] uppercase transition-colors hover:bg-crema hover:text-negro"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-crema/60">
                    Los enlaces para escucharlo estarán disponibles pronto.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar y volver a los estantes"
              className="absolute top-3 right-3 flex size-11 items-center justify-center text-crema/70 transition-colors hover:text-crema focus-visible:outline-2 focus-visible:outline-crema"
            >
              <span
                aria-hidden
                className="absolute h-0.5 w-6 rotate-45 bg-current"
              />
              <span
                aria-hidden
                className="absolute h-0.5 w-6 -rotate-45 bg-current"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}
