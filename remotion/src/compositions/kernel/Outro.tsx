import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { colors } from '../../theme';
import { fontFamily, tag } from '../../fonts';

type Props = { readonly duration: number };

/** Cierre: dónde está el código. */
export const Outro: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [duration - 16, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity: exit,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <div style={{ ...tag, fontSize: 22, color: colors.chalkFaint, opacity: enter }}>
        Código
      </div>
      <div
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 44,
          color: colors.draft,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
        }}
      >
        github.com/JuanGalzerano/kernel-project-utn.frba
      </div>
    </AbsoluteFill>
  );
};
