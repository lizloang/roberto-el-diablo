"use client";

import { useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { BandImage } from "@/components/band-image";
import type { SwappablePhoto } from "@/data/banda";

type SwapPhotoProps = {
  photo: SwappablePhoto;
  sizes: string;
  // true para la foto principal de la página (la primera que se ve).
  preload?: boolean;
  className?: string;
};

// Foto del collage que cambia a una alternativa con un crossfade (400 ms):
// - Mouse: al entrar muestra la siguiente alternativa y al salir vuelve a la
//   original. Cada hover avanza a otra alternativa.
// - Táctil o teclado (Enter/Espacio): un tap alterna entre la original y la
//   siguiente alternativa.
// - Movimiento reducido: el cambio es directo, sin fundido.
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
  // Índice (en alternates) de la próxima alternativa a mostrar.
  const nextAlternate = useRef(0);
  // Último toque o clic (timeStamp): el click que lo sigue ya no cuenta.
  const lastPointerDown = useRef(-Infinity);

  const showNextAlternate = () => {
    const index = nextAlternate.current;
    nextAlternate.current = (index + 1) % photo.alternates.length;
    setActive(index + 1);
  };
  const showOriginal = () => setActive(0);

  // Opción 2: avanzar a la siguiente foto en cada hover, sin regresar a la
  // original al quitar el mouse. Para usarla, en onPointerEnter llama a
  // advance() en vez de showNextAlternate() y quita showOriginal() de
  // onPointerLeave.
  // const advance = () => setActive((index) => (index + 1) % layers.length);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") showNextAlternate();
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") showOriginal();
  };
  const toggle = () => {
    if (active === 0) showNextAlternate();
    else showOriginal();
  };
  const onPointerDown = (event: PointerEvent) => {
    lastPointerDown.current = event.timeStamp;
  };
  // Táctil y pluma: cambia al levantar el dedo, sin esperar al click (no
  // siempre llega). Si el dedo arrastra para hacer scroll, el navegador manda
  // pointercancel en vez de pointerup y la foto no cambia.
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
      className={`transition-opacity duration-400 ease-in-out motion-reduce:transition-none ${
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
      <span className="sr-only">(cambiar foto)</span>
    </button>
  );
}
