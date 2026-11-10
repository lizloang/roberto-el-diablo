import { defineField, defineType } from "sanity";

// Documento único: el lanzamiento que gira en el CD al inicio de la portada.
// Sin lanzamiento elegido, la sección no se muestra.
export const newRelease = defineType({
  name: "newRelease",
  title: "Nuevo lanzamiento",
  type: "document",
  fields: [
    defineField({
      name: "release",
      title: "Lanzamiento",
      description:
        "El que va en el CD. De aquí salen el título, la portada y la liga del play (Spotify si hay; si no, el primer enlace). Déjalo vacío para ocultar la sección.",
      type: "reference",
      to: [{ type: "album" }],
      // Aviso, no error: se puede publicar vacío para ocultar la sección.
      validation: (rule) =>
        rule
          .required()
          .warning("Sin lanzamiento elegido, el CD no aparece en la portada."),
    }),
    defineField({
      name: "discImage",
      title: "Imagen del CD",
      description:
        "Opcional. Si la dejas vacía se usa la portada del lanzamiento. Se recorta en círculo: ajusta el hotspot para centrarla.",
      type: "imageWithAlt",
    }),
    defineField({
      name: "eyebrow",
      title: "Rótulo",
      description:
        'Opcional. Va debajo del título, p. ej. "Nuevo álbum". Si lo dejas vacío se arma con el tipo del lanzamiento.',
      type: "string",
    }),
    defineField({
      name: "audioHome",
      title: "Audio del CD del home",
      description:
        "Fragmento de 20–30 segundos en MP3 que suena al pasar el mouse por el CD de la página de inicio.",
      type: "file",
      options: { accept: "audio/mpeg,audio/mp3" },
    }),
  ],
  preview: {
    select: { title: "release.title", media: "release.cover" },
    prepare: ({ title, media }) => ({
      title: "Nuevo lanzamiento",
      subtitle: title ?? "Sin lanzamiento elegido",
      media,
    }),
  },
});
