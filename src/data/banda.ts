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
  // Mientras el mouse está encima (o tras un tap en el celular) la foto pasa
  // por todas, una tras otra y en este orden; al salir vuelve a la primera.
  // La velocidad se cambia en CYCLE_MS (src/components/swap-photo.tsx).
  // Vacío: la foto no cambia.
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
    alt: "Los cuatro integrantes de Roberto el Diablo, vestidos de negro y con lentes de cristal rojo, sentados en unas escaleras de concreto con un árbol al fondo.",
    alternates: [
      {
        src: "/images/banda/hero-1-alt-1.jpg",
        alt: "Los cuatro integrantes en un túnel blanco con sus instrumentos: guitarra rosa, baquetas, guitarra roja y bajo azul.",
      },
      {
        src: "/images/banda/hero-1-alt-2.jpg",
        alt: "Los cuatro integrantes vistos desde arriba, recargados y sentados en un muro de concreto.",
      },
      {
        src: "/images/banda/hero-1-alt-3.jpg",
        alt: "Los cuatro integrantes de pie en una plaza de ladrillo rojo rodeada de escalones de concreto; uno lleva sombrero vaquero y camisa bordada.",
      },
      {
        src: "/images/banda/hero-1-alt-4.jpg",
        alt: "Los cuatro integrantes vistos desde abajo, entre dos muros iluminados de naranja, con lentes de cristal rojo.",
      },
      {
        src: "/images/banda/hero-1-alt-5.jpg",
        alt: "Los cuatro integrantes corren hacia la cámara por un túnel blanco, movidos por la velocidad.",
      },
      {
        src: "/images/banda/hero-1-alt-6.jpg",
        alt: "Retrato de cerca de los cuatro integrantes frente a una pared blanca, con lentes de cristal rojo.",
      },
      {
        src: "/images/banda/hero-1-alt-7.jpg",
        alt: "Un bajo azul, una guitarra roja con un sombrero vaquero encima, una guitarra amarilla y un tambor recargados en una pared naranja.",
      },
    ],
  } satisfies SwappablePhoto,

  // Foto chica, abajo a la derecha, encimada en la esquina de la grande.
  // Vertical (4:5); se recorta al centro. Una alternativa puede repetir una
  // foto de la grande.
  secondaryPhoto: {
    src: "/images/banda/hero-2.jpg",
    alt: "Los cuatro integrantes con sus instrumentos frente a una pared naranja, bajo el letrero de la calle José Ma. Morelos.",
    alternates: [
      {
        src: "/images/banda/hero-2-alt-1.jpg",
        alt: "Un bajo azul, una guitarra roja con un sombrero vaquero encima, una guitarra amarilla y un tambor recargados en una pared naranja.",
      },
    ],
  } satisfies SwappablePhoto,
};

// Sección #banda: una tarjeta por integrante, en este orden. Fotos
// verticales (4:5). Las de ahora son recortes de la foto de la plaza
// (hero-1-alt-3.jpg), de izquierda a derecha; cámbialas por retratos
// individuales cuando los tengan.
export const members: Member[] = [
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-1.jpg",
      alt: "[NOMBRE], con sombrero vaquero negro y camisa negra bordada, en una plaza de ladrillo rojo.",
    },
  },
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-2.jpg",
      alt: "[NOMBRE], de camisa negra sin mangas y brazos cruzados, en una plaza de ladrillo rojo.",
    },
  },
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-3.jpg",
      alt: "[NOMBRE], de camisa negra y manos en la cintura, en una plaza de ladrillo rojo.",
    },
  },
  {
    name: "[NOMBRE]",
    role: "[ROL]",
    description: "[DESCRIPCIÓN]",
    photo: {
      src: "/images/banda/integrante-4.jpg",
      alt: "[NOMBRE], con barba y camisa negra, frente a un ventanal oscuro.",
    },
  },
];
