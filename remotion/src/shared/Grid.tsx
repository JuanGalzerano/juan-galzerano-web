import { AbsoluteFill } from 'remotion';
import { accentAlpha, accents, effects, rgba } from '../theme';

type Props = {
  /** Desplazamiento de la grilla, equivalente a --px/--py del sitio. */
  readonly offsetX?: number;
  readonly offsetY?: number;
  /** Multiplicador sobre el alfa base (0.035). */
  readonly intensity?: number;
  /** El sitio desvanece la grilla hacia los bordes con una máscara elíptica. */
  readonly masked?: boolean;
};

/**
 * `body::before` del sitio: grilla de 56px en violeta muy tenue
 * (rgba(156, 140, 255, 0.035)) que se desvanece hacia los bordes.
 */
export const Grid: React.FC<Props> = ({
  offsetX = 0,
  offsetY = 0,
  intensity = 1,
  masked = true,
}) => {
  const stroke = rgba(accents.violet, accentAlpha.violet * intensity);
  const line = `${effects.gridLineWidth}px`;

  const mask = `radial-gradient(ellipse 100% 80% at calc(50% + ${offsetX}px) calc(40% + ${offsetY}px), #000 20%, transparent 80%)`;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: [
          `linear-gradient(${stroke} ${line}, transparent ${line})`,
          `linear-gradient(90deg, ${stroke} ${line}, transparent ${line})`,
        ].join(', '),
        backgroundSize: `${effects.gridSize}px ${effects.gridSize}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
        maskImage: masked ? mask : undefined,
        WebkitMaskImage: masked ? mask : undefined,
      }}
    />
  );
};
