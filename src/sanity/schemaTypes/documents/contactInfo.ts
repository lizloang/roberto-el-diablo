import { defineArrayMember, defineField, defineType } from "sanity";
import { REDES, contactoInicial } from "@/data/contacto";

// Documento único: los datos del footer (contacto, management y redes).
// Arranca con los datos actuales; basta con publicarlo.
export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contacto y redes",
  type: "document",
  initialValue: contactoInicial,
  fieldsets: [
    { name: "contacto", title: "Contacto" },
    { name: "mgmt", title: "MGMT & Booking" },
  ],
  fields: [
    defineField({
      name: "phones",
      title: "Teléfonos",
      description:
        'Como se ven, p. ej. "818 275 71 12". Con 10 dígitos se marca con +52; si es de otro país, escríbelo con su lada.',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      fieldset: "contacto",
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "email",
      title: "Correo",
      type: "string",
      fieldset: "contacto",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "mgmtCompany",
      title: "Empresa",
      description: "Se muestra en mayúsculas.",
      type: "string",
      fieldset: "mgmt",
    }),
    defineField({
      name: "mgmtContact",
      title: "Contacto",
      type: "string",
      fieldset: "mgmt",
    }),
    defineField({
      name: "mgmtPhone",
      title: "Teléfono",
      description: 'Como se ve, p. ej. "52 55 4477 5254".',
      type: "string",
      fieldset: "mgmt",
    }),
    defineField({
      name: "socials",
      title: "Redes sociales",
      description:
        "Sin link, la red no aparece. Instagram y Facebook también se muestran con su usuario en Contacto.",
      type: "object",
      fields: REDES.map(({ id, nombre }) =>
        defineField({
          name: id,
          title: nombre,
          type: "object",
          options: { columns: 2 },
          fields: [
            defineField({
              name: "url",
              title: "Link",
              type: "url",
              validation: (rule) => rule.uri({ scheme: ["https"] }),
            }),
            defineField({
              name: "handle",
              title: "Usuario",
              description: "Con @, p. ej. @robertoeldiablo.mx",
              type: "string",
            }),
          ],
        }),
      ),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contacto y redes" }),
  },
});
