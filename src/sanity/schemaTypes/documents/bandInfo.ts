import { defineArrayMember, defineField, defineType } from "sanity";

// Documento único: historia de la banda para la página /banda.
export const bandInfo = defineType({
  name: "bandInfo",
  title: "Historia de la banda",
  type: "document",
  fields: [
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
