import { Sequence } from 'remotion';
import { Backdrop } from '../shared';
import { beat, SCENE_DURATIONS } from '../timing';
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
 * Las duraciones viven en `SCENE_DURATIONS` (`src/timing.ts`), expresadas al
 * ritmo original, y pasan por `beat()`. El `from` de cada escena se calcula
 * acumulando: así cambiar una duración no obliga a recalcular a mano el
 * arranque de todas las que siguen.
 *
 * Los datos (nombres de módulos, estados, algoritmos) salen de `projects[0]`
 * en `src/content.ts`. Si allá cambian, hay que reflejarlo acá.
 */

/** Una entrada por escena, en el mismo orden que `SCENE_DURATIONS`. */
const SCENES = [
  (d: number) => <Title duration={d} />,
  (d: number) => <Topology duration={d} />,
  (d: number) => <Protocol duration={d} />,
  (d: number) => <Scheduler duration={d} />,
  (d: number) => <Memory duration={d} />,
  (d: number) => <Outro duration={d} />,
];

export const KernelExplainer: React.FC = () => {
  let from = 0;

  return (
    <Backdrop>
      {SCENES.map((render, i) => {
        const duration = beat(SCENE_DURATIONS[i]);
        const start = from;
        from += duration;

        return (
          <Sequence key={i} from={start} durationInFrames={duration}>
            {render(duration)}
          </Sequence>
        );
      })}
    </Backdrop>
  );
};
