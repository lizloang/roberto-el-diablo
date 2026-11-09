export type AlbumLink = {
  // Valor de PLATFORMS: "spotify", "appleMusic"…
  platform: string;
  label: string;
  href: string;
};

export type Album = {
  slug: string;
  title: string;
  year: number;
  cover: string;
  coverAlt: string;
  // Solo enlaces confirmados; la vista de detalle no muestra nada inventado.
  links: AlbumLink[];
};

// Lo que gira en el CD al inicio de la portada (documento "Nuevo
// lanzamiento" del Studio).
export type NewRelease = {
  title: string;
  // "Nuevo álbum", "Nuevo sencillo"…
  eyebrow: string;
  // Tipo dentro de una frase: "álbum", "EP", "sencillo".
  kind: string;
  image: string;
  imageAlt: string;
  listenUrl?: string;
};
