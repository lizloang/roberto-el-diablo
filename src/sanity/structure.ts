import type { StructureResolver } from "sanity/structure";

// Menú lateral del Studio. Los documentos únicos abren directo su formulario.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.documentTypeListItem("album").title("Lanzamientos"),
      S.documentTypeListItem("song").title("Canciones"),
      S.documentTypeListItem("show").title("Conciertos"),
      S.documentTypeListItem("member").title("Integrantes"),
      S.documentTypeListItem("product").title("Mercancía"),
      S.documentTypeListItem("pressArticle").title("Notas de prensa"),
      S.divider(),
      S.listItem()
        .title("Historia de la banda")
        .id("bandInfo")
        .child(S.document().schemaType("bandInfo").documentId("bandInfo")),
      S.listItem()
        .title("Kit de prensa")
        .id("pressKit")
        .child(S.document().schemaType("pressKit").documentId("pressKit")),
    ]);
