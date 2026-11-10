import { BandImage } from "@/components/band-image";
import { members } from "@/data/banda";

// Sección #banda: una tarjeta por integrante. Los datos se editan en
// src/data/banda.ts. El hero baja aquí con su enlace.
export function BandMembers() {
  return (
    <section
      id="banda"
      aria-labelledby="banda-title"
      className="scroll-mt-8 px-5 pb-24 md:px-16 md:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="banda-title"
          className="font-pixel text-xl tracking-[0.25em] uppercase md:text-2xl"
        >
          Integrantes
        </h2>

        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <li key={`${member.photo.src}-${index}`}>
              <article>
                <div className="relative aspect-4/5 overflow-hidden bg-crema/5">
                  <BandImage
                    src={member.photo.src}
                    alt={member.photo.alt}
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
                  />
                </div>
                <h3 className="mt-5 font-display text-2xl tracking-wide uppercase">
                  {member.name}
                </h3>
                <p className="mt-1 font-pixel text-xs tracking-[0.25em] text-rojo-vivo uppercase">
                  {member.role}
                </p>
                <p className="mt-3 leading-relaxed text-crema/80">
                  {member.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
