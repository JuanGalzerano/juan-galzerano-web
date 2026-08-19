import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import {
  accentAlpha,
  accents,
  backgroundGradient,
  colors,
  rgba,
} from '../theme';
import { Grid } from './Grid';
import { Grain } from './Grain';
import { Scanlines } from './Scanlines';

type Props = {
  readonly children?: ReactNode;
  /** Parallax de la grilla y los halos, como --px/--py en el sitio. */
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly grid?: boolean;
  readonly grain?: boolean;
  readonly scanlines?: boolean;
};

/**
 * Fondo completo del sitio en un solo componente: degradado vertical de tinta,
 * halo teal arriba, halo violeta a la derecha, grilla de 56px, grano y
 * scanlines. Replica las capas del `body` de `src/index.css`.
 */
export const Backdrop: React.FC<Props> = ({
  children,
  offsetX = 0,
  offsetY = 0,
  grid = true,
  grain = true,
  scanlines = true,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink900,
        color: colors.chalk,
      }}
    >
      {/* body { background: dos halos radiales sobre el degradado } */}
      <AbsoluteFill
        style={{
          background: [
            `radial-gradient(circle at calc(50% + ${offsetX * 1.6}px) calc(-14% + ${offsetY * 1.2}px), ${rgba(accents.teal, accentAlpha.tealHalo)}, transparent 576px)`,
            `radial-gradient(circle at calc(92% - ${offsetX * 2}px) calc(42% - ${offsetY * 1.4}px), ${rgba(accents.violet, accentAlpha.violet)}, transparent 480px)`,
            backgroundGradient,
          ].join(', '),
        }}
      />

      {grid ? <Grid offsetX={offsetX} offsetY={offsetY} /> : null}

      <AbsoluteFill>{children}</AbsoluteFill>

      {grain ? <Grain /> : null}
      {scanlines ? <Scanlines /> : null}
    </AbsoluteFill>
  );
};
