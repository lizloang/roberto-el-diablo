import { defineField, defineType } from "sanity";

// Imagen con texto alternativo obligatorio y crédito fotográfico opcional.
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Imagen",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo",
      description: "Describe la imagen para lectores de pantalla y buscadores.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "credit",
      title: "Crédito",
      description: "Fotógrafo o autor de la imagen.",
      type: "string",
    }),
  ],
});
