import { defineArrayMember, defineField, defineType } from "sanity";

const CATEGORIES = [
  { title: "Playera", value: "tshirt" },
  { title: "Sudadera", value: "hoodie" },
  { title: "Vinilo", value: "vinyl" },
  { title: "CD", value: "cd" },
  { title: "Cassette", value: "cassette" },
  { title: "Accesorio", value: "accessory" },
  { title: "Otro", value: "other" },
];

const APPAREL = ["tshirt", "hoodie"];

export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: { list: CATEGORIES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Imágenes",
      description: "La primera es la principal.",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Precio (MXN)",
      type: "number",
      validation: (rule) => rule.required().min(0).precision(2),
    }),
    defineField({
      name: "sizes",
      title: "Tallas",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: ["XS", "S", "M", "L", "XL", "XXL"],
        layout: "grid",
      },
      hidden: ({ document }) => !APPAREL.includes(document?.category as string),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "purchaseUrl",
      title: "Enlace de compra",
      description: "Tienda externa donde se compra el producto.",
      type: "url",
    }),
    defineField({
      name: "available",
      title: "Disponible",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      price: "price",
      available: "available",
      media: "images.0",
    },
    prepare: ({ title, price, available, media }) => ({
      title,
      subtitle: [
        price != null ? `$${price} MXN` : null,
        available === false ? "Agotado" : null,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
