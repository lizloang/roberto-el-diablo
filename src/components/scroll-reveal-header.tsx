"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useState, type ReactNode } from "react";

// Píxeles de scroll a partir de los cuales aparece la barra.
const REVEAL_OFFSET = 100;

type ScrollRevealHeaderProps = {
  children: ReactNode;
};

export function ScrollRevealHeader({ children }: ScrollRevealHeaderProps) {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > REVEAL_OFFSET);
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50"
      initial={false}
      // Con movimiento reducido solo cambia la opacidad, sin deslizar.
      animate={{
        opacity: visible ? 1 : 0,
        y: visible || reduceMotion ? 0 : "-100%",
      }}
      transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: "easeOut" }}
      // Oculta: sin clics ni foco de teclado.
      inert={!visible}
    >
      {children}
    </motion.div>
  );
}
