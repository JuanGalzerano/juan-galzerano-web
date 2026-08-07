import { experience, nav } from '../content'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function Experience() {
  return (
    <section id="experiencia" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHead index={nav[3].index} eyebrow={experience.eyebrow} title={experience.title} />

      <div className="mt-12">
        {experience.items.map((item, i) => (
          <Reveal key={item.company} delay={0.05 * i}>
            <article className="grid gap-6 border-t border-line py-8 md:grid-cols-[220px_1fr] md:gap-12">
              <div>
                <p className="tag text-chalk-faint">{item.period}</p>
                <h3 className="mt-2 font-display text-2xl text-chalk">{item.company}</h3>
              </div>
              <div>
                <p className="tag text-draft">{item.role}</p>
                <ul className="mt-4 space-y-3">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 leading-relaxed text-chalk-dim">
                      <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-draft/60" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
