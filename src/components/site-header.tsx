import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { ScrollRevealHeader } from "@/components/scroll-reveal-header";

type SiteHeaderProps = {
  // Oculta la barra hasta que el usuario hace scroll (solo en el Home).
  revealOnScroll?: boolean;
};

export function SiteHeader({ revealOnScroll = false }: SiteHeaderProps) {
  const header = (
    <header className="flex items-center justify-between px-5 py-5 text-crema md:px-16">
      <Link href="/" className="relative z-50">
        <Logo className="w-20" />
      </Link>

      <nav aria-label="Principal" className="hidden md:block">
        <ul className="flex gap-10">
          {siteConfig.nav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-xs font-bold tracking-[0.2em] uppercase underline-offset-8 hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <MobileMenu />
    </header>
  );

  if (!revealOnScroll) return header;

  return (
    <>
      {/* La barra fija sale del flujo: este espacio conserva su alto
          (py-5 + logo w-20 en proporción 501:360) para que el contenido
          de abajo no se mueva. */}
      <div aria-hidden className="h-[calc(2.5rem+5rem*360/501)] shrink-0" />
      <ScrollRevealHeader>{header}</ScrollRevealHeader>
    </>
  );
}
