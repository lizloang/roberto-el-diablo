import { BandImage } from "@/components/band-image";
import type { Member } from "@/types/band";

type BandMembersProps = {
  members: Member[];
};

// Sección #banda: una tarjeta por integrante actual, en su orden. Se editan
// en el Studio, en "Integrantes". El hero baja aquí con su enlace.
export function BandMembers({ members }: BandMembersProps) {
  if (members.length === 0) return null;

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
          {members.map((member) => (
            <li key={member.id}>
              <article>
                <div className="relative aspect-4/5 overflow-hidden bg-crema/5">
                  {member.photo && (
                    <BandImage
                      src={member.photo.src}
                      alt={member.photo.alt}
                      sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
                    />
                  )}
                </div>
                <h3 className="mt-5 font-display text-2xl tracking-wide uppercase">
                  {member.name}
                </h3>
                <p className="mt-1 font-pixel text-xs tracking-[0.25em] text-rojo-vivo uppercase">
                  {member.role}
                </p>
                {member.description && (
                  <p className="mt-3 leading-relaxed whitespace-pre-line text-crema/80">
                    {member.description}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
