import { nav, stack } from '../content'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function Stack() {
  return (
    <section id="stack" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHead index={nav[2].index} eyebrow={stack.eyebrow} title={stack.title} />

      <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
        {stack.groups.map((group, i) => (
          <Reveal key={group.title} delay={0.05 * i} className="bg-ink-800">
            <div className="h-full p-6 sm:p-8">
              <h3 className="tag text-draft">{group.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line px-3 py-1.5 font-mono text-xs text-chalk-dim transition-colors hover:border-draft/50 hover:text-chalk"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
