import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { accents, colors, rgba } from '../theme';

/**
 * Bucle de la topología del kernel: nodos wireframe, enlaces y paquetes que
 * viajan por ellos, más anillos teal concéntricos. Vive en el hueco al costado
 * del resumen en la card de Proyectos.
 *
 * Habla el mismo idioma visual que la escena three.js del hero
 * (`src/components/HeroScene.tsx`), para que no se lea como una pieza ajena.
 *
 * REGLA DE ORO: el loop tiene que cerrar sin costura. Todo lo animado se
 * expresa en función de `t = frame / durationInFrames` (∈ [0,1)) y usa
 * `sin`/`cos` de `TAU * t` o módulos con multiplicador entero. Así el frame 359
 * empalma exactamente con el 0. Nada de `spring()`, que no vuelve al origen.
 *
 * FONDO NEGRO A PROPÓSITO: el sitio muestra este video con
 * `mix-blend-mode: screen`, donde el negro es neutro. Por eso acá no va ningún
 * fondo: el recuadro toma el color de la card en vez de plantarle un rectángulo
 * negro encima, y sólo se suman los trazos.
 */

export type TopologyLoopProps = {
  /**
   * Acercamiento de la topología. En 1 queda holgada respecto de 1920x1080;
   * en un recuadro chico ese aire es desperdicio, así que se acerca.
   */
  readonly zoom?: number;
};

const TAU = Math.PI * 2;

/** Medidas de referencia con las que se dibujó la topología. */
const BASE = { width: 1920, height: 1080 } as const;

/**
 * Nodos de la topología. `radius`/`angle` son la posición de reposo en
 * coordenadas polares; `orbit` cuántos píxeles se mueve en el ciclo y `phase`
 * el desfasaje, para que no respiren todos juntos.
 */
const NODES = [
  { radius: 0, angle: 0, size: 26, orbit: 6, phase: 0 },
  { radius: 300, angle: -90, size: 16, orbit: 14, phase: 0.1 },
  { radius: 360, angle: -25, size: 12, orbit: 18, phase: 0.35 },
  { radius: 330, angle: 40, size: 14, orbit: 12, phase: 0.6 },
  { radius: 390, angle: 128, size: 11, orbit: 20, phase: 0.2 },
  { radius: 300, angle: 196, size: 15, orbit: 15, phase: 0.8 },
  { radius: 420, angle: 245, size: 10, orbit: 16, phase: 0.45 },
] as const;

/** Enlaces por índice de nodo. El 0 es el centro y concentra la mayoría. */
const EDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 2],
  [3, 4],
  [5, 6],
  [2, 3],
] as const;

/**
 * Paquetes viajando. `edge` es el índice en EDGES, `speed` cuántas vueltas
 * completas da en el loop (entero, si no el corte se nota) y `offset` dónde
 * arranca.
 */
const PACKETS = [
  { edge: 0, speed: 2, offset: 0 },
  { edge: 1, speed: 1, offset: 0.4 },
  { edge: 3, speed: 2, offset: 0.15 },
  { edge: 4, speed: 1, offset: 0.7 },
  { edge: 6, speed: 3, offset: 0.25 },
  { edge: 8, speed: 2, offset: 0.55 },
] as const;

type Center = { readonly x: number; readonly y: number };

const toPoint = (
  node: (typeof NODES)[number],
  t: number,
  center: Center,
  scale: number,
) => {
  const breathe = Math.sin(TAU * (t + node.phase));
  const rad = ((node.angle + breathe * 2) * Math.PI) / 180;
  const r = (node.radius + breathe * node.orbit) * scale;

  return {
    x: center.x + Math.cos(rad) * r,
    y: center.y + Math.sin(rad) * r * 0.72, // achatado: da perspectiva sin 3D real
  };
};

export const TopologyLoop: React.FC<TopologyLoopProps> = ({ zoom = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const t = frame / durationInFrames;

  /**
   * Todo se dibuja relativo al tamaño de la composición, no en píxeles fijos.
   * Así la misma topología sirve para el hero a 1920x1080 y para la card a
   * 720x540 sin recortarse ni cambiar de proporciones.
   */
  const scale = Math.min(width / BASE.width, height / BASE.height) * zoom;
  const center = { x: width / 2, y: height * 0.46 };

  const points = NODES.map((node) => toPoint(node, t, center, scale));

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <AbsoluteFill>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Anillos teal concéntricos que se expanden y se desvanecen. */}
          {[0, 1, 2].map((i) => {
            const pulse = (t * 2 + i / 3) % 1;
            return (
              <circle
                key={`ring-${i}`}
                cx={center.x}
                cy={center.y}
                r={(90 + pulse * 340) * scale}
                fill="none"
                stroke={rgba(accents.teal, 0.22 * (1 - pulse))}
                strokeWidth={Math.max(1, 1.2 * scale)}
              />
            );
          })}

          {/* Enlaces. */}
          {EDGES.map(([from, to], i) => (
            <line
              key={`edge-${i}`}
              x1={points[from].x}
              y1={points[from].y}
              x2={points[to].x}
              y2={points[to].y}
              stroke={colors.line}
              strokeWidth={1}
            />
          ))}

          {/* Paquetes: un cuadradito lima recorriendo su enlace. */}
          {PACKETS.map((packet, i) => {
            const [from, to] = EDGES[packet.edge];
            const progress = (t * packet.speed + packet.offset) % 1;
            const x = points[from].x + (points[to].x - points[from].x) * progress;
            const y = points[from].y + (points[to].y - points[from].y) * progress;

            // Se atenúa en las puntas para que no aparezca ni desaparezca de golpe.
            const taper = Math.sin(progress * Math.PI);
            const size = Math.max(3, 8 * scale);

            return (
              <rect
                key={`packet-${i}`}
                x={x - size / 2}
                y={y - size / 2}
                width={size}
                height={size}
                fill={colors.draft}
                opacity={0.85 * taper}
              />
            );
          })}

          {/* Nodos: cuadrado wireframe rotando sobre su centro. */}
          {points.map((point, i) => {
            const node = NODES[i];
            const spin = (t + node.phase) * 360; // una vuelta entera por loop
            const isHub = i === 0;

            // Con `scale` chico los trazos caerían por debajo de 1px y se
            // borrarían al rasterizar, así que tienen piso.
            const size = Math.max(7, node.size * scale);
            const halo = Math.max(4, 10 * scale);

            return (
              <g
                key={`node-${i}`}
                transform={`translate(${point.x} ${point.y}) rotate(${spin})`}
              >
                <rect
                  x={-size / 2}
                  y={-size / 2}
                  width={size}
                  height={size}
                  fill="none"
                  stroke={isHub ? colors.draft : colors.chalkFaint}
                  strokeWidth={isHub ? Math.max(1.2, 1.6 * scale) : 1}
                  opacity={isHub ? 0.9 : 0.65}
                />
                {isHub ? (
                  <rect
                    x={-size / 2 - halo}
                    y={-size / 2 - halo}
                    width={size + halo * 2}
                    height={size + halo * 2}
                    fill="none"
                    stroke={rgba(accents.teal, 0.35)}
                    strokeWidth={1}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
