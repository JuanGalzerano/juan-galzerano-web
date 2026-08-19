import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { fontFamily } from '../../fonts';
import { SceneFrame } from './SceneFrame';

type Props = { readonly duration: number };

/**
 * Segmentos en memoria. `hole` marca los huecos que deja la fragmentación.
 * `from`/`to` son la posición antes y después de compactar, en unidades de la
 * barra (0..100).
 */
type Segment = {
  readonly id: string;
  readonly size: number;
  readonly from: number;
  readonly to: number;
  /** Hueco libre entre segmentos: se dibuja punteado y muere al compactar. */
  readonly hole?: boolean;
};

const SEGMENTS: readonly Segment[] = [
  { id: 'P1', size: 16, from: 0, to: 0 },
  { id: '', size: 9, from: 16, to: 0, hole: true },
  { id: 'P2', size: 22, from: 25, to: 16 },
  { id: '', size: 7, from: 47, to: 0, hole: true },
  { id: 'P3', size: 13, from: 54, to: 38 },
  { id: '', size: 11, from: 67, to: 0, hole: true },
  { id: 'P4', size: 18, from: 78, to: 51 },
];

const BAR = { x: 0, y: 170, w: 1680, h: 96 } as const;

const u = (units: number) => (units / 100) * BAR.w;

export const Memory: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fase 1 (0-110): se llena. Fase 2 (110-190): compacta. Fase 3 (190+): swap.
  const compact = spring({
    frame: frame - 120,
    fps,
    config: { damping: 200, mass: 1.2 },
  });

  const swapOut = spring({ frame: frame - 210, fps, config: { damping: 200 } });

  return (
    <SceneFrame
      index="04"
      eyebrow="Memoria"
      title="Segmentación, compactación y swap"
      duration={duration}
    >
      <svg width={1680} height={620} viewBox="0 0 1680 620" style={{ overflow: 'visible' }}>
        {/* Contenedor de la memoria. */}
        <rect
          x={BAR.x}
          y={BAR.y}
          width={BAR.w}
          height={BAR.h}
          fill="none"
          stroke={colors.line}
          strokeWidth={1.5}
        />
        <text x={0} y={BAR.y - 24} fill={colors.chalkFaint} fontFamily={fontFamily.mono} fontSize={22}>
          memoria principal
        </text>

        {SEGMENTS.map((seg, i) => {
          const appear = spring({
            frame: frame - 20 - i * 10,
            fps,
            config: { damping: 200, mass: 0.5 },
          });

          if (seg.hole) {
            // Los huecos desaparecen al compactar: eso es toda la idea.
            return (
              <g key={`hole-${i}`} opacity={appear * (1 - compact)}>
                <rect
                  x={u(seg.from)}
                  y={BAR.y}
                  width={u(seg.size)}
                  height={BAR.h}
                  fill="none"
                  stroke={colors.chalkFaint}
                  strokeWidth={1}
                  strokeDasharray="6 6"
                />
              </g>
            );
          }

          const x = interpolate(compact, [0, 1], [u(seg.from), u(seg.to)]);

          // P4 es el que se manda a swap al final.
          const isSwapped = seg.id === 'P4';
          const lift = isSwapped ? swapOut * 250 : 0;

          return (
            <g key={seg.id} opacity={appear} transform={`translate(${x} ${lift})`}>
              <rect
                x={0}
                y={BAR.y}
                width={u(seg.size)}
                height={BAR.h}
                fill={colors.ink700}
                stroke={isSwapped && swapOut > 0.05 ? colors.anno : colors.draft}
                strokeWidth={2}
              />
              <text
                x={u(seg.size) / 2}
                y={BAR.y + BAR.h / 2 + 10}
                textAnchor="middle"
                fill={isSwapped && swapOut > 0.05 ? colors.anno : colors.draft}
                fontFamily={fontFamily.mono}
                fontSize={28}
              >
                {seg.id}
              </text>
            </g>
          );
        })}

        {/* Disco de swap, abajo. */}
        <g opacity={spring({ frame: frame - 190, fps, config: { damping: 200 } })}>
          <rect x={0} y={420} width={BAR.w} height={96} fill="none" stroke={colors.line} strokeWidth={1.5} strokeDasharray="10 8" />
          <text x={0} y={400} fill={colors.chalkFaint} fontFamily={fontFamily.mono} fontSize={22}>
            swap en disco
          </text>
        </g>

        {/* Rótulos de las estrategias de asignación. */}
        <g opacity={spring({ frame: frame - 60, fps, config: { damping: 200 } })}>
          <text x={0} y={60} fill={colors.chalkDim} fontFamily={fontFamily.sans} fontSize={30}>
            Best Fit y Worst Fit para elegir el hueco · compactación cuando ya no alcanza
          </text>
        </g>
      </svg>
    </SceneFrame>
  );
};
