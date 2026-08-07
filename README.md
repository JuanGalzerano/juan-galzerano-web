# juan-galzerano-web

Sitio personal / portfolio de Juan Ignacio Galzerano.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · three.js · lucide-react.

## Cómo correrlo

```bash
npm install
npm run dev
```

Queda en `http://localhost:5173`.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | servidor de desarrollo con HMR |
| `npm run build` | typecheck (`tsc -b`) + build de producción en `dist/` |
| `npm run preview` | sirve el build de producción |
| `npm run lint` | oxlint |

## Cómo editar el contenido

**Todo el texto del sitio vive en [`src/content.ts`](src/content.ts).** No hace falta tocar
componentes para actualizar la web: se edita ese archivo y listo.

| Export | Qué controla |
| --- | --- |
| `site` | nombre, rol, mail, teléfono, links, estado ("abierto a pasantías") |
| `nav` | secciones del menú (el `id` tiene que coincidir con el `id` de la `<section>`) |
| `terminal` | las líneas del bloque tipo terminal del hero |
| `profile` | texto del perfil y la ficha de datos |
| `projects` | los repos que se muestran; `featured: true` los agranda arriba |
| `stack` | grupos de tecnologías |
| `experience` | experiencia laboral |
| `education` | carrera y cursos |
| `contact` | textos de la sección de contacto |

### Agregar un proyecto

Sumá un objeto a `projects` en `src/content.ts`:

```ts
{
  name: 'Nombre visible',
  repo: 'nombre-del-repo',
  href: 'https://github.com/JuanGalzerano/nombre-del-repo',
  summary: 'Una o dos frases sobre qué resuelve.',
  language: 'C',
  languageColor: '#8f9296',
  tags: ['Tag 1', 'Tag 2'],
  featured: true,          // opcional: card grande
  detail: [                // opcional: sólo se muestra en cards featured
    { label: 'Módulos', value: '...' },
  ],
}
```

## Diseño

Fondo tinta azulada con halos teal/violeta, grilla de 56px y scanlines — portado del sitio
de [Valentin Torassa](https://github.com/ValentinTorassa/ValenTorassa-Web). Tipografías:
Instrument Serif (display), Archivo (texto), JetBrains Mono (etiquetas y datos). Acento
verde ácido `#d7ff3e`.

Los tokens de color y tipografía están en el bloque `@theme` de [`src/index.css`](src/index.css).

### Fondo reactivo al mouse

- [`components/Backdrop.tsx`](src/components/Backdrop.tsx) escribe la posición del puntero
  en variables CSS (`--px`, `--py`, `--mx`, `--my`) con un lerp por frame; los halos, la
  grilla y el spotlight se desplazan con esas variables.
- [`components/HeroScene.tsx`](src/components/HeroScene.tsx) es la escena 3D de three.js
  **de la primera sección solamente**: topología de nodos, cubos wireframe, torus knot,
  grilla en perspectiva y paquetes viajando por los enlaces. También portada del sitio de
  Valentin Torassa.

three se carga con `import()` dinámico desde [`src/threeRuntime.ts`](src/threeRuntime.ts)
(re-export acotado) y recién cuando el hero entra en viewport, así no pesa en el primer
render. La escena se pausa sola si la pestaña se oculta o el hero sale de pantalla, baja
calidad en equipos limitados y no se ejecuta con `prefers-reduced-motion`.

## Estructura

```
src/
├─ content.ts          ← toda la data editable
├─ App.tsx             ← arma las secciones
├─ index.css           ← tokens + estilos base (Tailwind v4)
├─ threeRuntime.ts     ← re-export acotado de three (chunk diferido)
└─ components/
   ├─ Nav.tsx          ← header fijo + scroll spy
   ├─ Hero.tsx · HeroScene.tsx · Backdrop.tsx
   ├─ SectionHead.tsx  ← título de sección con numeración
   ├─ Reveal.tsx       ← animación de entrada al hacer scroll
   ├─ BrandIcons.tsx   ← iconos de GitHub/LinkedIn (lucide v1 ya no los trae)
   ├─ Profile.tsx · Projects.tsx · Stack.tsx
   └─ Experience.tsx · Education.tsx · Contact.tsx
```

## Deploy

Es un sitio estático: `npm run build` genera `dist/`, que se puede publicar en Vercel,
Netlify o GitHub Pages sin configuración extra.
