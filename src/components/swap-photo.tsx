"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { BandImage } from "@/components/band-image";
import type { SwappablePhoto } from "@/data/banda";

// Cada cuánto cambia la foto mientras el mouse está encima, en ms. El fundido
// (duration-150 abajo) debe ser más corto que esto.
const CYCLE_MS = 400;

type SwapPhotoProps = {
  photo: SwappablePhoto;
  sizes: string;
  // true para la foto principal de la página (la primera que se ve).
  preload?: boolean;
  className?: string;
};

// Foto del collage que pasa por todas sus fotos:
// - Mouse: mientras está encima cambia sola cada CYCLE_MS, con un fundido
//   corto, una tras otra en orden; al salir vuelve a la original.
// - Táctil o teclado (Enter/Espacio): un tap arranca el carrusel y otro lo
//   detiene y regresa a la original.
// - Movimiento reducido: sin carrusel ni fundido; cada hover (o tap) cambia
//   directo a la siguiente foto.
// Todas las capas se montan desde el inicio (las alternativas con
// loading="eager"), así ya están descargadas cuando toca mostrarlas.
export function SwapPhoto({
  photo,
  sizes,
  preload = false,
  className = "",
}: SwapPhotoProps) {
  const layers = [photo, ...photo.alternates];
  const [active, setActive] = useState(0);
  const timer = useRef<number | null>(null);
  const running = useRef(false);
  // Con movimiento reducido: próxima foto a mostrar en el siguiente hover.
  const nextStill = useRef(1);
  // Último toque o clic (timeStamp): el click que lo sigue ya no cuenta.
  const lastPointerDown = useRef(-Infinity);

  const advance = () => setActive((index) => (index + 1) % layers.length);

  const start = () => {
    if (running.current) return;
    running.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(nextStill.current);
      nextStill.current = (nextStill.current % photo.alternates.length) + 1;
      return;
    }
    advance();
    timer.current = window.setInterval(advance, CYCLE_MS);
  };

  const stop = () => {
    running.current = false;
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    // Opción 2: quedarse en la foto donde iba al quitar el mouse. Para
    // usarla, borra la línea de abajo.
    setActive(0);
  };

  // Si el componente se desmonta a media vuelta, el intervalo no sigue.
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );

  const toggle = () => (running.current ? stop() : start());

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") start();
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") stop();
  };
  const onPointerDown = (event: PointerEvent) => {
    lastPointerDown.current = event.timeStamp;
  };
  // Táctil y pluma: al levantar el dedo, sin esperar al click (no siempre
  // llega). Si el dedo arrastra para hacer scroll, el navegador manda
  // pointercancel en vez de pointerup y no pasa nada.
  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") toggle();
  };
  // Teclado (Enter/Espacio) y lectores de pantalla. El click que sigue a un
  // mouse o a un toque se ignora: ya lo resolvieron el hover o pointerup.
  const onClick = (event: MouseEvent) => {
    if (event.timeStamp - lastPointerDown.current < 1000) return;
    toggle();
  };

  const images = layers.map((layer, index) => (
    <BandImage
      key={layer.src}
      src={layer.src}
      alt={layer.alt}
      sizes={sizes}
      hidden={index !== active}
      preload={index === 0 ? preload : undefined}
      loading={index === 0 ? undefined : "eager"}
      className={`transition-opacity duration-150 ease-out motion-reduce:transition-none ${
        index === active ? "opacity-100" : "opacity-0"
      }`}
    />
  ));

  // Sin alternativas, la foto es solo una foto.
  if (photo.alternates.length === 0) {
    return (
      <div className={`relative overflow-hidden ${className}`}>{images}</div>
    );
  }

  return (
    <button
      type="button"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
      className={`relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema ${className}`}
    >
      {images}
      <span className="sr-only">(ver más fotos)</span>
    </button>
  );
}
