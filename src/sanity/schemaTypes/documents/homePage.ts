import { defineField, defineType } from "sanity";

// Documento único: lo que se ve en la portada del sitio.
export const homePage = defineType({
  name: "homePage",
  title: "Portada",
  type: "document",
  fields: [
    defineField({
      name: "featuredRelease",
      title: "Nuevo lanzamiento",
      description:
        "El CD que gira al inicio de la portada. Puede ser álbum, EP o sencillo; el título, el tipo, la imagen y la liga salen del lanzamiento. Si lo dejas vacío se usa el más reciente.",
      type: "reference",
      to: [{ type: "album" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Portada" }),
  },
});
