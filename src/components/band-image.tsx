"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type BandImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
  loading?: "eager" | "lazy";
  // Capas ocultas del cambio de foto: fuera del árbol de accesibilidad.
  hidden?: boolean;
};

// Foto que llena su contenedor (fill). Si el archivo todavía no existe, en
// su lugar se ve un recuadro con el nombre del archivo que falta.
export function BandImage({
  src,
  alt,
  sizes,
  className = "",
  preload,
  loading,
  hidden,
}: BandImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // El error pudo ocurrir antes de hidratar, cuando onError aún no escuchaba.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role={hidden ? undefined : "img"}
        aria-label={hidden ? undefined : alt}
        aria-hidden={hidden || undefined}
        className={`absolute inset-0 flex items-center justify-center border border-dashed border-crema/30 bg-crema/5 p-4 text-center font-pixel text-[11px] leading-relaxed tracking-[0.2em] break-all text-crema/60 uppercase ${className}`}
      >
        Falta {src.split("/").pop()}
      </div>
    );
  }

  return (
    <Image
      ref={ref}
      src={src}
      alt={hidden ? "" : alt}
      aria-hidden={hidden || undefined}
      fill
      sizes={sizes}
      preload={preload}
      loading={loading}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
