import { Composition } from 'remotion';
import { TopologyLoop } from './compositions/TopologyLoop';
import { KernelExplainer } from './compositions/KernelExplainer';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/*
        Bucle de la topología para el hueco de la card de Proyectos.
        720x540 alcanza de sobra: en pantalla ocupa ~300 px, así que incluso en
        retina sobra resolución, y el archivo pesa una fracción del de 1080p.
      */}
      <Composition
        id="TopologyLoop"
        component={TopologyLoop}
        width={720}
        height={540}
        fps={30}
        durationInFrames={360}
        defaultProps={{ zoom: 1.9 }}
      />

      {/* Explainer largo: 45 s a 30 fps. */}
      <Composition
        id="KernelExplainer"
        component={KernelExplainer}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={1350}
      />
    </>
  );
};
