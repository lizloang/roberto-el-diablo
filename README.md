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

| Ruta      | Página                 |
| --------- | ---------------------- |
| `/`       | Inicio                 |
| `/musica` | Discografía            |
| `/shows`  | Próximos conciertos    |
| `/merch`  | Mercancía              |
| `/banda`  | Historia e integrantes |
| `/prensa` | Material para prensa   |

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
    schemaTypes/    Esquemas de contenido (vacío por ahora)
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

La configuración está lista pero **sin proyecto conectado**. Para conectarlo:

1. Crear el proyecto en [sanity.io/manage](https://www.sanity.io/manage).
2. Completar `NEXT_PUBLIC_SANITY_PROJECT_ID` y `NEXT_PUBLIC_SANITY_DATASET` en `.env.local`.
3. Definir los esquemas en `src/sanity/schemaTypes/`.

`src/sanity/env.ts` lanza un error claro si se usa el cliente sin estas variables.
