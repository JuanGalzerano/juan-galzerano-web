/**
 * Carga de fuentes para el render.
 *
 * El sitio las trae por CSS, pero en un render headless nadie las pide y todo
 * cae a los fallbacks: Georgia, sans-serif y monospace. Estos helpers las
 * inyectan y devuelven el `fontFamily` real que hay que usar.
 *
 * `loadFont()` de @remotion/google-fonts registra la carga en el delayRender de
 * Remotion, así que el frame no se captura hasta que la fuente bajó.
 */

import { loadFont as loadDisplay } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadSans } from '@remotion/google-fonts/Archivo';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const display = loadDisplay('normal', { weights: ['400'], subsets: ['latin'] });
const displayItalic = loadDisplay('italic', { weights: ['400'], subsets: ['latin'] });
const sans = loadSans('normal', { weights: ['400', '500'], subsets: ['latin'] });
const mono = loadMono('normal', { weights: ['400', '500'], subsets: ['latin'] });

/**
 * Mismos roles que `fonts` en theme.ts, pero con la familia ya cargada.
 * Se conserva el stack de fallback por si una request a Google Fonts falla.
 */
export const fontFamily = {
  display: `${display.fontFamily}, Georgia, serif`,
  displayItalic: `${displayItalic.fontFamily}, Georgia, serif`,
  sans: `${sans.fontFamily}, 'Segoe UI', sans-serif`,
  mono: `${mono.fontFamily}, ui-monospace, monospace`,
} as const;

/** Equivalente de la clase `.tag` del sitio, ya con la fuente resuelta. */
export const tag = {
  fontFamily: fontFamily.mono,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
} as const;
