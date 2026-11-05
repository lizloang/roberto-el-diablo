import type { Metadata } from "next";
import { Anton, Courier_Prime, Josefin_Sans, Manrope } from "next/font/google";
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

// Títulos de trazo fino (Próximos shows): geométrica en peso 200.
const accent = Josefin_Sans({
  variable: "--font-thin",
  subsets: ["latin"],
  weight: "200",
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
    <html
      lang="es-MX"
      className={`${body.variable} ${heading.variable} ${accent.variable} ${typewriter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
