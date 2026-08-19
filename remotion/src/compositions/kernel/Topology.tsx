import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { accents, colors, rgba } from '../../theme';
import { fontFamily } from '../../fonts';
import { beat, springFps } from '../../timing';
import { SceneFrame } from './SceneFrame';

type Props = { readonly duration: number };

/**
 * Los siete módulos del kernel apareciendo uno por uno y tendiendo los enlaces.
 * Los nombres salen de `projects[0].detail` en `src/content.ts`.
 */
type ModuleNode = {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  /** Los dos módulos centrales del kernel, resaltados en lima. */
  readonly hub?: boolean;
};

const MODULES: readonly ModuleNode[] = [
  { name: 'kernel_scheduler', x: 960, y: 150, hub: true },
  { name: 'kernel_memory', x: 960, y: 400, hub: true },
  { name: 'cpu', x: 380, y: 275 },
  { name: 'memory_stick', x: 1540, y: 275 },
  { name: 'swap', x: 1540, y: 545 },
  { name: 'io', x: 380, y: 545 },
  { name: 'utils', x: 960, y: 660 },
];

const EDGES = [
  [0, 2],
  [0, 1],
  [0, 5],
  [1, 3],
  [1, 4],
  [1, 6],
  [2, 5],
  [3, 4],
] as const;

const BOX_W = 300;
const BOX_H = 70;

export const Topology: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame
      index="01"
      eyebrow="Arquitectura"
      title="Siete módulos, un solo canal"
      duration={duration}
    >
      <svg width={1680} height={760} viewBox="0 0 1920 760" style={{ overflow: 'visible' }}>
        {/* Enlaces: se dibujan con stroke-dashoffset para que parezcan tenderse. */}
        {EDGES.map(([from, to], i) => {
          const a = MODULES[from];
          const b = MODULES[to];
          const length = Math.hypot(b.x - a.x, b.y - a.y);
          const draw = spring({
            frame: frame - beat(30) - i * beat(6),
            fps: springFps(fps),
            config: { damping: 200 },
          });

          return (
            <line
              key={`edge-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={colors.lineStrong}
              strokeWidth={2}
              strokeDasharray={length}
              strokeDashoffset={length * (1 - draw)}
            />
          );
        })}

        {/* Módulos. */}
        {MODULES.map((mod, i) => {
          const appear = spring({
            frame: frame - i * beat(8),
            fps: springFps(fps),
            config: { damping: 200, mass: 0.5 },
          });

          return (
            <g key={mod.name} opacity={appear} transform={`translate(${mod.x} ${mod.y})`}>
              <rect
                x={-BOX_W / 2}
                y={-BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                fill={colors.ink800}
                stroke={mod.hub ? colors.draft : colors.lineStrong}
                strokeWidth={mod.hub ? 3 : 2}
              />
              {/* Marcas de registro en las esquinas, como la clase .ticked del sitio. */}
              {mod.hub ? (
                <rect
                  x={-BOX_W / 2 - 8}
                  y={-BOX_H / 2 - 8}
                  width={BOX_W + 16}
                  height={BOX_H + 16}
                  fill="none"
                  stroke={rgba(accents.teal, 0.3)}
                  strokeWidth={1}
                />
              ) : null}
              <text
                x={0}
                y={7}
                textAnchor="middle"
                fill={mod.hub ? colors.draft : colors.chalkDim}
                fontFamily={fontFamily.mono}
                fontSize={26}
              >
                {mod.name}
              </text>
            </g>
          );
        })}
      </svg>
    </SceneFrame>
  );
};
