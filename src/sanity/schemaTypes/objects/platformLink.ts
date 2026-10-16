import { defineField, defineType } from "sanity";

const PLATFORMS = [
  { title: "Spotify", value: "spotify" },
  { title: "Apple Music", value: "appleMusic" },
  { title: "YouTube", value: "youtube" },
  { title: "YouTube Music", value: "youtubeMusic" },
  { title: "Amazon Music", value: "amazonMusic" },
  { title: "Deezer", value: "deezer" },
  { title: "Tidal", value: "tidal" },
  { title: "Bandcamp", value: "bandcamp" },
  { title: "SoundCloud", value: "soundcloud" },
  { title: "Otro", value: "other" },
];

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
