import { defineArrayMember, defineField, defineType } from "sanity";

const RELEASE_TYPES = [
  { title: "Álbum", value: "album" },
  { title: "EP", value: "ep" },
  { title: "Sencillo", value: "single" },
];

export const album = defineType({
  name: "album",
  title: "Lanzamiento",
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
      name: "releaseType",
      title: "Tipo",
      type: "string",
      options: {
        list: RELEASE_TYPES,
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "album",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Fecha de lanzamiento",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cover",
      title: "Portada",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "blockContent",
    }),
    defineField({
      name: "tracks",
      title: "Canciones",
      description: "En el orden del lanzamiento.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "song" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "links",
      title: "Enlaces",
      type: "array",
      of: [defineArrayMember({ type: "platformLink" })],
    }),
  ],
  orderings: [
    {
      title: "Más reciente",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      releaseType: "releaseType",
      releaseDate: "releaseDate",
      media: "cover",
    },
    prepare: ({ title, releaseType, releaseDate, media }) => ({
      title,
      subtitle: [
        RELEASE_TYPES.find((t) => t.value === releaseType)?.title,
        releaseDate?.slice(0, 4),
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
