import { defineField, defineType } from "sanity";

const STATUSES = [
  { title: "Programado", value: "scheduled" },
  { title: "Agotado", value: "soldOut" },
  { title: "Pospuesto", value: "postponed" },
  { title: "Cancelado", value: "cancelled" },
];

export const show = defineType({
  name: "show",
  title: "Concierto",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Fecha y hora",
      type: "datetime",
      options: { timeStep: 15 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventName",
      title: "Nombre del evento",
      description: "Opcional: festival, gira o nombre especial del show.",
      type: "string",
    }),
    defineField({
      name: "venue",
      title: "Lugar",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "Ciudad",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "country",
      title: "País",
      type: "string",
      initialValue: "México",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: { list: STATUSES, layout: "radio" },
      initialValue: "scheduled",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ticketUrl",
      title: "Enlace de boletos",
      type: "url",
    }),
    defineField({
      name: "notes",
      title: "Notas",
      description: "Bandas invitadas, edad mínima, horario de puertas, etc.",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Fecha",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: { venue: "venue", city: "city", date: "date", status: "status" },
    prepare: ({ venue, city, date, status }) => ({
      title: [venue, city].filter(Boolean).join(" — "),
      subtitle: [
        date
          ? new Date(date).toLocaleDateString("es-MX", { dateStyle: "medium" })
          : null,
        status !== "scheduled"
          ? STATUSES.find((s) => s.value === status)?.title
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
