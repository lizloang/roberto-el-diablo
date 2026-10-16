import { defineField, defineType } from "sanity";

// Nota, reseña o entrevista publicada por un medio.
export const pressArticle = defineType({
  name: "pressArticle",
  title: "Nota de prensa",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título de la nota",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "outlet",
      title: "Medio",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Enlace",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "date",
    }),
    defineField({
      name: "quote",
      title: "Cita destacada",
      description: "Frase breve del artículo para mostrar en el sitio.",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Más reciente",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", outlet: "outlet", publishedAt: "publishedAt" },
    prepare: ({ title, outlet, publishedAt }) => ({
      title,
      subtitle: [outlet, publishedAt].filter(Boolean).join(" · "),
    }),
  },
});
