import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { fontFamily } from '../../fonts';
import { SceneFrame } from './SceneFrame';

type Props = { readonly duration: number };

/** Campos del paquete, serializados a mano sobre el socket. */
const FIELDS = [
  { label: 'op_code', width: 150, color: colors.draft },
  { label: 'size', width: 150, color: colors.anno },
  { label: 'buffer', width: 520, color: colors.chalkDim },
] as const;

const TRACK = { x1: 240, x2: 1560, y: 200 } as const;

export const Protocol: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // El paquete cruza el enlace dos veces: ida (envío) y vuelta (respuesta).
  const travel = interpolate(frame, [40, 130, 150, 240], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const x = TRACK.x1 + (TRACK.x2 - TRACK.x1) * travel;

  return (
    <SceneFrame
      index="02"
      eyebrow="Protocolo"
      title="op_code + buffer, serializado a mano"
      duration={duration}
    >
      <svg width={1680} height={700} viewBox="0 0 1920 700" style={{ overflow: 'visible' }}>
        {/* Extremos del enlace. */}
        {[
          { x: TRACK.x1, label: 'cpu' },
          { x: TRACK.x2, label: 'kernel_memory' },
        ].map((end) => (
          <g key={end.label} transform={`translate(${end.x} ${TRACK.y})`}>
            <rect x={-130} y={-38} width={260} height={76} fill={colors.ink800} stroke={colors.line} strokeWidth={1.5} />
            <text x={0} y={9} textAnchor="middle" fill={colors.chalkDim} fontFamily={fontFamily.mono} fontSize={26}>
              {end.label}
            </text>
          </g>
        ))}

        {/* El cable. */}
        <line x1={TRACK.x1 + 130} y1={TRACK.y} x2={TRACK.x2 - 130} y2={TRACK.y} stroke={colors.line} strokeWidth={1.5} />
        <text
          x={(TRACK.x1 + TRACK.x2) / 2}
          y={TRACK.y - 30}
          textAnchor="middle"
          fill={colors.chalkFaint}
          fontFamily={fontFamily.mono}
          fontSize={22}
        >
          socket TCP
        </text>

        {/* El paquete viajando. */}
        <g transform={`translate(${x} ${TRACK.y})`} opacity={travel > 0.01 && travel < 0.99 ? 1 : 0}>
          <rect x={-16} y={-16} width={32} height={32} fill={colors.draft} />
        </g>

        {/* Desarmado del paquete: cada campo entra por separado. */}
        <g transform="translate(280 420)">
          <text x={0} y={-40} fill={colors.chalkFaint} fontFamily={fontFamily.mono} fontSize={22}>
            estructura en el cable
          </text>
          {FIELDS.reduce<{ nodes: React.ReactNode[]; offset: number }>(
            (acc, field, i) => {
              const appear = spring({
                frame: frame - 60 - i * 14,
                fps,
                config: { damping: 200, mass: 0.5 },
              });

              acc.nodes.push(
                <g key={field.label} transform={`translate(${acc.offset} 0)`} opacity={appear}>
                  <rect
                    x={0}
                    y={0}
                    width={field.width}
                    height={84}
                    fill="none"
                    stroke={field.color}
                    strokeWidth={1.5}
                  />
                  <text
                    x={field.width / 2}
                    y={52}
                    textAnchor="middle"
                    fill={field.color}
                    fontFamily={fontFamily.mono}
                    fontSize={28}
                  >
                    {field.label}
                  </text>
                </g>,
              );
              acc.offset += field.width;
              return acc;
            },
            { nodes: [], offset: 0 },
          ).nodes}
        </g>

        <text
          x={280}
          y={590}
          fill={colors.chalkDim}
          fontFamily={fontFamily.sans}
          fontSize={30}
          opacity={spring({ frame: frame - 120, fps, config: { damping: 200 } })}
        >
          Sin librería de RPC: los bytes se arman y se leen a mano en los dos extremos.
        </text>
      </svg>
    </SceneFrame>
  );
};
