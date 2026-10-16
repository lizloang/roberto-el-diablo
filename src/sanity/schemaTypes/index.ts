import type { SchemaTypeDefinition } from "sanity";
import { album } from "./documents/album";
import { bandInfo } from "./documents/bandInfo";
import { member } from "./documents/member";
import { pressArticle } from "./documents/pressArticle";
import { pressKit } from "./documents/pressKit";
import { product } from "./documents/product";
import { show } from "./documents/show";
import { song } from "./documents/song";
import { blockContent } from "./objects/blockContent";
import { imageWithAlt } from "./objects/imageWithAlt";
import { platformLink } from "./objects/platformLink";

// Documentos que deben existir una sola vez; se restringirán al configurar el Studio.
export const singletonTypes = new Set(["bandInfo", "pressKit"]);

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documentos
  album,
  song,
  show,
  member,
  product,
  bandInfo,
  pressKit,
  pressArticle,
  // Objetos
  blockContent,
  imageWithAlt,
  platformLink,
];
