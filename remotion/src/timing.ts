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

/**
 * Duración de cada escena del explainer, al ritmo original y en orden.
 *
 * Vive acá y no junto a las escenas porque `Root.tsx` necesita el total para
 * declarar la composición, y exportar una constante desde un archivo de
 * componentes rompe el fast refresh del Studio.
 */
export const SCENE_DURATIONS = [
  120, // Título
  240, // Arquitectura — termina de dibujarse cerca del frame 100; el resto es lectura
  270, // Protocolo
  300, // Planificación
  300, // Memoria
  90, // Cierre
] as const;

/** Duración total ya escalada por SPEED. */
export const EXPLAINER_DURATION = SCENE_DURATIONS.reduce(
  (total, duration) => total + beat(duration),
  0,
);
