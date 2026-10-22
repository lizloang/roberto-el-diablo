import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
};

// El PNG del logo funciona como máscara alfa: el color sale de `currentColor`,
// así que basta con cambiar `text-*` para usarlo en crema o en negro.
export function Logo({ className = "" }: LogoProps) {
  return (
    <span
      role="img"
      aria-label={siteConfig.name}
      className={`block aspect-[501/360] bg-current mask-contain mask-center mask-no-repeat ${className}`}
      style={{
        maskImage: `url(${siteConfig.logoSrc})`,
        WebkitMaskImage: `url(${siteConfig.logoSrc})`,
      }}
    />
  );
}
