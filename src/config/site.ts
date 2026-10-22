export const siteConfig = {
  name: "Roberto el Diablo",
  description: "Banda de rock de Santa Catarina, Nuevo León.",
  locale: "es_MX",
  // Archivo oficial del logo: PNG o SVG de un solo color con fondo
  // transparente. Se usa como máscara, así que el color lo pone el CSS.
  logoSrc: "/images/logo/roberto-el-diablo.png",
  nav: [
    { label: "Música", href: "/musica" },
    { label: "Shows", href: "/shows" },
    { label: "Merch", href: "/merch" },
    { label: "La banda", href: "/banda" },
    // TODO: no existe ruta ni URL de tienda; apunta a /merch mientras tanto.
    { label: "Tienda", href: "/merch" },
  ],
} as const;
