import { GraduationCap, Languages, ScrollText } from 'lucide-react'
import { education, nav } from '../content'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function Education() {
  return (
    <section id="formacion" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHead index={nav[4].index} eyebrow={education.eyebrow} title={education.title} />

      <div className="mt-12 grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="ticked h-full border border-line bg-ink-700/40 p-7">
            <p className="tag flex items-center gap-2 text-draft">
              <GraduationCap size={14} /> Carrera
            </p>
            <h3 className="mt-4 font-display text-3xl leading-tight text-chalk">{education.degree.title}</h3>
            <p className="mt-3 text-chalk-dim">{education.degree.institution}</p>
            <p className="tag mt-4 text-chalk-faint">{education.degree.period}</p>
            <p className="mt-6 border-t border-line pt-4 font-mono text-sm text-chalk">{education.degree.detail}</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex h-full flex-col gap-6">
            <div className="border border-line p-7">
              <p className="tag flex items-center gap-2 text-draft">
                <ScrollText size={14} /> Cursos
              </p>
              <ul className="mt-4 space-y-4">
                {education.courses.map((course) => (
                  <li key={course.title} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <p className="text-chalk">{course.title}</p>
                    <p className="tag mt-1 text-chalk-faint">
                      {course.institution} · {course.date}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-line p-7">
              <p className="tag flex items-center gap-2 text-draft">
                <Languages size={14} /> Idiomas
              </p>
              <ul className="mt-4 space-y-2">
                {education.languages.map((lang) => (
                  <li key={lang.title} className="flex items-baseline justify-between gap-4">
                    <span className="text-chalk">{lang.title}</span>
                    <span className="font-mono text-sm text-chalk-dim">{lang.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
