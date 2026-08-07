import { useEffect } from 'react'

/**
 * Hace que el fondo reaccione al mouse: escribe la posición del puntero en
 * variables CSS del :root y las capas del fondo (halos, grilla, spotlight)
 * se desplazan con un lerp suave.
 *
 * No renderiza nada: sólo el <div className="spotlight" /> que vive en App.
 */
export function Backdrop() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || calm.matches) return

    const root = document.documentElement
    // target = a dónde apunta el mouse, current = dónde está el fondo ahora.
    let targetX = 0.5
    let targetY = 0.5
    let currentX = 0.5
    let currentY = 0.5
    let frame = 0

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth
      targetY = e.clientY / window.innerHeight
    }

    const tick = () => {
      // Lerp: el fondo persigue al cursor con retraso, nunca lo sigue clavado.
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06

      const maxShift = 26 // px de parallax máximo
      root.style.setProperty('--px', `${(currentX - 0.5) * maxShift}px`)
      root.style.setProperty('--py', `${(currentY - 0.5) * maxShift}px`)
      root.style.setProperty('--mx', `${currentX * 100}%`)
      root.style.setProperty('--my', `${currentY * 100}%`)

      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
