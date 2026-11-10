"use client";

import { useLayoutEffect, useRef, useState } from "react";

type FitTitleProps = {
  id?: string;
  className?: string;
  children: string;
  // Tamaños en cqw (del contenedor, el disco).
  maxSize: number;
  minSize: number;
  // Ancho máximo del título, en cqw.
  maxWidth: number;
};

// Ancho promedio de una mayúscula, en em, para la primera estimación (fuente
// condensada). La medición real la corrige.
const AVG_CHAR_EM = 0.5;

// Título de un renglón que se achica solo para caber en maxWidth. Si ni con
// minSize cabe, se parte en renglones balanceados. Sale del servidor con un
// tamaño estimado por el largo y, ya en el navegador, se mide con la fuente
// cargada. Como todo va en cqw, la proporción no cambia al escalar el disco:
// solo se vuelve a medir si cambia el texto o la fuente.
export function FitTitle({
  id,
  className = "",
  children,
  maxSize,
  minSize,
  maxWidth,
}: FitTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [size, setSize] = useState(() =>
    clamp(maxWidth / (children.length * AVG_CHAR_EM), minSize, maxSize),
  );
  const [wrap, setWrap] = useState(false);

  useLayoutEffect(() => {
    const title = ref.current;
    if (!title) return;
    let cancelled = false;

    const fit = () => {
      // El contenedor del título mide lo mismo que el disco.
      const discWidth = title.parentElement?.clientWidth;
      if (cancelled || !discWidth) return;

      // Ancho natural en un renglón, medido a maxSize.
      const { fontSize, whiteSpace } = title.style;
      title.style.fontSize = `${maxSize}cqw`;
      title.style.whiteSpace = "nowrap";
      const natural = title.scrollWidth;
      title.style.fontSize = fontSize;
      title.style.whiteSpace = whiteSpace;

      const available = (maxWidth / 100) * discWidth;
      const fitted = (maxSize * available) / natural;
      setSize(clamp(fitted, minSize, maxSize));
      setWrap(fitted < minSize);
    };

    fit();
    // Si la fuente aún no cargaba, se vuelve a medir con la buena.
    document.fonts?.ready.then(fit);
    return () => {
      cancelled = true;
    };
  }, [children, maxSize, minSize, maxWidth]);

  return (
    <h2
      ref={ref}
      id={id}
      className={`${wrap ? "text-balance" : "whitespace-nowrap"} ${className}`}
      style={{ fontSize: `${size}cqw`, maxWidth: `${maxWidth}cqw` }}
    >
      {children}
    </h2>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
