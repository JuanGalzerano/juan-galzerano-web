import type { ReactNode } from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { colors } from '../../theme';
import { beat, springFps } from '../../timing';
import { fontFamily, tag } from '../../fonts';

type Props = {
  /** Índice de sección, con el mismo formato que la nav del sitio: '01', '02'… */
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  /** Duración de la Sequence que envuelve a esta escena, para el fundido de salida. */
  readonly duration: number;
  readonly children?: ReactNode;
};

/**
 * Encabezado común de cada escena del explainer. Replica el `SectionHead` del
 * sitio: índice + eyebrow en mono lima, título en Instrument Serif.
 *
 * La duración llega por prop en vez de leerse de `useVideoConfig()`: dentro de
 * una `<Sequence>` ese hook no siempre reporta la duración del tramo, y acá
 * hace falta el número exacto para calcular el fundido de salida.
 */
export const SceneFrame: React.FC<Props> = ({
  index,
  eyebrow,
  title,
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada: un spring corto, igual que los `Reveal` del sitio.
  const enter = spring({ frame, fps: springFps(fps), config: { damping: 200, mass: 0.6 } });

  // Salida: los últimos 12 frames se van a negro para encadenar con la escena
  // siguiente sin corte duro.
  const exit = interpolate(frame, [duration - beat(12), duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: exit, padding: '90px 120px' }}>
      <div
        style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        }}
      >
        <div
          style={{
            ...tag,
            fontSize: 22,
            color: colors.chalkFaint,
            display: 'flex',
            gap: 16,
          }}
        >
          <span>{index}</span>
          <span style={{ color: colors.line }}>/</span>
          <span style={{ color: colors.draft }}>{eyebrow}</span>
        </div>

        <div
          style={{
            fontFamily: fontFamily.display,
            fontSize: 76,
            lineHeight: 1.05,
            color: colors.chalk,
            marginTop: 18,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', marginTop: 56 }}>{children}</div>
    </AbsoluteFill>
  );
};
