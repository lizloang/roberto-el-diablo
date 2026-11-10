"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";
import { useId, useRef } from "react";
import { useBehindIntro } from "@/components/intro-screen";

type NeonSignProps = {
  text: string;
  className?: string;
};

// Apagado: el tubo se adivina apenas.
const OFF = 0.08;

// Encendido de tubo de neón: titila dos veces y se queda prendido. Menos de
// tres destellos por segundo (WCAG 2.3.1), que importa en un letrero grande
// y rojo.
const FLICKER: TargetAndTransition = {
  opacity: [OFF, 1, 0.2, 0.2, 1, 0.5, 1],
  transition: {
    duration: 1.2,
    times: [0, 0.15, 0.25, 0.56, 0.69, 0.81, 1],
    ease: "linear",
  },
};

// Con movimiento reducido, sin parpadeo: solo se enciende suave.
const FADE_IN: TargetAndTransition = {
  opacity: 1,
  transition: { duration: 1.4, ease: [0.4, 0, 0.2, 1] },
};

// Letrero de neón: solo el contorno de las letras (fill="none"), dibujado en
// tres capas del mismo trazo. Abajo un halo rojo amplio y desenfocado, en
// medio el brillo rojo intenso y arriba el núcleo casi blanco del tubo.
// Se enciende una vez al entrar en pantalla (y ya sin la intro encima) y se
// queda encendido.
export function NeonSign({ text, className = "" }: NeonSignProps) {
  const id = useId();
  const halo = `${id}-halo`;
  const glow = `${id}-glow`;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const behindIntro = useBehindIntro();
  const reduceMotion = useReducedMotion();
  const lit = inView && !behindIntro;

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
      ref={ref}
      aria-hidden
      viewBox="0 0 520 170"
      className={`overflow-visible ${className}`}
      initial={{ opacity: OFF }}
      animate={lit ? (reduceMotion ? FADE_IN : FLICKER) : { opacity: OFF }}
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
