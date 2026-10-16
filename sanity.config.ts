import { defineConfig } from "sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "roberto-el-diablo",
  title: "Roberto el Diablo",
  projectId,
  dataset,
  apiVersion,
  schema: {
    types: schemaTypes,
  },
});
