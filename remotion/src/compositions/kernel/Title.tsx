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

type Props = { readonly duration: number };

/** Placa de apertura: nombre del proyecto y una línea de qué es. */
export const Title: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps: springFps(fps), config: { damping: 200, mass: 0.8 } });
  const sub = spring({ frame: frame - beat(10), fps: springFps(fps), config: { damping: 200 } });
  const exit = interpolate(frame, [duration - beat(14), duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity: exit,
        justifyContent: 'center',
        padding: '0 140px',
      }}
    >
      <div
        style={{
          ...tag,
          fontSize: 22,
          color: colors.draft,
          opacity: enter,
        }}
      >
        Proyecto
      </div>

      <div
        style={{
          fontFamily: fontFamily.display,
          fontSize: 150,
          lineHeight: 0.95,
          color: colors.chalk,
          marginTop: 24,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
        }}
      >
        Kernel <span style={{ fontFamily: fontFamily.displayItalic, color: colors.draft }}>distribuido</span>
      </div>

      <div
        style={{
          fontFamily: fontFamily.sans,
          fontSize: 34,
          lineHeight: 1.5,
          color: colors.chalkDim,
          marginTop: 36,
          maxWidth: 1100,
          opacity: sub,
        }}
      >
        Siete módulos independientes que se comunican sólo por sockets TCP y
        ejecutan un pseudo-assembler propio.
      </div>

      <div
        style={{
          ...tag,
          fontSize: 20,
          color: colors.chalkFaint,
          marginTop: 44,
          opacity: sub,
        }}
      >
        C · pthreads · semáforos · serialización binaria
      </div>
    </AbsoluteFill>
  );
};
