import { AbsoluteFill } from 'remotion';
import { effects } from '../theme';

type Props = {
  readonly opacity?: number;
};

/**
 * `body::after` del sitio: scanlines finas por encima de todo.
 * repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 6px)
 * con opacity 0.24.
 */
export const Scanlines: React.FC<Props> = ({
  opacity = effects.scanlineOpacity,
}) => {
  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `repeating-linear-gradient(0deg, ${effects.scanlineColor} 0 ${effects.scanlineThickness}px, transparent ${effects.scanlineThickness}px ${effects.scanlineGap}px)`,
      }}
    />
  );
};
