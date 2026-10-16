import { defineArrayMember, defineField, defineType } from "sanity";

// Documento único: material para medios en la página /prensa.
export const pressKit = defineType({
  name: "pressKit",
  title: "Kit de prensa",
  type: "document",
  fields: [
    defineField({
      name: "shortBio",
      title: "Biografía corta",
      description: "Uno o dos párrafos para medios.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "longBio",
      title: "Biografía larga",
      type: "blockContent",
    }),
    defineField({
      name: "photos",
      title: "Fotos de prensa",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
    }),
    defineField({
      name: "files",
      title: "Archivos descargables",
      description: "Logos, rider técnico, one-sheet, etc.",
      type: "array",
      of: [
        defineArrayMember({
          type: "file",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Correo de contacto para prensa",
      type: "email",
    }),
    defineField({
      name: "bookingEmail",
      title: "Correo de booking",
      type: "email",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Kit de prensa" }),
  },
});
