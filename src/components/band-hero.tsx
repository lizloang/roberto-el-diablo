import Link from "next/link";
import { SwapPhoto } from "@/components/swap-photo";
import { siteConfig } from "@/config/site";
import type { SwappablePhoto } from "@/types/band";

// Texto de la invitación que baja a los integrantes.
const LINK_LABEL = "Conoce a la banda";

type BandHeroProps = {
  intro: string | null;
  caption: string | null;
  mainPhoto: SwappablePhoto | null;
  secondaryPhoto: SwappablePhoto | null;
  // Sin integrantes no hay a dónde ir: no se muestra la invitación.
  hasMembers: boolean;
  // A dónde lleva la invitación: "#banda" en /banda (scroll suave en la
  // misma página) o "/banda#banda" desde la portada.
  membersHref: string;
  // h1 en /banda; h2 en la portada, que ya tiene su h1.
  headingLevel: "h1" | "h2";
  // Precarga la foto grande solo donde es lo primero que se ve (/banda).
  preload?: boolean;
};

// Presentación de la banda: collage de dos fotos (la chica encimada en la
// esquina de la grande) y, al lado, el texto, que lleva a los integrantes. Va
// arriba en /banda y después del CD en la portada, sobre el negro liso de la
// página. En pantallas chicas todo se apila. Los textos y las fotos se editan
// en el Studio, en "Historia de la banda"; lo que esté vacío no se muestra.
export function BandHero({
  intro,
  caption,
  mainPhoto,
  secondaryPhoto,
  hasMembers,
  membersHref,
  headingLevel: Heading,
  preload = false,
}: BandHeroProps) {
  // Dentro de la página basta un <a>; a otra página, Link de Next.
  const LinkTag = membersHref.startsWith("#") ? "a" : Link;

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

        {/* Presentación. El párrafo y la invitación forman un solo enlace
            que lleva a los integrantes. */}
        <div>
          <Heading
            id="banda-hero-title"
            className="font-pixel text-2xl leading-tight tracking-[0.2em] uppercase md:text-4xl"
          >
            {siteConfig.name}
          </Heading>

          {hasMembers ? (
            <LinkTag
              href={membersHref}
              className="group mt-6 block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-crema md:mt-8"
            >
              {intro && <Intro text={intro} linked />}
              <span className="mt-6 inline-flex items-center gap-3 font-pixel text-sm tracking-[0.25em] text-rojo-vivo uppercase">
                {/* Subrayado que crece de izquierda a derecha. */}
                <span className="bg-linear-to-r from-current to-current bg-size-[0%_1px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-size-[100%_1px] group-focus-visible:bg-size-[100%_1px] motion-reduce:transition-none">
                  {LINK_LABEL}
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-y-1 group-focus-visible:translate-y-1 motion-reduce:transition-none"
                >
                  ↓
                </span>
              </span>
            </LinkTag>
          ) : (
            intro && (
              <div className="mt-6 md:mt-8">
                <Intro text={intro} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function Intro({ text, linked = false }: { text: string; linked?: boolean }) {
  return (
    <p
      className={`text-lg leading-relaxed whitespace-pre-line text-crema/90 md:text-xl ${
        linked ? "transition-colors duration-300 group-hover:text-crema" : ""
      }`}
    >
      {text}
    </p>
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
  const captionClass =
    "font-pixel text-[11px] leading-relaxed tracking-[0.3em] text-crema/80 uppercase md:text-sm";

  return (
    <div className={`relative ${secondaryPhoto ? "pb-[34%]" : ""}`}>
      <div className="relative w-[82%]">
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
      </div>

      {secondaryPhoto && (
        <div className="absolute right-0 bottom-0 w-[40%] shadow-[0_18px_40px_rgb(0_0_0/0.6)]">
          <SwapPhoto
            photo={secondaryPhoto}
            sizes="(min-width: 1024px) 280px, 40vw"
            className="aspect-4/5 w-full"
          />
        </div>
      )}
    </div>
  );
}
