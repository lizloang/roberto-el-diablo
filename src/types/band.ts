export type BandPhoto = {
  src: string;
  alt: string;
};

// Foto del collage: la que se ve y las que pasan con el mouse.
export type SwappablePhoto = BandPhoto & {
  alternates: BandPhoto[];
};

// Presentación de la banda: documento "Historia de la banda" del Studio.
export type BandPage = {
  intro: string | null;
  caption: string | null;
  mainPhoto: SwappablePhoto | null;
  secondaryPhoto: SwappablePhoto | null;
};
