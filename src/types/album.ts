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

// El lanzamiento del CD de la portada (álbum, EP o sencillo).
export type NewRelease = {
  title: string;
  // Rótulo bajo el título: "Nuevo álbum", "Nueva canción"…
  eyebrow: string;
  // Para el aria-label del play: "álbum", "canción"…
  kind: string;
  // Texto sobre el play: "Escúchalo aquí" / "Escúchala aquí".
  listenLabel: string;
  cover: string;
  coverAlt: string;
  // Sin liga no se muestra el play.
  listenUrl?: string;
};
