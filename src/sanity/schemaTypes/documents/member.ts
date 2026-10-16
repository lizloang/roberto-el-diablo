import { defineField, defineType } from "sanity";

export const member = defineType({
  name: "member",
  title: "Integrante",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Rol / instrumento",
      description: "Por ejemplo: voz y guitarra.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Foto",
      type: "imageWithAlt",
    }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "order",
      title: "Orden",
      description: "Posición en la página de la banda (1 = primero).",
      type: "number",
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: "isActive",
      title: "Integrante actual",
      description: "Desactívalo para exintegrantes.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Orden",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
});
