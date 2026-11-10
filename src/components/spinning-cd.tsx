"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { AlbumLink } from "@/components/album-link";
import { useBehindIntro } from "@/components/intro-screen";

// Una vuelta cada 18 s; con el mouse encima, cada 8 s.
const SPIN_MS = 18_000;
const SPIN_HOVER_MS = 8_000;

// Brillo tornasolado del disco: rosa, lila, azul, aqua, amarillo y coral.
const IRIDESCENT =
  "conic-gradient(from 0deg, #ff9ad5, #c9a7ff, #8ec5ff, #7fe7dc, #fff3a0, #ff9f87, #ff9ad5)";

type SpinningCdProps = {
  src: string;
  alt: string;
  // true si el disco es lo primero que se ve (imagen principal de la página).
  preload?: boolean;
  className?: string;
  // Capa quieta encima del disco, centrada (texto, botón). No gira. El
  // disco es un contenedor (@container): usa unidades cqw para que el
  // contenido escale con él. Deja pasar los clics al disco; lo que deba
  // poder tocarse lleva pointer-events-auto.
  children?: ReactNode;
  // Álbum del disco: todo el disco es un enlace a /musica con ese álbum.
  album?: { slug: string; title: string };
};

// CD con la portada: la foto llena el disco y gira sin parar. Encima, quietos,
// un brillo tornasolado muy sutil, el anillo transparente del centro y el
// agujero. Aparece con fade + scale al entrar en pantalla (ya sin la intro
// encima). Con movimiento reducido no gira ni anima la entrada.
export function SpinningCd({
  src,
  alt,
  preload = false,
  className = "",
  children,
  album,
}: SpinningCdProps) {
  const ref = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<Animation | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const behindIntro = useBehindIntro();
  const reduceMotion = useReducedMotion();
  const shown = inView && !behindIntro;

  // El giro va con Web Animations: así el mouse solo cambia la velocidad
  // (playbackRate) sin que el disco salte de posición.
  useEffect(() => {
    const disc = discRef.current;
    if (!disc || reduceMotion) return;

    const spin = disc.animate(
      [{ transform: "rotate(0turn)" }, { transform: "rotate(1turn)" }],
      { duration: SPIN_MS, iterations: Infinity },
    );
    spinRef.current = spin;
    return () => spin.cancel();
  }, [reduceMotion]);

  const setFast = (event: PointerEvent, fast: boolean) => {
    if (event.pointerType !== "mouse") return;
    spinRef.current?.updatePlaybackRate(fast ? SPIN_MS / SPIN_HOVER_MS : 1);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}
      onPointerEnter={(event) => setFast(event, true)}
      onPointerLeave={(event) => setFast(event, false)}
      className={`@container relative isolate aspect-square w-full max-w-[36rem] overflow-hidden rounded-full ${className}`}
    >
      <div ref={discRef} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          preload={preload}
          sizes="(min-width: 768px) 36rem, calc(100vw - 2.5rem)"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-screen"
        style={{ backgroundImage: IRIDESCENT }}
      />
      {/* Anillo transparente del centro (30 %) y agujero (11 %), del color
          del fondo de la página. */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[30%] -translate-1/2 rounded-full border border-crema/35 bg-crema/10"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[11%] -translate-1/2 rounded-full bg-negro"
      />

      {album && (
        <AlbumLink
          slug={album.slug}
          aria-label={`${alt}: escuchar ${album.title} en Música`}
          className="absolute inset-0 rounded-full focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-crema"
        />
      )}

      {children && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </motion.div>
  );
}
