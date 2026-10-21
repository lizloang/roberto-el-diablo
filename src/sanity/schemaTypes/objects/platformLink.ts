import { defineField, defineType } from "sanity";
import { PLATFORMS } from "@/sanity/platforms";

// Enlace a una plataforma de streaming o tienda digital.
export const platformLink = defineType({
  name: "platformLink",
  title: "Enlace a plataforma",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Plataforma",
      type: "string",
      options: { list: PLATFORMS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { platform: "platform", url: "url" },
    prepare: ({ platform, url }) => ({
      title: PLATFORMS.find((p) => p.value === platform)?.title ?? platform,
      subtitle: url,
    }),
  },
});
