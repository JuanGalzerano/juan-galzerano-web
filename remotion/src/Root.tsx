import { Composition } from 'remotion';
import { KernelExplainer } from './compositions/KernelExplainer';

/**
 * La viñeta de la topología que acompaña al resumen del proyecto NO vive acá:
 * es SVG animado en el sitio (`src/components/TopologyLoop.tsx`). Un clip de
 * 300px decorativo depende de que el navegador acepte reproducirlo, y cuando
 * falla queda congelado; en SVG siempre se mueve y pesa 2 KB.
 *
 * Remotion se queda con lo que sí justifica ser video: el explainer largo.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="KernelExplainer"
      component={KernelExplainer}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={1350}
    />
  );
};
