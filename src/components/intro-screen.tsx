"use client";

import { useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatedLogo } from "@/components/animated-logo";

// Se guarda al entrar; con ella la intro no vuelve a salir en esta visita.
const STORAGE_KEY = "red-intro-vista";

// Sin intro en el Studio de Sanity ni si ya se entró en esta visita. La misma
// regla vive en shouldSkip() y en el script del head.
const SKIP_CHECK = `location.pathname.indexOf("/studio")===0||sessionStorage.getItem("${STORAGE_KEY}")!==null`;

function shouldSkip() {
  if (location.pathname.startsWith("/studio")) return true;
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

// Contenedor del sitio, hermano de la intro en el layout.
export const SITE_ID = "sitio";

// ¿El sitio está tapado por la intro? La intro marca <html data-intro> al
// abrirse y al cerrarse, y deja el sitio inert mientras está arriba. Sirve
// para que las animaciones de entrada esperen a que se vea el sitio.
function subscribeToIntro(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-intro"],
  });
  return () => observer.disconnect();
}

const isBehindIntro = () => document.getElementById(SITE_ID)?.inert ?? false;

export function useBehindIntro() {
  return useSyncExternalStore(subscribeToIntro, isBehindIntro, () => false);
}

// Corre en el <head> antes de pintar: si no toca intro, marca
// <html data-intro="vista"> y el CSS la oculta desde el primer cuadro. En el
// cliente se renderiza como text/plain para que React no lo vuelva a correr
// ni avise por la etiqueta <script> (guía "preventing flash" de Next).
export function IntroHeadScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(function(){try{if(${SKIP_CHECK})document.documentElement.setAttribute("data-intro","vista")}catch(e){}})()`,
      }}
    />
  );
}

type IntroState = "abierta" | "saliendo" | "cerrada";

// Pantalla de entrada: el logo con las llamas y "click para entrar". Toda la
// pantalla es un botón (click, tap, Enter o espacio). El sitio se carga
// debajo desde el inicio; mientras la intro está arriba queda inert y sin
// scroll (globals.css).
export function IntroScreen() {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<IntroState>("abierta");
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const html = document.documentElement;

    // El script del head ya la ocultó. En desarrollo, el Strict Mode borra
    // los atributos de <html> al remontar; se vuelve a poner.
    if (shouldSkip()) {
      html.dataset.intro = "vista";
      return;
    }

    const site = document.getElementById(SITE_ID);
    if (site) site.inert = true;
    html.dataset.intro = "abierta";
    buttonRef.current?.focus();

    return () => {
      if (site) site.inert = false;
    };
  }, []);

  if (state === "cerrada") return null;

  const close = () => {
    document.getElementById(SITE_ID)?.removeAttribute("inert");
    document.documentElement.dataset.intro = "vista";
    setState("cerrada");
  };

  const enter = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    if (reduceMotion) close();
    else setState("saliendo");
  };

  return (
    <button
      ref={buttonRef}
      id="intro-entrada"
      type="button"
      aria-label="Entrar al sitio"
      onClick={enter}
      // Tab no saca el foco de la intro (lo de atrás está inert); vuelve a
      // enfocar el botón mostrando el marco, para quien navega con teclado.
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        event.preventDefault();
        event.currentTarget.blur();
        event.currentTarget.focus({ focusVisible: true });
      }}
      onTransitionEnd={(event) => {
        if (event.target === event.currentTarget && state === "saliendo") {
          close();
        }
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-negro px-5 text-crema transition-opacity duration-[600ms] focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-crema motion-reduce:transition-none md:px-16 ${state === "saliendo" ? "pointer-events-none opacity-0" : ""}`}
    >
      {/* Mismo tamaño que el logo de la portada. */}
      <span className="block w-[95.6%] max-w-[50.2rem] md:w-[47.8%]">
        <AnimatedLogo />
      </span>
      <span
        aria-hidden="true"
        className="intro-pulso font-mono text-sm tracking-[0.3em] uppercase md:text-base"
      >
        <span className="pointer-coarse:hidden">Click para entrar</span>
        <span className="hidden pointer-coarse:inline">Toca para entrar</span>
      </span>
    </button>
  );
}
