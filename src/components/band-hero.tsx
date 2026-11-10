"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useBehindIntro } from "@/components/intro-screen";
import { SwapPhoto } from "@/components/swap-photo";
import { siteConfig } from "@/config/site";
import type { SwappablePhoto } from "@/types/band";

type BandHeroProps = {
  intro: string | null;
  caption: string | null;
  mainPhoto: SwappablePhoto | null;
  secondaryPhoto: SwappablePhoto | null;
  // h1 en /banda; h2 en la portada, que ya tiene su h1.
  headingLevel: "h1" | "h2";
  // Precarga la foto grande solo donde es lo primero que se ve (/banda).
  preload?: boolean;
};

// Presentación de la banda: collage de dos fotos (la chica encimada en la
// esquina de la grande) y, al lado, el nombre y la descripción. Va arriba en
// /banda y después del CD en la portada, sobre el negro liso de la página. En
// pantallas chicas todo se apila. Los textos y las fotos se editan en el
// Studio, en "Historia de la banda"; lo que esté vacío no se muestra.
export function BandHero({
  intro,
  caption,
  mainPhoto,
  secondaryPhoto,
  headingLevel: Heading,
  preload = false,
}: BandHeroProps) {
  return (
    <section
      aria-labelledby="banda-hero-title"
      className="px-5 pt-10 pb-20 md:px-16 md:pt-16 md:pb-28"
    >
      <div
        className={`mx-auto grid max-w-6xl items-center gap-14 lg:gap-20 ${
          mainPhoto ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : ""
        }`}
      >
        {mainPhoto && (
          <Collage
            mainPhoto={mainPhoto}
            secondaryPhoto={secondaryPhoto}
            caption={caption}
            preload={preload}
          />
        )}

        <div>
          {/* La letra de "Próximos shows" (ShowsTitle) en bold, como el
              título del álbum en /musica: mayúsculas espaciadas y rojo
              vivo. Aquí sí puede partirse en dos renglones si no cabe en la
              columna. */}
          <Heading
            id="banda-hero-title"
            className="font-accent text-2xl leading-tight font-bold tracking-[0.3em] text-rojo-vivo uppercase md:text-[2rem]"
          >
            {siteConfig.name}
          </Heading>

          {intro && (
            <p className="mt-6 text-lg leading-relaxed whitespace-pre-line text-crema/90 md:mt-8 md:text-xl">
              {intro}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// Collage. Las medidas van en % del ancho, así la foto chica siempre queda
// dentro de la pantalla: la grande (82 %, 4:3) y la chica (40 %, 4:5) pegada
// abajo a la derecha, encimada en la esquina. El padding de abajo deja lugar a
// la frase y decide qué tan abajo queda la chica: más padding, menos
// encimada. Sin foto chica, la frase va debajo de la grande, sin padding.
function Collage({
  mainPhoto,
  secondaryPhoto,
  caption,
  preload,
}: {
  mainPhoto: SwappablePhoto;
  secondaryPhoto: SwappablePhoto | null;
  caption: string | null;
  preload: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const behindIntro = useBehindIntro();
  const reduceMotion = useReducedMotion();
  const shown = reduceMotion || (inView && !behindIntro);
  const transition = {
    duration: reduceMotion ? 0 : 1.3,
    ease: [0.2, 0.75, 0.25, 1] as const,
  };
  const captionClass =
    "font-pixel text-[11px] leading-relaxed tracking-[0.3em] text-crema/80 uppercase md:text-sm";

  return (
    <div ref={ref} className={`relative ${secondaryPhoto ? "pb-[34%]" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={transition}
        className="relative w-[82%]"
      >
        <SwapPhoto
          photo={mainPhoto}
          preload={preload}
          sizes="(min-width: 1024px) 560px, 82vw"
          className="aspect-4/3 w-full"
        />
        {caption && (
          <p
            className={`mt-4 md:mt-6 ${captionClass} ${
              secondaryPhoto ? "absolute top-full left-0 w-[66%]" : ""
            }`}
          >
            {caption}
          </p>
        )}
      </motion.div>

      {secondaryPhoto && (
        <motion.div
          initial={{ opacity: 0, y: 65, rotate: 5 }}
          animate={
            shown
              ? { opacity: 1, y: 0, rotate: 0 }
              : { opacity: 0, y: 65, rotate: 5 }
          }
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.25 }}
          className="absolute right-0 bottom-0 w-[40%] shadow-[0_18px_40px_rgb(0_0_0/0.6)]"
        >
          <SwapPhoto
            photo={secondaryPhoto}
            sizes="(min-width: 1024px) 280px, 40vw"
            className="aspect-4/5 w-full"
          />
        </motion.div>
      )}
    </div>
  );
}
