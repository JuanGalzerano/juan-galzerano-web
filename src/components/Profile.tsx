import { nav, profile } from '../content'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function Profile() {
  return (
    <section id="perfil" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHead index={nav[0].index} eyebrow={profile.eyebrow} title={profile.title} />

      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <Reveal delay={0.05}>
          <p className="text-lg leading-relaxed text-chalk-dim">{profile.intro}</p>
          <p className="mt-6 border-l-2 border-draft pl-5 font-display text-xl leading-snug text-chalk italic sm:text-2xl">
            {profile.statement}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="border-t border-line">
            {profile.facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
                <dt className="tag text-chalk-faint">{fact.label}</dt>
                <dd className="text-right font-mono text-sm text-chalk">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
