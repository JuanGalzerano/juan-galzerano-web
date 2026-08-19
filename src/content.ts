/**
 * Toda la data editable del sitio vive acá.
 * Para actualizar la web no hace falta tocar componentes: se edita este archivo.
 */

export const site = {
  name: 'Juan Ignacio Galzerano',
  shortName: 'Juan Galzerano',
  role: 'Estudiante de Ingeniería en Sistemas de Información',
  location: 'CABA — Argentina',
  email: 'galzeranojuan@gmail.com',
  github: 'https://github.com/JuanGalzerano',
  githubUser: 'JuanGalzerano',
  linkedin: 'https://www.linkedin.com/in/juan-ignacio-galzerano/',
  status: 'Operation Intern en PedidosYa — Ing. en Sistemas, UTN',
} as const

export const nav = [
  { id: 'perfil', index: '01', label: 'Perfil' },
  { id: 'proyectos', index: '02', label: 'Proyectos' },
  { id: 'stack', index: '03', label: 'Stack' },
  { id: 'experiencia', index: '04', label: 'Experiencia' },
  { id: 'formacion', index: '05', label: 'Formación' },
  { id: 'contacto', index: '06', label: 'Contacto' },
] as const

/** Bloque tipo terminal del hero. */
export const terminal = [
  {
    command: 'whoami',
    output: 'juan — Operation Intern en PedidosYa · 3.er año de Ing. en Sistemas, UTN FRBA',
  },
  {
    command: 'cat foco.txt',
    output: 'C y concurrencia · Python y APIs · scraping y modelos de datos',
  },
  {
    command: 'git log --oneline -1',
    output: 'kernel distribuido: 7 módulos hablando por sockets TCP',
  },
] as const

export const profile = {
  eyebrow: 'Perfil',
  title: 'Aprendo construyendo cosas que tienen que funcionar de verdad.',
  intro:
    'Estudiante de Ingeniería en Sistemas de Información en la UTN FRBA con interés en potenciar mi desarrollo en el sector IT. Vengo de investigación UX y documentación técnica, y hoy escribo software: un kernel distribuido en C y un comparador de precios con datos reales de retailers argentinos, en producción.',
  facts: [
    { label: 'Ubicación', value: 'CABA, Argentina' },
    { label: 'Universidad', value: 'UTN FRBA' },
    { label: 'Carrera', value: 'Ingeniería en Sistemas de Información' },
    { label: 'Promedio', value: '8,5' },
  ],
} as const

export type Project = {
  name: string
  repo: string
  href: string
  summary: string
  language: string
  languageColor: string
  tags: string[]
  featured?: boolean
  detail?: { label: string; value: string }[]
  /** Muestra la viñeta animada de la topología al costado del resumen. */
  loop?: boolean
  /** Explainer renderizado con Remotion. Los archivos viven en public/. */
  video?: {
    webm: string
    mp4: string
    poster: string
    caption: string
  }
}

export const projects: Project[] = [
  {
    name: 'Kernel distribuido',
    repo: 'kernel-project-utn.frba',
    href: 'https://github.com/JuanGalzerano/kernel-project-utn.frba',
    summary:
      'Kernel didáctico distribuido: siete módulos independientes que se comunican solo por sockets TCP y ejecutan un pseudo-assembler propio. Planificación con 7 estados (FIFO / RR / CMN), memoria por segmentación con Best y Worst Fit, compactación y swap a disco.',
    language: 'C',
    languageColor: '#8f9296',
    tags: ['Sockets TCP', 'pthreads', 'Semáforos', 'Serialización binaria', 'Makefile'],
    featured: true,
    loop: true,
    video: {
      webm: '/kernel-explainer.webm',
      mp4: '/kernel-explainer.mp4',
      poster: '/kernel-explainer.jpg',
      caption: '45 s — arquitectura, protocolo, planificación y memoria',
    },
    detail: [
      { label: 'Módulos', value: 'kernel_scheduler · kernel_memory · cpu · memory_stick · swap · io · utils' },
      { label: 'Concurrencia', value: 'pthread_mutex_t, sem_t y pthread_cond_t sin deadlocks ni race conditions' },
      { label: 'Protocolo', value: 'op_code + buffer serializado a mano sobre TCP' },
      { label: 'Memoria', value: 'segmentación, Best/Worst Fit, compactación y swap de procesos suspendidos' },
    ],
  },
  {
    name: 'Cotejo — comparador de precios',
    repo: 'comparador-de-precios',
    href: 'https://github.com/JuanGalzerano/comparador-de-precios',
    summary:
      'Buscador que agrupa publicaciones de distintas tiendas para el mismo producto y las ordena por un score compuesto — precio final con envío, cuotas, reputación del vendedor, opiniones y garantía — no solo por el precio más bajo.',
    language: 'Python',
    languageColor: '#3572a5',
    tags: ['FastAPI', 'SQL Server', 'Adapters por fuente', 'GraphQL / VTEX', 'Scoring'],
    featured: true,
    detail: [
      { label: 'Fuentes activas', value: 'Frávega, Cetrogar, Naldo, OnCity, Megatone, Compra Gamer' },
      { label: 'Diseño', value: 'un adapter por retailer, estado declarado por fuente (activa / experimental / bloqueada)' },
      { label: 'Diferencial', value: 'agrupa por producto real e informa de dónde salió cada dato' },
      { label: 'Estado', value: 'desplegado en servidores propios, con datos reales de retailers argentinos' },
    ],
  },
  {
    name: 'TDH vs Estudio',
    repo: 'TDH-vs-ESTUDIO',
    href: 'https://github.com/JuanGalzerano/TDH-vs-ESTUDIO',
    summary:
      'Juego construido con Wollok, el lenguaje desarrollado por la UTN FRBA junto a la UTN La Plata.',
    language: 'Wollok',
    languageColor: '#a23738',
    tags: ['POO', 'Wollok', 'Game loop'],
    featured: true,
  },
]

export const stack = {
  eyebrow: 'Stack',
  title: 'Con qué trabajo',
  groups: [
    {
      title: 'Lenguajes, backend y herramientas',
      items: [
        'C',
        'C++',
        'Python',
        'TypeScript',
        'Haskell',
        'Wollok',
        'SQL',
        'Bases de datos',
        'APIs REST',
        'Scraping',
        'Modelado de datos',
        'Git',
      ],
    },
    {
      title: 'Sistemas',
      items: ['Sockets TCP', 'Concurrencia (pthreads, semáforos)', 'Valgrind', 'Linux', 'Makefile'],
    },
    {
      title: 'Fundamentos y proceso',
      items: [
        'POO',
        'Estructuras de datos',
        'Patrones de diseño',
        'Programación funcional',
        'Metodologías ágiles',
        'Investigación UX',
        'Documentación técnica',
      ],
    },
    {
      title: 'Habilidades blandas',
      items: [
        'Trabajo en equipo',
        'Comunicación técnica',
        'Resolución de problemas',
        'Autonomía',
        'Adaptabilidad',
        'Pensamiento analítico',
      ],
    },
  ],
} as const

export const experience = {
  eyebrow: 'Experiencia',
  title: 'Dónde trabajo',
  items: [
    {
      company: 'PedidosYa',
      role: 'Operation Intern',
      period: 'ago 2026 — Presente',
      bullets: [
        'Optimización de la operación a partir del análisis de datos, dejando cada cambio documentado para que el equipo lo pueda replicar.',
        'Armado y seguimiento de reportes con métricas de operación y KPIs del día a día.',
        'Revisión de procesos operativos y propuestas de mejora continua sobre los que no funcionan bien.',
        'Soporte operativo a repartidores y comercios ante incidencias durante la operación.',
      ],
    },
    {
      company: 'Data Factory',
      role: 'User Experience Researcher',
      period: 'may 2023 — sep 2023',
      bullets: [
        'Análisis del uso del producto web por parte de los clientes para optimizar la experiencia de usuario y documentar mejoras en el servicio.',
        'Elaboración de documentación de UX e incorporación de herramientas para estadísticas deportivas.',
        'Relevamiento diario del uso de la herramienta web por ~30 clientes, identificando patrones de uso y oportunidades de mejora.',
      ],
    },
  ],
} as const

export const education = {
  eyebrow: 'Formación',
  title: 'Estudios y cursos',
  degree: {
    title: 'Ingeniería en Sistemas de Información',
    institution: 'Universidad Tecnológica Nacional — FRBA, Buenos Aires',
    period: 'mar 2024 — Presente',
    detail: 'Promedio 8,5',
  },
  courses: [
    { title: 'Certificación en SEO', institution: 'BIGSEO', date: '' },
    { title: 'Certificación en Python', institution: 'Aprende Programando', date: 'mar 2024' },
    { title: 'Certificación en Diseño Web', institution: 'Aprende Programando', date: 'nov 2023' },
  ],
} as const

export const contact = {
  eyebrow: 'Contacto',
  title: 'Hablemos',
  text: 'Trabajo en PedidosYa y sigo construyendo cosas por mi cuenta. Si algo de acá te sirve o querés charlar de un proyecto, escribime.',
} as const
