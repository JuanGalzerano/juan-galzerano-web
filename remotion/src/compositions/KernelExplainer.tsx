import { Sequence } from 'remotion';
import { Backdrop } from '../shared';
import { beat } from '../timing';
import { Title } from './kernel/Title';
import { Topology } from './kernel/Topology';
import { Protocol } from './kernel/Protocol';
import { Scheduler } from './kernel/Scheduler';
import { Memory } from './kernel/Memory';
import { Outro } from './kernel/Outro';

/**
 * Explainer del kernel distribuido.
 *
 * Cada escena vive en su propia `<Sequence>`, así `useCurrentFrame()` adentro
 * arranca en 0 y la animación se escribe en tiempo local. La duración va
 * también por prop porque cada escena la necesita para su fundido de salida.
 *
 * Las duraciones están expresadas al ritmo original y pasan por `beat()`, que
 * las escala según `SPEED` en `src/timing.ts`. El `from` de cada escena se
 * calcula acumulando: así cambiar una duración no obliga a recalcular a mano
 * el arranque de todas las que siguen.
 *
 * Los datos (nombres de módulos, estados, algoritmos) salen de `projects[0]`
 * en `src/content.ts`. Si allá cambian, hay que reflejarlo acá.
 */

const SCENES = [
  { duration: 120, render: (d: number) => <Title duration={d} /> },
  // Arquitectura termina de dibujarse cerca del frame 100 del ritmo original;
  // el resto es tiempo de lectura.
  { duration: 240, render: (d: number) => <Topology duration={d} /> },
  { duration: 270, render: (d: number) => <Protocol duration={d} /> },
  { duration: 300, render: (d: number) => <Scheduler duration={d} /> },
  { duration: 300, render: (d: number) => <Memory duration={d} /> },
  { duration: 90, render: (d: number) => <Outro duration={d} /> },
];

/** Duración total ya escalada. La usa `Root.tsx` para la composición. */
export const EXPLAINER_DURATION = SCENES.reduce(
  (total, scene) => total + beat(scene.duration),
  0,
);

export const KernelExplainer: React.FC = () => {
  let from = 0;

  return (
    <Backdrop>
      {SCENES.map((scene, i) => {
        const duration = beat(scene.duration);
        const start = from;
        from += duration;

        return (
          <Sequence key={i} from={start} durationInFrames={duration}>
            {scene.render(duration)}
          </Sequence>
        );
      })}
    </Backdrop>
  );
};
