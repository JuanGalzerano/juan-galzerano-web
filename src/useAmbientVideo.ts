import { useEffect, useRef } from 'react'

/**
 * Video ambiente: sin controles, sin audio, en bucle, con `autoplay` nativo.
 *
 * Lo único que agrega este hook es reanudar la reproducción cuando la pestaña
 * vuelve a estar visible. Los navegadores suspenden el video de una pestaña
 * oculta y al volver no siempre lo retoman solos: queda congelado en el frame
 * donde estaba y parece roto.
 *
 * Todo lo demás lo hace el atributo `autoplay` del elemento. No se gatea la
 * reproducción con IntersectionObserver ni se tapa con un poster: cada capa de
 * más es una forma nueva de que el video termine quieto.
 */
export function useAmbientVideo() {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const onVisibilityChange = () => {
      // play() rechaza si el navegador bloquea el autoplay. Sin audio no
      // debería, y si pasa queda el poster: no hay nada que romper.
      if (!document.hidden) void el.play().catch(() => undefined)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return ref
}
