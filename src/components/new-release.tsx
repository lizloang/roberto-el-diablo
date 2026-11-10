import { useId } from "react";
import { FitTitle } from "@/components/fit-title";
import { PlayFlameIcon } from "@/components/play-flame-icon";
import { SpinningCd } from "@/components/spinning-cd";

type NewReleaseProps = {
  cover: string;
  coverAlt: string;
  // Rótulo sobre el título: "Nuevo álbum", "Nuevo sencillo"…
  eyebrow: string;
  // Tipo de lanzamiento, para el aria-label del play: "álbum", "EP"…
  kind: string;
  title: string;
  // Sin liga no se muestra el play.
  listenUrl?: string;
  // Slug del lanzamiento: el disco lleva a ese álbum en la sección de música.
  slug?: string;
};

// Primera sección de la portada: el CD del nuevo lanzamiento al centro y,
// encima y sin girar, el tipo, el título y el play para escucharlo. Todo
// escala con el disco (unidades cqw). Para que se lea sobre la foto solo hay
// una sombra suave en las letras: la portada no se oscurece.
export function NewRelease({
  cover,
  coverAlt,
  eyebrow,
  kind,
  title,
  listenUrl,
  slug,
}: NewReleaseProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col items-center px-5 pt-8 pb-24 md:px-16 md:pt-1 md:pb-32"
    >
      <SpinningCd
        src={cover}
        alt={coverAlt}
        preload
        album={slug ? { slug, title } : undefined}
      >
        {/* Toda la información abajo del anillo central; el centro (anillo
            de 30 % y agujero) queda libre. Las posiciones van en % del disco
            y los tamaños en cqw, así todo escala con él. */}
        <div className="relative size-full text-crema [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
          {/* Empieza en el 66 %, después del anillo (65 %). El padding
              izquierdo de las frases compensa el tracking tras la última
              letra. */}
          <div className="absolute inset-x-0 top-[66%] flex flex-col items-center">
            {/* 8cqw si cabe; un título largo se achica hasta 4.5cqw para
                quedar en un renglón de 76cqw (lo que deja libre el borde
                del disco a esa altura) y, si aun así no cabe, se parte. */}
            <FitTitle
              id={titleId}
              maxSize={8}
              minSize={4.5}
              maxWidth={76}
              className="text-center font-release-title leading-none uppercase"
            >
              {title}
            </FitTitle>

            <p className="mt-[1.2cqw] pl-[0.35em] font-release-info text-[3.4cqw] leading-none tracking-[0.35em] uppercase">
              {eyebrow}
            </p>

            {listenUrl && (
              <a
                href={listenUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escuchar el ${kind} ${title}`}
                className="group pointer-events-auto mt-[1.8cqw] flex flex-col items-center gap-[1.2cqw] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema"
              >
                <span className="pl-[0.35em] font-release-info text-[2.4cqw] leading-none tracking-[0.35em] uppercase">
                  Escúchalo aquí
                </span>
                {/* Círculo negro (el fondo de la página) con el play de
                    llamas. Crece un poco con el mouse o el foco (no con
                    movimiento reducido). */}
                <span className="flex size-[11cqw] items-center justify-center rounded-full bg-negro transition-transform duration-300 group-hover:scale-108 group-focus-visible:scale-108 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100">
                  {/* Un poco a la derecha: el triángulo pesa a la izquierda
                      y así se ve centrado. */}
                  <PlayFlameIcon className="w-[6cqw] translate-x-[0.4cqw]" />
                </span>
              </a>
            )}
          </div>
        </div>
      </SpinningCd>
    </section>
  );
}
