"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { siteConfig } from "@/config/site";

// Llamas del logo: intensidad de la deformación (en unidades del viewBox) y
// cuánto tarda en recorrer los 8 cuadros del ruido. Más scale = llamas más
// movidas; menos dur = más rápidas.
const FLAME_SCALE = 12;
const FLAME_DUR = "0.9s";

// Capas del logo, mismo tamaño (1329×799) y fondo transparente. Ya vienen en
// crema, el color del logo.
const LETTERS_SRC = "/images/logo/logo-letras.png";
const FLAMES_SRC = "/images/logo/logo-llamas.png";

type AnimatedLogoProps = {
  className?: string;
};

// Logo de la portada con las llamas vivas: las letras quedan quietas y la capa
// de llamas pasa por un ruido que cambia a saltos, como dibujo animado. Sin
// animación si el sistema pide reducir movimiento, y en pausa mientras no se
// ve en pantalla o queda tapado por la intro (el sitio de atrás está inert).
export function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();
  // Id único por instancia; useId trae caracteres que no sirven en url(#…).
  const filterId = `llamas-caricatura-${useId().replace(/[^\w-]/g, "")}`;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    if (reduceMotion) {
      svg.pauseAnimations();
      return;
    }

    let onScreen = false;
    const update = () => {
      if (onScreen && !svg.closest("[inert]")) svg.unpauseAnimations();
      else svg.pauseAnimations();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    visibility.observe(svg);

    // La intro marca <html data-intro> al abrirse y al cerrarse.
    const intro = new MutationObserver(update);
    intro.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-intro"],
    });

    return () => {
      visibility.disconnect();
      intro.disconnect();
    };
  }, [reduceMotion]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1329 799"
      role="img"
      aria-label={siteConfig.name}
      className={`block h-auto w-full ${className}`}
    >
      <defs>
        <filter id={filterId} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.015 0.04"
            numOctaves={2}
            seed={1}
            result="n"
          >
            <animate
              attributeName="seed"
              dur={FLAME_DUR}
              values="1;2;3;4;5;6;7;8"
              calcMode="discrete"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale={FLAME_SCALE}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <image href={LETTERS_SRC} width="1329" height="799" />
      {/* Con movimiento reducido, CSS quita el filtro (le gana al atributo):
          así el HTML del servidor y el del navegador son iguales. */}
      <image
        href={FLAMES_SRC}
        width="1329"
        height="799"
        filter={`url(#${filterId})`}
        className="motion-reduce:filter-none"
      />
    </svg>
  );
}
