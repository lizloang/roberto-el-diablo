import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Tipografía base provisional: cambia las fuentes aquí; los tokens
// --font-sans y --font-display en globals.css no necesitan cambios.
const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const heading = Instrument_Serif({
  variable: "--font-heading",
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
      className={`${body.variable} ${heading.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
