"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes, singletonTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

// Acciones permitidas en documentos únicos (sin duplicar ni eliminar).
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "roberto-el-diablo",
  title: "Roberto el Diablo",
  basePath: "/studio",
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Oculta los documentos únicos del botón "Crear".
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && singletonActions.has(action))
        : actions,
  },
});
