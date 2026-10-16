# Roberto el Diablo

Sitio web de **Roberto el Diablo**, banda de rock de Santa Catarina, Nuevo León.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- TypeScript
- Tailwind CSS v4
- [Motion](https://motion.dev) (instalado para animaciones futuras)
- [Sanity](https://www.sanity.io) (CMS, configuración base)
- ESLint + Prettier

## Requisitos

- Node.js 20.9 o superior (desarrollado con Node 24)
- npm

## Instalación

```bash
git clone https://github.com/lizloang/roberto-el-diablo.git
cd roberto-el-diablo
npm install
cp .env.example .env.local   # completar cuando exista el proyecto de Sanity
```

## Scripts

| Comando                | Descripción                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Servidor de desarrollo en `localhost:3000` |
| `npm run build`        | Build de producción                        |
| `npm run start`        | Sirve el build de producción               |
| `npm run lint`         | ESLint                                     |
| `npm run typecheck`    | Genera tipos de rutas y ejecuta `tsc`      |
| `npm run format`       | Formatea el código con Prettier            |
| `npm run format:check` | Verifica el formato sin modificar archivos |

## Rutas

| Ruta      | Página                                  |
| --------- | --------------------------------------- |
| `/`       | Inicio                                  |
| `/musica` | Discografía                             |
| `/shows`  | Próximos conciertos                     |
| `/merch`  | Mercancía                               |
| `/banda`  | Historia e integrantes                  |
| `/prensa` | Material para prensa                    |
| `/studio` | Panel de administración (Sanity Studio) |

## Estructura

```
public/images/
  banda/        Fotografías de la banda
  portadas/     Portadas de álbumes
  merch/        Mercancía
src/
  app/          Rutas (App Router), layout raíz y estilos globales
  components/   Componentes reutilizables
  config/       Configuración del sitio (nombre, metadatos)
  data/         Datos estáticos
  hooks/        Hooks de React
  lib/          Utilidades
  types/        Tipos compartidos
  sanity/
    env.ts          Variables de entorno de Sanity
    lib/client.ts   Cliente de Sanity
    lib/image.ts    Helper `urlFor` para imágenes
    structure.ts    Menú lateral del Studio
    schemaTypes/    Esquemas de contenido (documents/ y objects/)
sanity.config.ts    Configuración del Studio
sanity.cli.ts       Configuración del CLI de Sanity
```

## Identidad visual

Tokens definidos en `src/app/globals.css` y disponibles como utilidades de Tailwind
(`bg-negro`, `text-crema`, `border-rojo`, …):

| Token             | Valor     | Uso                                                  |
| ----------------- | --------- | ---------------------------------------------------- |
| `negro`           | `#151515` | Marca                                                |
| `crema`           | `#F0E9DF` | Marca                                                |
| `rojo`            | `#A83D3A` | Marca                                                |
| `dias-de-naranja` | `#E96720` | Solo campaña _Días de Naranja_; no es color de marca |

Roles semánticos: `background` (crema), `foreground` (negro), `accent` (rojo).

Tipografía provisional cargada con `next/font` en `src/app/layout.tsx`:
`font-sans` (Inter) y `font-display` (Instrument Serif).

## Sanity

Para trabajar con contenido, copia `.env.example` a `.env.local` y completa el
Project ID (disponible en [sanity.io/manage](https://www.sanity.io/manage)).
`src/sanity/env.ts` lanza un error claro si faltan las variables.

### Esquemas (`src/sanity/schemaTypes/`)

| Tipo           | Panel                | Uso                                                        |
| -------------- | -------------------- | ---------------------------------------------------------- |
| `album`        | Lanzamiento          | Álbum, EP o sencillo: portada, fecha, canciones, enlaces   |
| `song`         | Canción              | Duración, letra, créditos, enlaces                         |
| `show`         | Concierto            | Fecha, lugar, ciudad, estado, boletos                      |
| `member`       | Integrante           | Nombre, rol, foto, biografía, orden, actual/exintegrante   |
| `product`      | Producto             | Mercancía: categoría, imágenes, precio MXN, tallas, compra |
| `bandInfo`     | Historia de la banda | Documento único: historia y fotos                          |
| `pressKit`     | Kit de prensa        | Documento único: biografías, fotos, archivos, contacto     |
| `pressArticle` | Nota de prensa       | Notas y reseñas publicadas por medios                      |

Objetos reutilizables: `blockContent` (texto enriquecido), `imageWithAlt`
(imagen con texto alternativo y crédito) y `platformLink` (enlace a plataforma).

Para validar los esquemas:

```bash
npx sanity schemas validate
```

### Panel de administración

El Studio está integrado en el sitio en [`/studio`](http://localhost:3000/studio)
(configuración en `sanity.config.ts`). Para entrar se necesita una cuenta de Sanity
invitada al proyecto. En producción, agrega el dominio del sitio en
**sanity.io/manage → API → CORS origins** con _Allow credentials_ activado.

"Historia de la banda" y "Kit de prensa" son documentos únicos: no se pueden
duplicar ni eliminar desde el panel.
