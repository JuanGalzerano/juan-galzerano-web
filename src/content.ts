/**
 * Toda la data editable del sitio vive acá.
 * Para actualizar la web no hace falta tocar componentes: se edita este archivo.
 */

export const site = {
  name: 'Juan Ignacio Galzerano',
  shortName: 'Juan Galzerano',
  role: 'Estudiante de Ingeniería en Sistemas de Información',
  tagline: 'Sistemas de bajo nivel, backend y datos.',
  location: 'CABA — Argentina',
  email: 'galzeranojuan@gmail.com',
  phone: '(54) 11 3631-4322',
  github: 'https://github.com/JuanGalzerano',
  githubUser: 'JuanGalzerano',
  linkedin: 'https://linkedin.com/in/JuanIgnacio-Galzerano',
  status: 'Abierto a pasantías y primer empleo IT',
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
    output: 'juan — 3.er año de Ingeniería en Sistemas, UTN FRBA',
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
    'Estudiante de Ingeniería en Sistemas de Información en la UTN FRBA con interés en potenciar mi desarrollo en el sector IT. Vengo de investigación UX y documentación técnica, y hoy escribo software: kernels didácticos en C, un compilador, y un comparador de precios con datos reales de retailers argentinos.',
  statement:
    'Me interesa entender el sistema completo — cómo se planifica un proceso, cómo viaja un byte por un socket, por qué una fuente de datos miente. Escribo la documentación como parte del trabajo, no después.',
  facts: [
    { label: 'Ubicación', value: 'CABA, Argentina' },
    { label: 'Universidad', value: 'UTN FRBA — 16 materias (40%)' },
    { label: 'Promedio', value: '8,5' },
    { label: 'Inglés', value: 'Intermedio (B1+)' },
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
    tags: ['FastAPI', 'PostgreSQL', 'Adapters por fuente', 'GraphQL / VTEX', 'Scoring'],
    featured: true,
    detail: [
      { label: 'Fuentes activas', value: 'Frávega, Cetrogar, Naldo, OnCity, Megatone, Compra Gamer' },
      { label: 'Diseño', value: 'un adapter por retailer, estado declarado por fuente (activa / experimental / bloqueada)' },
      { label: 'Diferencial', value: 'agrupa por producto real e informa de dónde salió cada dato' },
      { label: 'Estado', value: 'MVP funcionando en local con datos reales de retailers argentinos' },
    ],
  },
  {
    name: 'Compilador Micro (Fischer)',
    repo: 'compilador-micro-fischer',
    href: 'https://github.com/JuanGalzerano/compilador-micro-fischer',
    summary:
      'Estudio del compilador del lenguaje Micro de Fischer en C: scanner, parser, tabla de símbolos y generación de código intermedio.',
    language: 'C',
    languageColor: '#8f9296',
    tags: ['Scanner', 'Parser', 'Tabla de símbolos', 'Código intermedio'],
  },
  {
    name: 'Racing funcional',
    repo: 'prolog-racing-functions',
    href: 'https://github.com/JuanGalzerano/prolog-racing-functions',
    summary: 'Simulación de un juego de carreras resuelta con paradigma funcional.',
    language: 'Haskell',
    languageColor: '#5e5086',
    tags: ['Paradigma funcional', 'Pattern matching'],
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
  },
]

export const stack = {
  eyebrow: 'Stack',
  title: 'Con qué trabajo',
  groups: [
    {
      title: 'Lenguajes',
      items: ['C', 'C++', 'Python', 'TypeScript', 'Haskell', 'Wollok', 'SQL'],
    },
    {
      title: 'Sistemas',
      items: ['Sockets TCP', 'Concurrencia (pthreads, semáforos)', 'Gestión de memoria', 'Linux', 'Makefile', 'Git'],
    },
    {
      title: 'Backend y datos',
      items: ['FastAPI', 'PostgreSQL', 'SQLite', 'APIs REST / GraphQL', 'Scraping', 'Modelado de datos'],
    },
    {
      title: 'Fundamentos y proceso',
      items: ['POO', 'Estructuras de datos', 'Investigación UX', 'Documentación técnica', 'Trabajo en equipo'],
    },
  ],
} as const

export const experience = {
  eyebrow: 'Experiencia',
  title: 'Dónde trabajé',
  items: [
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
    detail: '16 materias aprobadas (40%) · Promedio 8,5',
  },
  courses: [
    { title: 'Certificación en Python', institution: 'Aprende Programando', date: 'mar 2024' },
    { title: 'Certificación en Diseño Web', institution: 'Aprende Programando', date: 'nov 2023' },
  ],
  languages: [{ title: 'Inglés', detail: 'Intermedio (B1+)' }],
} as const

export const contact = {
  eyebrow: 'Contacto',
  title: 'Hablemos',
  text: 'Estoy buscando una pasantía o primer empleo en desarrollo. Si algo de acá te sirve, escribime.',
} as const
