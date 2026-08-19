import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import { nav, projects, site, type Project } from '../content'
import { useAmbientVideo } from '../useAmbientVideo'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

function LangDot({ color }: { color: string }) {
  return <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
}

/**
 * Bucle ambiente que llena el hueco al costado del resumen. No explica nada por
 * sí solo: es una viñeta en movimiento con la topología del proyecto.
 *
 * `mix-blend-mode: screen` sobre el negro del video: el negro es neutro bajo ese
 * blend, así que sólo se suman los trazos y el recuadro toma el fondo de la card
 * en vez de plantarle un rectángulo negro encima.
 *
 * Sólo en `lg` para arriba, que es donde existe el hueco; abajo de eso la card
 * es de una sola columna y meterlo apilaría por apilar.
 */
function ProjectLoop({ loop }: { loop: NonNullable<Project['loop']> }) {
  const { ref, started } = useAmbientVideo()

  return (
    <div className="ticked relative hidden border border-line lg:block">
      <video
        ref={ref}
        className="block w-full [mix-blend-mode:screen]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={loop.poster}
        aria-label={loop.alt}
      >
        <source src={loop.webm} type="video/webm" />
        <source src={loop.mp4} type="video/mp4" />
      </video>

      {/* Ver la nota en useAmbientVideo: el navegador tira el poster apenas se
          pide play(), aunque todavía no haya decodificado nada. Este overlay lo
          sostiene hasta que el tiempo corre de verdad. */}
      {started ? null : (
        <img
          src={loop.poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full [mix-blend-mode:screen]"
        />
      )}
    </div>
  )
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer noopener"
      className="ticked group block border border-line bg-ink-700/50 p-6 transition-colors hover:border-draft/60 sm:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="tag flex items-center gap-2 text-chalk-faint">
          <LangDot color={project.languageColor} />
          {project.language}
          <span className="text-line">/</span>
          {project.repo}
        </span>
        <span className="tag flex items-center gap-1.5 text-draft opacity-0 transition-opacity group-hover:opacity-100">
          Abrir repo <ArrowUpRight size={13} />
        </span>
      </div>

      {/* Dos columnas en desktop: el texto no llega al borde derecho y ese hueco
          lo ocupa el bucle. Sin bucle, el resumen se limita solo con max-w-2xl. */}
      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <h3 className="font-display text-3xl leading-tight text-chalk sm:text-4xl">{project.name}</h3>
          <p className={`mt-4 leading-relaxed text-chalk-dim ${project.loop ? '' : 'max-w-2xl'}`}>
            {project.summary}
          </p>
        </div>
        {project.loop ? <ProjectLoop loop={project.loop} /> : null}
      </div>

      {project.detail && (
        <dl className="mt-7 grid gap-px border border-line bg-line sm:grid-cols-2">
          {project.detail.map((row) => (
            <div key={row.label} className="bg-ink-800 p-4">
              <dt className="tag text-draft">{row.label}</dt>
              <dd className="mt-1.5 font-mono text-xs leading-relaxed text-chalk-dim">{row.value}</dd>
            </div>
          ))}
          {/* Con una cantidad impar de filas el grid deja un hueco: lo rellenamos. */}
          {project.detail.length % 2 === 1 && <div aria-hidden className="hidden bg-ink-800 sm:block" />}
        </dl>
      )}

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="tag border border-line px-2.5 py-1 text-chalk-dim">
            {tag}
          </li>
        ))}
      </ul>
    </a>
  )
}

/**
 * Explainer del proyecto, renderizado con Remotion (ver `remotion/`).
 *
 * No es un reproductor: no lleva controles ni barra de progreso. Se comporta
 * como una pieza más de la página — un bucle que corre solo mientras está a la
 * vista y se frena cuando no. Sin audio, así que no hay nada que silenciar.
 *
 * Va como hermano de la card y no adentro: `FeaturedCard` es un `<a>` entero y
 * cualquier click ahí dentro navegaría al repo.
 *
 * `preload="none"`: los 2,1 MB del .webm no se bajan hasta que el bloque entra
 * en viewport y `play()` dispara la carga. Quien pasa de largo baja sólo el JPEG.
 */
function ProjectVideo({ video }: { video: NonNullable<Project['video']> }) {
  // Pesa 2,1 MB: sólo corre (y sólo se descarga) cuando está a la vista.
  const { ref, started } = useAmbientVideo({ playOnlyInView: true })
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  return (
    <figure className="ticked mt-px border border-line bg-ink-800 p-4 sm:p-6">
      {reduced ? (
        <img src={video.poster} alt={video.caption} className="w-full border border-line" />
      ) : (
        <div className="relative">
          <video
            ref={ref}
            className="block w-full border border-line"
            muted
            loop
            playsInline
            preload="none"
            poster={video.poster}
            aria-label={video.caption}
          >
            <source src={video.webm} type="video/webm" />
            <source src={video.mp4} type="video/mp4" />
          </video>

          {/* El clip abre con un fundido, así que su frame 0 es casi negro. Sin
              este overlay, pedir play() cambia el poster por ese negro y, si la
              reproducción no arranca, queda un rectángulo vacío. */}
          {started ? null : (
            <img
              src={video.poster}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full border border-line"
            />
          )}
        </div>
      )}
      <figcaption className="tag mt-4 text-chalk-faint">{video.caption}</figcaption>
    </figure>
  )
}

function CompactCard({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex h-full flex-col border border-line p-6 transition-colors hover:border-draft/60 hover:bg-ink-700/40"
    >
      <span className="tag flex items-center gap-2 text-chalk-faint">
        <LangDot color={project.languageColor} />
        {project.language}
      </span>
      <h3 className="mt-4 font-display text-2xl leading-tight text-chalk transition-colors group-hover:text-draft">
        {project.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-chalk-dim">{project.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="tag border border-line px-2 py-0.5 text-chalk-faint">
            {tag}
          </li>
        ))}
      </ul>
      <span className="tag mt-5 flex items-center gap-1.5 text-chalk-faint transition-colors group-hover:text-draft">
        {project.repo} <ArrowUpRight size={13} />
      </span>
    </a>
  )
}

export function Projects() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="proyectos" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHead index={nav[1].index} eyebrow="Proyectos" title="Lo que construí" />

      <div className="mt-12 space-y-6">
        {featured.map((project, i) => (
          <Reveal key={project.repo} delay={0.05 * i}>
            <FeaturedCard project={project} />
            {project.video ? <ProjectVideo video={project.video} /> : null}
          </Reveal>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => (
            <Reveal key={project.repo} delay={0.05 * i}>
              <CompactCard project={project} />
            </Reveal>
          ))}
        </div>
      )}

      <Reveal delay={0.1}>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer noopener"
          className="tag mt-10 inline-flex items-center gap-2.5 border border-line px-5 py-3 text-chalk transition-colors hover:border-draft hover:text-draft"
        >
          <GithubIcon size={15} /> Todos los repos en GitHub
        </a>
      </Reveal>
    </section>
  )
}
