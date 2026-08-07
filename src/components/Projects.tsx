import { ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import { nav, projects, site, type Project } from '../content'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

function LangDot({ color }: { color: string }) {
  return <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
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

      <h3 className="mt-5 font-display text-3xl leading-tight text-chalk sm:text-4xl">{project.name}</h3>
      <p className="mt-4 max-w-2xl leading-relaxed text-chalk-dim">{project.summary}</p>

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
