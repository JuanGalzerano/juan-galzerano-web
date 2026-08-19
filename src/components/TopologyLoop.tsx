import { useEffect, useRef } from 'react'

/**
 * Topología del kernel: nodos wireframe, enlaces y paquetes viajando, con
 * anillos concéntricos de fondo. Es la viñeta que acompaña al resumen del
 * proyecto en la card.
 *
 * Va en SVG animado por requestAnimationFrame y no en video. Un video de 300px
 * decorativo depende de que el navegador acepte reproducirlo — política de
 * autoplay, suspensión en pestañas ocultas, códec disponible — y cuando algo de
 * eso falla queda un rectángulo congelado. Esto son 2 KB de JS que siempre se
 * mueven.
 *
 * El ciclo dura CYCLE_MS y cierra sin costura: todo se expresa en función de
 * `t ∈ [0,1)` con senos de `TAU * t` o módulos de multiplicador entero, así el
 * último instante empalma con el primero.
 */

const TAU = Math.PI * 2
const CYCLE_MS = 12_000

const VIEW = { w: 720, h: 540 }
const CENTER = { x: VIEW.w / 2, y: VIEW.h * 0.46 }

/** Escala respecto del diseño original, pensado sobre un lienzo de 1920x1080. */
const SCALE = 0.7125

type Node = {
  radius: number
  angle: number
  size: number
  orbit: number
  phase: number
}

const NODES: Node[] = [
  { radius: 0, angle: 0, size: 26, orbit: 6, phase: 0 },
  { radius: 300, angle: -90, size: 16, orbit: 14, phase: 0.1 },
  { radius: 360, angle: -25, size: 12, orbit: 18, phase: 0.35 },
  { radius: 330, angle: 40, size: 14, orbit: 12, phase: 0.6 },
  { radius: 390, angle: 128, size: 11, orbit: 20, phase: 0.2 },
  { radius: 300, angle: 196, size: 15, orbit: 15, phase: 0.8 },
  { radius: 420, angle: 245, size: 10, orbit: 16, phase: 0.45 },
]

/** Enlaces por índice de nodo. El 0 es el centro y concentra la mayoría. */
const EDGES: [number, number][] = [
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
]

/** `speed` entero: cuántas vueltas completas da el paquete en un ciclo. */
const PACKETS = [
  { edge: 0, speed: 2, offset: 0 },
  { edge: 1, speed: 1, offset: 0.4 },
  { edge: 3, speed: 2, offset: 0.15 },
  { edge: 4, speed: 1, offset: 0.7 },
  { edge: 6, speed: 3, offset: 0.25 },
  { edge: 8, speed: 2, offset: 0.55 },
]

const RINGS = [0, 1, 2]

function pointAt(node: Node, t: number) {
  const breathe = Math.sin(TAU * (t + node.phase))
  const rad = ((node.angle + breathe * 2) * Math.PI) / 180
  const r = (node.radius + breathe * node.orbit) * SCALE

  return {
    x: CENTER.x + Math.cos(rad) * r,
    // Achatado en vertical: da sensación de perspectiva sin 3D real.
    y: CENTER.y + Math.sin(rad) * r * 0.72,
  }
}

export function TopologyLoop({ className }: { className?: string }) {
  const nodeRefs = useRef<(SVGGElement | null)[]>([])
  const edgeRefs = useRef<(SVGLineElement | null)[]>([])
  const packetRefs = useRef<(SVGRectElement | null)[]>([])
  const ringRefs = useRef<(SVGCircleElement | null)[]>([])

  useEffect(() => {
    // Se dibuja el frame inicial siempre, así que con movimiento reducido queda
    // la topología quieta en vez de un hueco vacío.
    const draw = (t: number) => {
      const points = NODES.map((node) => pointAt(node, t))

      points.forEach((point, i) => {
        const spin = (t + NODES[i].phase) * 360
        nodeRefs.current[i]?.setAttribute(
          'transform',
          `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${spin.toFixed(2)})`,
        )
      })

      EDGES.forEach(([from, to], i) => {
        const line = edgeRefs.current[i]
        if (!line) return
        line.setAttribute('x1', points[from].x.toFixed(2))
        line.setAttribute('y1', points[from].y.toFixed(2))
        line.setAttribute('x2', points[to].x.toFixed(2))
        line.setAttribute('y2', points[to].y.toFixed(2))
      })

      PACKETS.forEach((packet, i) => {
        const rect = packetRefs.current[i]
        if (!rect) return
        const [from, to] = EDGES[packet.edge]
        const progress = (t * packet.speed + packet.offset) % 1
        const x = points[from].x + (points[to].x - points[from].x) * progress
        const y = points[from].y + (points[to].y - points[from].y) * progress

        rect.setAttribute('x', (x - 3).toFixed(2))
        rect.setAttribute('y', (y - 3).toFixed(2))
        // Se atenúa en las puntas para que no aparezca ni desaparezca de golpe.
        rect.setAttribute('opacity', (0.85 * Math.sin(progress * Math.PI)).toFixed(3))
      })

      RINGS.forEach((_, i) => {
        const circle = ringRefs.current[i]
        if (!circle) return
        const pulse = (t * 2 + i / 3) % 1
        circle.setAttribute('r', ((90 + pulse * 340) * SCALE).toFixed(2))
        circle.setAttribute('stroke-opacity', (0.22 * (1 - pulse)).toFixed(3))
      })
    }

    draw(0)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      draw(((now - start) % CYCLE_MS) / CYCLE_MS)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      aria-hidden="true"
      focusable="false"
    >
      {RINGS.map((i) => (
        <circle
          key={`ring-${i}`}
          ref={(el) => {
            ringRefs.current[i] = el
          }}
          cx={CENTER.x}
          cy={CENTER.y}
          fill="none"
          stroke="#62dfd2"
          strokeWidth={1.2}
        />
      ))}

      {EDGES.map(([from, to], i) => (
        <line
          key={`edge-${from}-${to}`}
          ref={(el) => {
            edgeRefs.current[i] = el
          }}
          stroke="var(--color-line)"
          strokeWidth={1}
        />
      ))}

      {PACKETS.map((_, i) => (
        <rect
          key={`packet-${i}`}
          ref={(el) => {
            packetRefs.current[i] = el
          }}
          width={6}
          height={6}
          fill="var(--color-draft)"
        />
      ))}

      {NODES.map((node, i) => {
        const size = Math.max(7, node.size * SCALE)
        const isHub = i === 0

        return (
          <g
            key={`node-${i}`}
            ref={(el) => {
              nodeRefs.current[i] = el
            }}
          >
            <rect
              x={-size / 2}
              y={-size / 2}
              width={size}
              height={size}
              fill="none"
              stroke={isHub ? 'var(--color-draft)' : 'var(--color-chalk-faint)'}
              strokeWidth={isHub ? 1.6 : 1}
              opacity={isHub ? 0.9 : 0.65}
            />
            {isHub && (
              <rect
                x={-size / 2 - 7}
                y={-size / 2 - 7}
                width={size + 14}
                height={size + 14}
                fill="none"
                stroke="#62dfd2"
                strokeOpacity={0.35}
                strokeWidth={1}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}
