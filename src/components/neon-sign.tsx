"use client";

import { motion } from "motion/react";
import { useId } from "react";

type NeonSignProps = {
  text: string;
  className?: string;
};

// Letrero de neón: solo el contorno de las letras (fill="none"), dibujado en
// tres capas del mismo trazo. Abajo un halo rojo amplio y desenfocado, en
// medio el brillo rojo intenso y arriba el núcleo casi blanco del tubo.
// Se enciende una vez al entrar en pantalla y se queda encendido.
export function NeonSign({ text, className = "" }: NeonSignProps) {
  const id = useId();
  const halo = `${id}-halo`;
  const glow = `${id}-glow`;

  const letters = {
    x: "50%",
    y: 132,
    textAnchor: "middle",
    fontSize: 120,
    letterSpacing: 6,
    fill: "none",
    strokeLinejoin: "round",
    style: { fontFamily: "var(--font-heading)" },
  } as const;

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 520 170"
      className={`overflow-visible ${className}`}
      initial={{ opacity: 0.08 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <defs>
        <filter id={halo} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={glow} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <text
        {...letters}
        stroke="#d2140f"
        strokeWidth={12}
        opacity={0.7}
        filter={`url(#${halo})`}
      >
        {text}
      </text>
      <text
        {...letters}
        stroke="#ff3b2f"
        strokeWidth={7}
        filter={`url(#${glow})`}
      >
        {text}
      </text>
      <text {...letters} stroke="#ff493b" strokeWidth={4}>
        {text}
      </text>
      <text {...letters} stroke="#ffe7d8" strokeWidth={1.6}>
        {text}
      </text>
    </motion.svg>
  );
}
