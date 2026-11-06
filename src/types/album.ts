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
