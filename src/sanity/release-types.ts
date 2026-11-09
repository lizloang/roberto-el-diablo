// Tipos de lanzamiento. Lo usan el esquema del Studio y el sitio (rótulo del
// nuevo lanzamiento: "Nuevo álbum", "Nuevo sencillo"…).
export const RELEASE_TYPES = [
  { title: "Álbum", value: "album" },
  { title: "EP", value: "ep" },
  { title: "Sencillo", value: "single" },
];

// Cómo se nombra cada tipo dentro de una frase.
export const RELEASE_NOUNS: Record<string, string> = {
  album: "álbum",
  ep: "EP",
  single: "sencillo",
};
