/**
 * Tokens de diseño del sitio, copiados 1:1 del bloque `@theme` de
 * `../../src/index.css`. Si allá cambia un valor, hay que reflejarlo acá:
 * este subproyecto está aislado a propósito y no importa nada de `src/`.
 */

export const colors = {
  /* --color-ink-* : tinta azulada del fondo */
  ink900: '#07090e',
  ink800: '#090d14',
  ink700: '#101721',
  ink600: '#0b1018',

  /* trazo estructural */
  line: '#232a36',

  /* texto */
  chalk: '#e7e9ec',
  chalkDim: '#9aa1ad',
  chalkFaint: '#5f6670',

  /* acentos */
  draft: '#d7ff3e',
  anno: '#ff7a45',
} as const;

/**
 * Acentos que en el sitio sólo existen como `rgba()` dentro de gradientes,
 * no como tokens de `@theme`. Se exponen como base + helper para poder variar
 * la opacidad igual que hace el CSS.
 */
export const accents = {
  /** Halo teal del hero: rgba(98, 223, 210, …) */
  teal: [98, 223, 210] as const,
  /** Grilla y halo violeta: rgba(156, 140, 255, …) */
  violet: [156, 140, 255] as const,
} as const;

export const rgba = (rgb: readonly [number, number, number], alpha: number) =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

/** Alfas exactos con los que el sitio usa cada acento. */
export const accentAlpha = {
  /** body: halo superior teal */
  tealHalo: 0.1,
  /** .hero-scene: drop-shadow teal */
  tealGlow: 0.2,
  /** .spotlight: halo teal que sigue al cursor */
  tealSpot: 0.05,
  /** body + body::before: halo y grilla violeta */
  violet: 0.035,
} as const;

export const fonts = {
  /** --font-display */
  display: "'Instrument Serif', Georgia, serif",
  /** --font-sans */
  sans: "'Archivo', 'Segoe UI', sans-serif",
  /** --font-mono */
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Nombres tal cual hay que pedirlos a Google Fonts al cargarlas. */
export const fontFamilies = {
  display: 'Instrument Serif',
  sans: 'Archivo',
  mono: 'JetBrains Mono',
} as const;

/** Constantes de los efectos de fondo, tomadas del CSS del sitio. */
export const effects = {
  /** body::before — background-size: 56px 56px */
  gridSize: 56,
  /** body::before — grosor de la línea de la grilla */
  gridLineWidth: 1,
  /** body::after — opacidad de las scanlines */
  scanlineOpacity: 0.24,
  /** body::after — rgba(255, 255, 255, 0.012) 0 1px, transparent 1px 6px */
  scanlineColor: 'rgba(255, 255, 255, 0.012)',
  scanlineThickness: 1,
  scanlineGap: 6,
  /** .grain::after — opacity: 0.035 */
  grainOpacity: 0.035,
  /** .grain::after — tile del feTurbulence */
  grainTile: 160,
  grainBaseFrequency: 0.85,
  grainOctaves: 3,
  /** .ticked::before / ::after — 9px, borde de 1px, opacity 0.55 */
  tickSize: 9,
  tickWidth: 1,
  tickOpacity: 0.55,
} as const;

/** Gradiente vertical del `body`. */
export const backgroundGradient = `linear-gradient(180deg, ${colors.ink900} 0%, ${colors.ink800} 52%, ${colors.ink900} 100%)`;

/** Tipografía de la clase `.tag`: mono, 11px, tracking ancho, mayúsculas. */
export const tagStyle = {
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
} as const;

export const theme = {
  colors,
  accents,
  accentAlpha,
  fonts,
  fontFamilies,
  effects,
  backgroundGradient,
} as const;
