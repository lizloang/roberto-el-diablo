import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";

export function SiteHeader() {
  return (
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
}
