import { defineArrayMember, defineType } from "sanity";

// Texto enriquecido básico: párrafos, subtítulos, citas, listas y enlaces.
export const blockContent = defineType({
  name: "blockContent",
  title: "Texto enriquecido",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Subtítulo", value: "h2" },
        { title: "Subtítulo menor", value: "h3" },
        { title: "Cita", value: "blockquote" },
      ],
      lists: [
        { title: "Viñetas", value: "bullet" },
        { title: "Numerada", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Negritas", value: "strong" },
          { title: "Cursivas", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Enlace",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["http", "https", "mailto"] }),
              },
            ],
          },
        ],
      },
    }),
  ],
});
