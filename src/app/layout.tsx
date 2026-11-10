import type { Metadata } from "next";
import { Anton, Courier_Prime, Josefin_Sans, Manrope } from "next/font/google";
import {
  IntroHeadScript,
  IntroScreen,
  SITE_ID,
} from "@/components/intro-screen";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Tipografías del sistema de diseño en Figma: Manrope (texto) y Anton
// (títulos). Los tokens --font-sans y --font-display en globals.css no
// necesitan cambios.
const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const heading = Anton({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

// Títulos de trazo fino (Próximos shows): geométrica en peso 200. El 700
// es para los títulos en bold (font-bold): el álbum en /musica y el nombre
// de la banda en la historia. Lo demás se queda en 200.
const accent = Josefin_Sans({
  variable: "--font-thin",
  subsets: ["latin"],
  weight: ["200", "700"],
});

// Máquina de escribir para los datos de las fechas: lista de gira impresa.
const typewriter = Courier_Prime({
  variable: "--font-typewriter",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script del head marca data-intro antes de
    // que React hidrate.
    <html
      lang="es-MX"
      className={`${body.variable} ${heading.variable} ${accent.variable} ${typewriter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <IntroHeadScript />
        {/* Sin JavaScript no se puede entrar: la intro no se muestra. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>#intro-entrada{display:none!important}html{overflow:auto!important}</style>",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <IntroScreen />
        {/* contents: no altera el flex del body. Queda inert mientras la
            intro está arriba. */}
        <div id={SITE_ID} className="contents">
          {children}
        </div>
      </body>
    </html>
  );
}
