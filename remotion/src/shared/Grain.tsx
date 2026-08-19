import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { effects } from '../theme';

type Props = {
  readonly opacity?: number;
  /**
   * El sitio tiene el grano quieto (es un ::after estático). En video eso lee
   * como suciedad en el lente, así que por defecto se desplaza el tile una vez
   * por frame. El offset es determinístico, así que el render es reproducible.
   */
  readonly animated?: boolean;
};

/** Tile del `.grain::after` del sitio, idéntico byte a byte. */
const GRAIN_TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${effects.grainTile}' height='${effects.grainTile}'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${effects.grainBaseFrequency}' numOctaves='${effects.grainOctaves}'/%3E%3C/filter%3E%3Crect width='${effects.grainTile}' height='${effects.grainTile}' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** Offset pseudoaleatorio pero determinístico para un frame dado. */
const jitter = (frame: number, salt: number) => {
  const n = Math.sin((frame + 1) * salt) * 43758.5453;
  return (n - Math.floor(n)) * effects.grainTile;
};

/**
 * `.grain::after` del sitio: grano de film fino (feTurbulence fractalNoise,
 * baseFrequency 0.85, 3 octavas) a opacity 0.035.
 */
export const Grain: React.FC<Props> = ({
  opacity = effects.grainOpacity,
  animated = true,
}) => {
  const frame = useCurrentFrame();

  const x = animated ? jitter(frame, 12.9898) : 0;
  const y = animated ? jitter(frame, 78.233) : 0;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: `-${effects.grainTile}px`,
          opacity,
          backgroundImage: GRAIN_TILE,
          backgroundRepeat: 'repeat',
          backgroundPosition: `${x}px ${y}px`,
        }}
      />
    </AbsoluteFill>
  );
};
