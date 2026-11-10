import { defineArrayMember, defineField, defineType } from "sanity";

// Documento único: la página /banda. Arriba, el hero (collage de fotos y
// presentación); abajo, los integrantes, que salen de "Integrantes".
export const bandInfo = defineType({
  name: "bandInfo",
  title: "Historia de la banda",
  type: "document",
  fieldsets: [
    {
      name: "hero",
      title: "Portada de la página de la banda",
      description:
        "Collage de dos fotos con la presentación al lado. Al pasar el mouse, cada foto pasa por todas las de su lista.",
    },
  ],
  fields: [
    defineField({
      name: "intro",
      title: "Presentación",
      description:
        "2 a 4 líneas junto al collage. Es un enlace que baja a los integrantes.",
      type: "text",
      rows: 4,
      fieldset: "hero",
    }),
    defineField({
      name: "caption",
      title: "Frase",
      description: "Frase corta debajo de la foto grande, en mayúsculas.",
      type: "string",
      fieldset: "hero",
    }),
    defineField({
      name: "collageMain",
      title: "Foto grande",
      description:
        "Horizontal (4:3). La primera es la que se ve; las demás pasan con el mouse, en este orden. Sin fotos no se muestra el collage.",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
      fieldset: "hero",
    }),
    defineField({
      name: "collageSecondary",
      title: "Foto chica",
      description:
        "Vertical (4:5), encimada abajo a la derecha de la grande. Igual: la primera se ve y las demás pasan con el mouse.",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      options: { layout: "grid" },
      fieldset: "hero",
    }),
    defineField({
      name: "history",
      title: "Historia",
      type: "blockContent",
    }),
    defineField({
      name: "photos",
      title: "Fotografías",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Historia de la banda" }),
  },
});
