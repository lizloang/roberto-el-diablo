import { useId } from "react";
import { PlayFlameIcon } from "@/components/play-flame-icon";
import { SpinningCd } from "@/components/spinning-cd";

import type { NewRelease as NewReleaseProps } from "@/types/album";

// Los títulos largos (pasa más con canciones) bajan de tamaño para caber en
// el disco debajo del anillo.
function titleSize(title: string) {
  if (title.length <= 12) return "text-[8cqw]";
  if (title.length <= 20) return "text-[6cqw]";
  return "text-[4.5cqw]";
}

// Primera sección de la portada: el CD del nuevo lanzamiento al centro y,
// encima y sin girar, el tipo, el título y el play para escucharlo. Todo
// escala con el disco (unidades cqw). Para que se lea sobre la foto solo hay
// una sombra suave en las letras: la portada no se oscurece.
export function NewRelease({
  cover,
  coverAlt,
  eyebrow,
  kind,
  listenLabel,
  title,
  listenUrl,
}: NewReleaseProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col items-center px-5 pt-8 pb-24 md:px-16 md:pt-1 md:pb-32"
    >
      <SpinningCd src={cover} alt={coverAlt} preload>
        {/* Toda la información abajo del anillo central; el centro (anillo
            de 30 % y agujero) queda libre. Las posiciones van en % del disco
            y los tamaños en cqw, así todo escala con él. */}
        <div className="relative size-full text-crema [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
          {/* Empieza en el 66 %, después del anillo (65 %). El padding
              izquierdo de las frases compensa el tracking tras la última
              letra. */}
          <div className="absolute inset-x-0 top-[66%] flex flex-col items-center">
            <h2
              id={titleId}
              className={`max-w-[70cqw] text-center font-release-title leading-none text-balance uppercase ${titleSize(title)}`}
            >
              {title}
            </h2>

            <p className="mt-[1.2cqw] pl-[0.35em] font-release-info text-[3.4cqw] leading-none tracking-[0.35em] uppercase">
              {eyebrow}
            </p>

            {listenUrl && (
              <a
                href={listenUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Escuchar ${kind === "canción" ? "la" : "el"} ${kind} ${title}`}
                className="group mt-[1.8cqw] flex flex-col items-center gap-[1.2cqw] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crema"
              >
                <span className="pl-[0.35em] font-release-info text-[2.4cqw] leading-none tracking-[0.35em] uppercase">
                  {listenLabel}
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
