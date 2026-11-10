export type BandPhoto = {
  src: string;
  alt: string;
};

// Foto del collage: la que se ve y las que pasan con el mouse.
export type SwappablePhoto = BandPhoto & {
  alternates: BandPhoto[];
};

export type Member = {
  id: string;
  name: string;
  role: string;
  description: string | null;
  photo: BandPhoto | null;
};

// Página /banda: documento "Historia de la banda" e "Integrantes" del Studio.
export type BandPage = {
  intro: string | null;
  caption: string | null;
  mainPhoto: SwappablePhoto | null;
  secondaryPhoto: SwappablePhoto | null;
  members: Member[];
};
