// Textos y fotos de la página /banda. Edita aquí: los componentes no
// necesitan cambios. Las fotos van en public/images/banda/ y se escriben
// desde /images/banda/… (sin "public").
//
// Mientras falte un archivo, en su lugar se ve un recuadro con su nombre.

export type BandPhoto = {
  src: string;
  // Describe la foto para lectores de pantalla y buscadores: quién sale,
  // dónde y qué hace. No empieces con "Foto de…".
  alt: string;
};

export type SwappablePhoto = BandPhoto & {
  // Se muestran al pasar el mouse (o con un tap en el celular), una por
  // vez y en este orden. Vacío: la foto no cambia.
  alternates: BandPhoto[];
};

export type Member = {
  name: string;
  role: string;
  description: string;
  photo: BandPhoto;
};

// Hero: collage de dos fotos con la presentación de la banda al lado.
export const bandHero = {
  title: "Roberto el Diablo",
  description: "[DESCRIPCIÓN DE LA BANDA]",
  // Texto del enlace que baja a los integrantes.
  linkLabel: "Conoce a la banda",
  // Frase corta debajo de la foto grande, en la tipografía pixel.
  caption: "Rock desde Santa Catarina, N.L.",

  // Foto grande, a la izquierda. Horizontal (4:3).
  mainPhoto: {
    src: "/images/banda/hero-1.jpg",
    alt: "[DESCRIPCIÓN DE LA FOTO: la banda completa]",
    alternates: [
      {
        src: "/images/banda/hero-1-alt-1.jpg",
        alt: "[DESCRIPCIÓN DE LA FOTO]",
      },
      {
        src: "/images/banda/hero-1-alt-2.jpg",
        alt: "[DESCRIPCIÓN DE LA FOTO]",
      },
    ],
  } satisfies SwappablePhoto,

  // Foto chica, abajo a la derecha, encimada en la esquina de la grande.
  // Vertical (4:5).
  secondaryPhoto: {
    src: "/images/banda/hero-2.jpg",
    alt: "[DESCRIPCIÓN DE LA FOTO]",
    alternates: [
      {
        src: "/images/banda/hero-2-alt-1.jpg",
        alt: "[DESCRIPCIÓN DE LA FOTO]",
      },
    ],
  } satisfies SwappablePhoto,
};

// Sección #banda: una tarjeta por integrante, en este orden. Fotos
// verticales (4:5).
export const members: Member[] = [
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-1.jpg",
      alt: "[NOMBRE] [DESCRIPCIÓN DE LA FOTO]",
    },
  },
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-2.jpg",
      alt: "[NOMBRE] [DESCRIPCIÓN DE LA FOTO]",
    },
  },
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-3.jpg",
      alt: "[NOMBRE] [DESCRIPCIÓN DE LA FOTO]",
    },
  },
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-4.jpg",
      alt: "[NOMBRE] [DESCRIPCIÓN DE LA FOTO]",
    },
  },
];
