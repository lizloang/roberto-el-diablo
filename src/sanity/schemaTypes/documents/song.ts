import { defineArrayMember, defineField, defineType } from "sanity";

export const song = defineType({
  name: "song",
  title: "Canción",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duración",
      description: "Formato m:ss, por ejemplo 3:42.",
      type: "string",
      validation: (rule) => rule.regex(/^\d{1,2}:[0-5]\d$/, { name: "m:ss" }),
    }),
    defineField({
      name: "lyrics",
      title: "Letra",
      type: "text",
      rows: 12,
    }),
    defineField({
      name: "credits",
      title: "Créditos",
      description: "Composición, producción, músicos invitados, etc.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "links",
      title: "Enlaces",
      type: "array",
      of: [defineArrayMember({ type: "platformLink" })],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "duration" },
  },
});
