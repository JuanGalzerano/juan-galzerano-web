/**
 * Ritmo del explainer.
 *
 * Remotion no tiene forma de acelerar una composición entera: cada animación se
 * escribe en frames absolutos, así que el ritmo se controla escalando esos
 * números. Todo el tiempo del explainer pasa por acá, y con cambiar `SPEED` se
 * reajusta la pieza completa sin tocar escena por escena.
 */

/** 1 = ritmo original. 1.5 = todo un 50 % más rápido. */
export const SPEED = 1.5;

/**
 * Convierte una cantidad de frames pensada al ritmo original en frames reales.
 * Se usa para retrasos y para los keyframes de `interpolate`.
 */
export const beat = (frames: number) => Math.round(frames / SPEED);

/**
 * `fps` acelerado para `spring()`.
 *
 * Un spring no se expresa en frames sino en física: la única forma de que se
 * asiente antes es que crea que el tiempo pasa más rápido. Pasándole
 * `fps * SPEED` la curva es idéntica pero ocupa menos frames.
 */
export const springFps = (fps: number) => fps * SPEED;
