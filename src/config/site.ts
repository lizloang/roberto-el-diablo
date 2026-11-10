export const siteConfig = {
  name: "Roberto el Diablo",
  description: "Banda de rock de Santa Catarina, Nuevo León.",
  locale: "es_MX",
  // Archivo oficial del logo: PNG o SVG de un solo color con fondo
  // transparente. Se usa como máscara, así que el color lo pone el CSS.
  logoSrc: "/images/logo/roberto-el-diablo.png",
  // Menú del header (escritorio y móvil). Merch y Tienda vuelven cuando
  // haya productos: { label: "Merch", href: "/merch" }.
  nav: [
    { label: "Música", href: "/musica" },
    { label: "Shows", href: "/shows" },
    { label: "La banda", href: "/banda" },
  ],
} as const;
