# juan-galzerano-web

Sitio personal / portfolio de Juan Ignacio Galzerano.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · lucide-react.

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
| `education` | carrera, cursos e idiomas |
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

Estética de plano técnico ("blueprint"): fondo tinta, grilla milimetrada de fondo, grano
sutil, marcas de registro en las esquinas de los paneles. Tipografías: Instrument Serif
(display), Archivo (texto), JetBrains Mono (etiquetas y datos). Acento verde ácido
`#d7ff3e`.

Los tokens de color y tipografía están en el bloque `@theme` de [`src/index.css`](src/index.css).

## Estructura

```
src/
├─ content.ts          ← toda la data editable
├─ App.tsx             ← arma las secciones
├─ index.css           ← tokens + estilos base (Tailwind v4)
└─ components/
   ├─ Nav.tsx          ← header fijo + scroll spy
   ├─ Hero.tsx
   ├─ SectionHead.tsx  ← título de sección con numeración
   ├─ Reveal.tsx       ← animación de entrada al hacer scroll
   ├─ BrandIcons.tsx   ← iconos de GitHub/LinkedIn (lucide v1 ya no los trae)
   ├─ Profile.tsx · Projects.tsx · Stack.tsx
   └─ Experience.tsx · Education.tsx · Contact.tsx
```

## Deploy

Es un sitio estático: `npm run build` genera `dist/`, que se puede publicar en Vercel,
Netlify o GitHub Pages sin configuración extra.
