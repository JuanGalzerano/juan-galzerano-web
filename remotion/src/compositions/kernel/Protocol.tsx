import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { fontFamily } from '../../fonts';
import { beat, springFps } from '../../timing';
import { SceneFrame } from './SceneFrame';

type Props = { readonly duration: number };

/** Campos del paquete, serializados a mano sobre el socket. */
const FIELDS = [
  { label: 'op_code', width: 150, color: colors.draft },
  { label: 'size', width: 150, color: colors.anno },
  { label: 'buffer', width: 520, color: colors.chalkDim },
] as const;

const TRACK = { x1: 240, x2: 1560, y: 200 } as const;

/** Mitad del ancho de las cajas de los extremos: el cable arranca en su borde. */
const END_HALF = 130;

/** Frames que tarda el paquete en cruzar el enlace de punta a punta. */
const CROSSING = beat(26);
/** Ida y vuelta. */
const ROUND_TRIP = CROSSING * 2;

export const Protocol: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Un solo fundido para toda la escena: aparece completa y se lee de una.
  // Antes cada campo entraba por separado y obligaba a esperar para entender.
  const enter = spring({ frame: frame - beat(4), fps: springFps(fps), config: { damping: 200, mass: 0.6 } });

  // El paquete va y vuelve sin parar: pedido y respuesta.
  const elapsed = Math.max(0, frame - beat(10));
  const phase = elapsed % ROUND_TRIP;
  const leg = (phase % CROSSING) / CROSSING;
  const travel = phase < CROSSING ? leg : 1 - leg;

  // Recorre sólo el cable, de borde a borde: si llegara al centro de las cajas
  // se metería adentro de ellas.
  const from = TRACK.x1 + END_HALF;
  const to = TRACK.x2 - END_HALF;
  const x = from + (to - from) * travel;

  return (
    <SceneFrame
      index="02"
      eyebrow="Protocolo"
      title="op_code + buffer, serializado a mano"
      duration={duration}
    >
      <svg
        width={1680}
        height={700}
        viewBox="0 0 1920 700"
        style={{ overflow: 'visible' }}
        opacity={enter}
      >
        {/* Extremos del enlace. */}
        {[
          { x: TRACK.x1, label: 'cpu' },
          { x: TRACK.x2, label: 'kernel_memory' },
        ].map((end) => (
          <g key={end.label} transform={`translate(${end.x} ${TRACK.y})`}>
            <rect
              x={-END_HALF}
              y={-38}
              width={END_HALF * 2}
              height={76}
              fill={colors.ink800}
              stroke={colors.lineStrong}
              strokeWidth={2}
            />
            <text
              x={0}
              y={9}
              textAnchor="middle"
              fill={colors.chalkDim}
              fontFamily={fontFamily.mono}
              fontSize={26}
            >
              {end.label}
            </text>
          </g>
        ))}

        {/* El cable. */}
        <line
          x1={TRACK.x1 + END_HALF}
          y1={TRACK.y}
          x2={TRACK.x2 - END_HALF}
          y2={TRACK.y}
          stroke={colors.lineStrong}
          strokeWidth={2}
        />
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
        <rect x={x - 16} y={TRACK.y - 16} width={32} height={32} fill={colors.draft} />

        {/* Desarmado del paquete. */}
        <g transform="translate(280 420)">
          <text x={0} y={-40} fill={colors.chalkFaint} fontFamily={fontFamily.mono} fontSize={22}>
            estructura del paquete
          </text>
          {FIELDS.reduce<{ nodes: React.ReactNode[]; offset: number }>(
            (acc, field) => {
              acc.nodes.push(
                <g key={field.label} transform={`translate(${acc.offset} 0)`}>
                  <rect
                    x={0}
                    y={0}
                    width={field.width}
                    height={84}
                    fill="none"
                    stroke={field.color}
                    strokeWidth={2}
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

        <text x={280} y={590} fill={colors.chalkDim} fontFamily={fontFamily.sans} fontSize={30}>
          Sin librería de RPC: los bytes se arman y se leen a mano en los dos extremos.
        </text>
      </svg>
    </SceneFrame>
  );
};
