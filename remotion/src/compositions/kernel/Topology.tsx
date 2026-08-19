import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { accents, colors, rgba } from '../../theme';
import { fontFamily } from '../../fonts';
import { beat, springFps } from '../../timing';
import { SceneFrame } from './SceneFrame';

type Props = { readonly duration: number };

/**
 * Los procesos del kernel apareciendo uno por uno y tendiendo los enlaces.
 *
 * `utils` no está en el diagrama a propósito: no es un proceso que corra
 * aparte ni hable por socket, es la librería compartida donde viven las
 * funciones comunes y la serialización. Dibujarlo como un nodo más daría a
 * entender que es un séptimo extremo de la red, que es justo lo contrario.
 *
 * Las posiciones están elegidas para que ningún enlace cruce a otro ni pase
 * por encima de una caja: cada arista une vecinos en la grilla.
 */

type ModuleNode = {
  readonly name: string;
  readonly x: number;
  readonly y: number;
  /** Los dos procesos del kernel, resaltados en lima. */
  readonly hub?: boolean;
};

const MODULES: readonly ModuleNode[] = [
  { name: 'io', x: 250, y: 120 },
  { name: 'kernel_scheduler', x: 760, y: 120, hub: true },
  { name: 'cpu', x: 1270, y: 120 },
  { name: 'kernel_memory', x: 1010, y: 400, hub: true },
  { name: 'memory_stick', x: 1600, y: 400 },
  { name: 'swap', x: 1010, y: 660 },
];

const IO = 0;
const SCHEDULER = 1;
const CPU = 2;
const MEMORY = 3;
const STICK = 4;
const SWAP = 5;

/**
 * Quién habla con quién. Ojo: es la topología real del TP, no una malla
 * completa — `io` sólo conoce al scheduler y `swap` sólo a kernel_memory.
 */
const EDGES: readonly [number, number][] = [
  [IO, SCHEDULER],
  [SCHEDULER, CPU],
  [SCHEDULER, MEMORY],
  [CPU, MEMORY],
  [CPU, STICK],
  [STICK, MEMORY],
  [SWAP, MEMORY],
];

const BOX_W = 300;
const BOX_H = 70;

export const Topology: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneFrame
      index="01"
      eyebrow="Arquitectura"
      title="Seis procesos, un solo canal"
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

        {/* Procesos. */}
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

        <text
          x={0}
          y={750}
          fill={colors.chalkFaint}
          fontFamily={fontFamily.mono}
          fontSize={22}
          opacity={spring({ frame: frame - beat(90), fps: springFps(fps), config: { damping: 200 } })}
        >
          utils no corre aparte: es la librería compartida de serialización
        </text>
      </svg>
    </SceneFrame>
  );
};
