import { useEffect, useRef, useState } from 'react'

type Options = {
  /**
   * Reproducir sólo mientras el elemento está en viewport. Para clips pesados,
   * que además así no se descargan hasta que hacen falta. Los clips livianos
   * corren siempre y evitan el parpadeo de arranque al entrar en pantalla.
   */
  playOnlyInView?: boolean
}

/**
 * Video ambiente: sin controles, sin audio, en bucle.
 *
 * Resuelve dos cosas que rompen este tipo de video en la práctica:
 *
 * 1. Los navegadores suspenden la reproducción cuando la pestaña deja de estar
 *    visible y al volver no siempre la reanudan solos: el video queda congelado
 *    y parece roto. Acá se escucha `visibilitychange` y se vuelve a pedir play().
 *
 * 2. Apenas se pide play(), el navegador reemplaza el `poster` por el frame
 *    actual — que es el 0. Si el clip abre con un fundido, ese frame es negro, y
 *    si la reproducción no llega a arrancar queda un rectángulo negro para
 *    siempre. Por eso `started` no se marca hasta que el tiempo avanza de
 *    verdad: hasta entonces conviene tapar el video con el poster.
 *
 * Respeta `prefers-reduced-motion`: no reproduce y `started` queda en false.
 */
export function useAmbientVideo({ playOnlyInView = false }: Options = {}) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    // play() rechaza si el navegador bloquea el autoplay. Sin audio no debería,
    // pero si pasa queda el poster y no hay que romper nada.
    const play = () => {
      void el.play().catch(() => undefined)
    }

    // Un frame decodificado y tiempo que corre: recién ahí el video tapa al
    // poster sin dejar un hueco negro.
    const onTimeUpdate = () => {
      if (el.currentTime > 0.15) setStarted(true)
    }

    const onVisibilityChange = () => {
      if (!document.hidden) play()
    }

    el.addEventListener('timeupdate', onTimeUpdate)
    document.addEventListener('visibilitychange', onVisibilityChange)

    let observer: IntersectionObserver | undefined

    if (playOnlyInView && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) play()
          else el.pause()
        },
        { threshold: 0.2 },
      )
      observer.observe(el)
    } else {
      play()
    }

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer?.disconnect()
    }
  }, [playOnlyInView])

  return { ref, started }
}
