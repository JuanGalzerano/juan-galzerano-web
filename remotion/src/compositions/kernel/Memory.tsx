import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../theme';
import { fontFamily } from '../../fonts';
import { SceneFrame } from './SceneFrame';

type Props = { readonly duration: number };

/**
 * Cómo se le busca lugar a un proceso en memoria segmentada.
 *
 * El proceso entrante prueba los huecos en orden: los dos primeros son más
 * chicos que él y rebota contra la barra, el tercero le entra. Después se
 * compacta para juntar lo que quedó suelto.
 *
 * Las medidas están en unidades de 0 a 100 sobre el ancho de la barra, así el
 * layout no depende de píxeles.
 */

type Segment = {
  readonly id: string;
  readonly size: number;
  /** Posición inicial y posición después de compactar. */
  readonly from: number;
  readonly to: number;
};

const SEGMENTS: readonly Segment[] = [
  { id: 'P1', size: 16, from: 0, to: 0 },
  { id: 'P2', size: 22, from: 25, to: 16 },
  { id: 'P3', size: 13, from: 54, to: 38 },
];

/** Tamaño del proceso que quiere entrar. Sólo le entra en el tercer hueco. */
const BLOCK = 18;

const GAPS = [
  { from: 16, size: 9 },
  { from: 47, size: 7 },
  { from: 67, size: 20 },
] as const;

const BAR = { y: 150, w: 1680, h: 96 } as const;

/** Dónde espera el proceso entre intento e intento. */
const PARK = BAR.y + BAR.h + 150;
/** Hasta dónde llega cuando el hueco lo rechaza: justo debajo de la barra. */
const BLOCKED = BAR.y + BAR.h + 16;

const u = (units: number) => (units / 100) * BAR.w;

/** Borde izquierdo del hueco, para que el bloque entre alineado. */
const slot = (gap: (typeof GAPS)[number]) => u(gap.from);

/**
 * Cronograma de los tres intentos. Cada uno se posiciona sobre el hueco, sube y
 * vuelve a bajar — salvo el último, que entra y se queda.
 */
const TRY_1 = { move: 45, up: 62, back: 78 };
const TRY_2 = { move: 88, up: 105, back: 121 };
const TRY_3 = { move: 131, up: 152 };
const COMPACT_AT = 200;

export const Memory: React.FC<Props> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const compact = spring({
    frame: frame - COMPACT_AT,
    fps,
    config: { damping: 200, mass: 1.2 },
  });

  const inserted = frame >= TRY_3.up;

  // Recorrido horizontal: de hueco en hueco.
  const x = interpolate(
    frame,
    [TRY_1.move - 14, TRY_1.move, TRY_2.move - 12, TRY_2.move, TRY_3.move - 12, TRY_3.move],
    [slot(GAPS[0]), slot(GAPS[0]), slot(GAPS[0]), slot(GAPS[1]), slot(GAPS[1]), slot(GAPS[2])],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Recorrido vertical: sube, choca, baja. En el tercer intento se queda arriba.
  const y = interpolate(
    frame,
    [TRY_1.move, TRY_1.up, TRY_1.back, TRY_2.move, TRY_2.up, TRY_2.back, TRY_3.move, TRY_3.up],
    [PARK, BLOCKED, PARK, PARK, BLOCKED, PARK, PARK, BAR.y],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Al chocar contra un hueco que le queda chico, tiembla.
  const rejecting =
    (frame >= TRY_1.up - 5 && frame <= TRY_1.up + 10) ||
    (frame >= TRY_2.up - 5 && frame <= TRY_2.up + 10);
  const shake = rejecting ? Math.sin(frame * 1.6) * 5 : 0;

  // Ya adentro, el proceso viaja con el resto cuando se compacta.
  const compactedX = interpolate(compact, [0, 1], [slot(GAPS[2]), u(51)]);

  return (
    <SceneFrame
      index="04"
      eyebrow="Memoria"
      title="Buscar un hueco, y si no entra, compactar"
      duration={duration}
    >
      <svg width={1680} height={620} viewBox="0 0 1680 620" style={{ overflow: 'visible' }}>
        <text x={0} y={56} fill={colors.chalkDim} fontFamily={fontFamily.sans} fontSize={30}>
          Un proceso nuevo prueba los huecos libres hasta encontrar uno donde entre.
        </text>

        <rect
          x={0}
          y={BAR.y}
          width={BAR.w}
          height={BAR.h}
          fill="none"
          stroke={colors.lineStrong}
          strokeWidth={2}
        />
        <text x={0} y={BAR.y - 22} fill={colors.chalkFaint} fontFamily={fontFamily.mono} fontSize={22}>
          memoria principal
        </text>

        {/* Huecos libres, con su tamaño arriba. Los que le quedan chicos al
            proceso se marcan en naranja mientras lo rechazan. */}
        {GAPS.map((gap, i) => {
          const isTarget =
            (i === 0 && frame >= TRY_1.move && frame < TRY_1.back) ||
            (i === 1 && frame >= TRY_2.move && frame < TRY_2.back) ||
            (i === 2 && frame >= TRY_3.move);
          const tooSmall = isTarget && i < 2;
          const filled = i === 2 && inserted;

          return (
            <g key={`gap-${i}`} opacity={(1 - compact) * (filled ? 0 : 1)}>
              <rect
                x={u(gap.from)}
                y={BAR.y}
                width={u(gap.size)}
                height={BAR.h}
                fill="none"
                stroke={tooSmall ? colors.anno : colors.chalkFaint}
                strokeWidth={tooSmall ? 3 : 2}
                strokeDasharray="6 6"
              />
              <text
                x={u(gap.from) + u(gap.size) / 2}
                y={BAR.y - 22}
                textAnchor="middle"
                fill={tooSmall ? colors.anno : colors.chalkFaint}
                fontFamily={fontFamily.mono}
                fontSize={20}
              >
                {gap.size}
              </text>
            </g>
          );
        })}

        {/* Segmentos ya asignados. */}
        {SEGMENTS.map((seg, i) => {
          const appear = spring({
            frame: frame - 15 - i * 8,
            fps,
            config: { damping: 200, mass: 0.5 },
          });
          const sx = interpolate(compact, [0, 1], [u(seg.from), u(seg.to)]);

          return (
            <g key={seg.id} opacity={appear} transform={`translate(${sx} 0)`}>
              <rect
                x={0}
                y={BAR.y}
                width={u(seg.size)}
                height={BAR.h}
                fill={colors.ink700}
                stroke={colors.draft}
                strokeWidth={2}
              />
              <text
                x={u(seg.size) / 2}
                y={BAR.y + BAR.h / 2 + 10}
                textAnchor="middle"
                fill={colors.draft}
                fontFamily={fontFamily.mono}
                fontSize={28}
              >
                {seg.id}
              </text>
            </g>
          );
        })}

        {/* El proceso que quiere entrar. */}
        <g transform={`translate(${(inserted ? compactedX : x) + shake} ${y})`}>
          <rect
            x={0}
            y={0}
            width={u(BLOCK)}
            height={BAR.h}
            fill={colors.ink700}
            stroke={rejecting ? colors.anno : colors.draft}
            strokeWidth={2}
          />
          <text
            x={u(BLOCK) / 2}
            y={BAR.h / 2 + 10}
            textAnchor="middle"
            fill={rejecting ? colors.anno : colors.draft}
            fontFamily={fontFamily.mono}
            fontSize={28}
          >
            P4
          </text>
          <text
            x={u(BLOCK) / 2}
            y={BAR.h + 34}
            textAnchor="middle"
            fill={colors.chalkFaint}
            fontFamily={fontFamily.mono}
            fontSize={20}
            opacity={inserted ? 0 : 1}
          >
            {BLOCK}
          </text>

          {/* Viaja con el bloque, a su izquierda, para no taparlo. */}
          <text
            x={-28}
            y={BAR.h / 2 + 10}
            textAnchor="end"
            fill={colors.anno}
            fontFamily={fontFamily.mono}
            fontSize={26}
            opacity={rejecting ? 1 : 0}
          >
            no entra
          </text>
        </g>

        {/* Rótulo de la compactación. */}
        <text
          x={0}
          y={PARK + BAR.h + 30}
          fill={colors.chalkDim}
          fontFamily={fontFamily.sans}
          fontSize={30}
          opacity={compact}
        >
          Compactar junta los segmentos y deja un solo hueco grande al final.
        </text>
      </svg>
    </SceneFrame>
  );
};
