import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { fontFamily } from '../../fonts';
import { SceneFrame } from './SceneFrame';

type Props = { readonly duration: number };

/**
 * Los siete estados del planificador. Las posiciones son fijas; lo que se anima
 * es un proceso recorriéndolos.
 */
const STATES = [
  { id: 'NEW', x: 120, y: 90 },
  { id: 'READY', x: 500, y: 90 },
  { id: 'EXEC', x: 880, y: 90 },
  { id: 'BLOCKED', x: 1260, y: 90 },
  { id: 'EXIT', x: 1640, y: 90 },
  { id: 'SUSP_READY', x: 500, y: 340 },
  { id: 'SUSP_BLOCKED', x: 1260, y: 340 },
] as const;

/** Camino del proceso de ejemplo, por índice de estado. */
const PATH = [0, 1, 2, 3, 6, 5, 1, 2, 4] as const;

/**
 * Transiciones dibujadas. `arc` se usa cuando los dos estados están alineados y
 * hay un tercero en el medio: la línea recta pasaría por detrás de esa caja y se
 * leería mal, así que se curva por arriba.
 */
type Transition = {
  readonly from: number;
  readonly to: number;
  readonly arc?: boolean;
};

const TRANSITIONS: readonly Transition[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 6 },
  { from: 6, to: 5 },
  { from: 5, to: 1 },
  { from: 2, to: 4, arc: true },
];

/** Frames que tarda cada salto entre estados. */
const STEP = 15;

const BOX_W = 250;
const BOX_H = 68;

const ALGOS = ['FIFO', 'RR', 'CMN'] as const;

export const Scheduler: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const start = 40;
  const progress = Math.max(0, (frame - start) / STEP);
  const leg = Math.min(Math.floor(progress), PATH.length - 2);
  const within = Math.min(1, progress - leg);

  const from = STATES[PATH[leg]];
  const to = STATES[PATH[leg + 1]];

  // Easing suave en cada salto para que no se lea como teletransporte.
  const eased = interpolate(within, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Si la transición actual se dibuja curva, el proceso tiene que seguir la
  // misma curva; si no, cortaría en recta por encima de la caja que se esquivó.
  const curved = TRANSITIONS.find(
    (t) => t.from === PATH[leg] && t.to === PATH[leg + 1] && t.arc,
  );

  const px = curved
    ? (1 - eased) ** 2 * from.x +
      2 * (1 - eased) * eased * ((from.x + to.x) / 2) +
      eased ** 2 * to.x
    : from.x + (to.x - from.x) * eased;

  const py = curved
    ? (1 - eased) ** 2 * from.y +
      2 * (1 - eased) * eased * (from.y - 130) +
      eased ** 2 * to.y
    : from.y + (to.y - from.y) * eased;

  const currentState = PATH[within > 0.5 ? leg + 1 : leg];

  return (
    <SceneFrame
      index="03"
      eyebrow="Planificación"
      title="Siete estados, tres algoritmos"
      duration={duration}
    >
      <svg width={1680} height={620} viewBox="0 0 1920 620" style={{ overflow: 'visible' }}>
        {/*
          Transiciones. Van antes que las cajas para que queden por debajo: las
          cajas tienen relleno, así que la línea entra "por el borde" sola.
          La transición que el proceso está recorriendo ahora se pinta en lima.
        */}
        {TRANSITIONS.map((edge) => {
          const a = STATES[edge.from];
          const b = STATES[edge.to];
          const live = PATH[leg] === edge.from && PATH[leg + 1] === edge.to;

          const d = edge.arc
            ? `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${a.y - 130} ${b.x} ${b.y}`
            : `M ${a.x} ${a.y} L ${b.x} ${b.y}`;

          return (
            <path
              key={`t-${edge.from}-${edge.to}`}
              d={d}
              fill="none"
              stroke={live ? colors.draft : colors.lineStrong}
              strokeWidth={live ? 3 : 2}
              opacity={spring({ frame: frame - 20, fps, config: { damping: 200 } })}
            />
          );
        })}

        {/* Estados. */}
        {STATES.map((state, i) => {
          const appear = spring({ frame: frame - i * 5, fps, config: { damping: 200, mass: 0.5 } });
          const active = currentState === i;

          return (
            <g key={state.id} opacity={appear} transform={`translate(${state.x} ${state.y})`}>
              <rect
                x={-BOX_W / 2}
                y={-BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                fill={active ? colors.ink700 : colors.ink800}
                stroke={active ? colors.draft : colors.lineStrong}
                strokeWidth={active ? 3 : 2}
              />
              <text
                x={0}
                y={8}
                textAnchor="middle"
                fill={active ? colors.draft : colors.chalkFaint}
                fontFamily={fontFamily.mono}
                fontSize={24}
              >
                {state.id}
              </text>
            </g>
          );
        })}

        {/* El proceso recorriendo la máquina de estados. */}
        <g transform={`translate(${px} ${py})`}>
          <rect x={-16} y={-16} width={32} height={32} fill={colors.anno} />
        </g>

        {/* Algoritmos de planificación, apareciendo abajo. */}
        <g transform="translate(120 520)">
          <text x={0} y={0} fill={colors.chalkFaint} fontFamily={fontFamily.mono} fontSize={22}>
            algoritmos
          </text>
          {ALGOS.map((algo, i) => (
            <g
              key={algo}
              transform={`translate(${i * 190} 26)`}
              opacity={spring({ frame: frame - 140 - i * 12, fps, config: { damping: 200 } })}
            >
              <rect x={0} y={0} width={160} height={62} fill="none" stroke={colors.lineStrong} strokeWidth={2} />
              <text x={80} y={40} textAnchor="middle" fill={colors.chalkDim} fontFamily={fontFamily.mono} fontSize={26}>
                {algo}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </SceneFrame>
  );
};
