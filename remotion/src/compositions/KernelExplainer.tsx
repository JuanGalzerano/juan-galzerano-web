import { Sequence } from 'remotion';
import { Backdrop } from '../shared';
import { Title } from './kernel/Title';
import { Topology } from './kernel/Topology';
import { Protocol } from './kernel/Protocol';
import { Scheduler } from './kernel/Scheduler';
import { Memory } from './kernel/Memory';
import { Outro } from './kernel/Outro';

/**
 * Explainer del kernel distribuido: 45 s a 30 fps.
 *
 * Cada escena vive en su propia `<Sequence>`, así `useCurrentFrame()` adentro
 * arranca en 0 y la animación se escribe en tiempo local. La duración va
 * también por prop porque cada escena la necesita para su fundido de salida.
 *
 * Los datos (nombres de módulos, estados, algoritmos) salen de
 * `projects[0]` en `src/content.ts`. Si allá cambian, hay que reflejarlo acá.
 */

const SCENES = [
  { from: 0, duration: 120, render: (d: number) => <Title duration={d} /> },
  { from: 120, duration: 270, render: (d: number) => <Topology duration={d} /> },
  { from: 390, duration: 270, render: (d: number) => <Protocol duration={d} /> },
  { from: 660, duration: 300, render: (d: number) => <Scheduler duration={d} /> },
  { from: 960, duration: 300, render: (d: number) => <Memory duration={d} /> },
  { from: 1260, duration: 90, render: (d: number) => <Outro duration={d} /> },
] as const;

export const KernelExplainer: React.FC = () => {
  return (
    <Backdrop>
      {SCENES.map((scene) => (
        <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration}>
          {scene.render(scene.duration)}
        </Sequence>
      ))}
    </Backdrop>
  );
};
