import { motion } from 'framer-motion'
import { ArrowDown, MapPin } from 'lucide-react'
import { HeroScene } from './HeroScene'
import { site, terminal } from '../content'

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero() {
  return (
    <section id="top" className="relative px-5 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-28">
      <HeroScene />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.p
          custom={0}
          variants={rise}
          initial="hidden"
          animate="show"
          className="tag flex items-center gap-3 text-chalk-faint"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-draft" />
          {site.status}
        </motion.p>

        <motion.h1
          custom={1}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-7 font-display text-[clamp(2.75rem,10vw,7.5rem)] leading-[0.88] tracking-tight text-chalk"
        >
          Juan Ignacio
          <br />
          <span className="italic text-draft">Galzerano</span>
        </motion.h1>

        <motion.div
          custom={2}
          variants={rise}
          initial="hidden"
          animate="show"
          className="mt-9 grid gap-10 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-chalk-dim sm:text-xl">
              {site.role}. {site.tagline}
            </p>
            <p className="tag mt-5 flex items-center gap-2 text-chalk-faint">
              <MapPin size={13} /> {site.location}
            </p>
          </div>

          <a
            href="#proyectos"
            className="tag group inline-flex w-fit items-center gap-3 border border-line px-5 py-3 text-chalk transition-colors hover:border-draft hover:text-draft"
          >
            Ver proyectos
            <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </motion.div>

        {/* Ficha técnica en formato terminal */}
        <motion.div
          custom={3}
          variants={rise}
          initial="hidden"
          animate="show"
          className="ticked mt-14 border border-line bg-ink-900/60 p-5 font-mono text-sm sm:p-7"
        >
          {terminal.map((line, i) => (
            <div key={line.command} className={i > 0 ? 'mt-4' : ''}>
              <p className="text-chalk">
                <span className="text-draft">juan@utn</span>
                <span className="text-chalk-faint">:~$</span> {line.command}
              </p>
              <p className="mt-1 pl-4 text-chalk-dim">{line.output}</p>
            </div>
          ))}
          <p className="mt-4 text-chalk">
            <span className="text-draft">juan@utn</span>
            <span className="text-chalk-faint">:~$</span>{' '}
            <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-draft" />
          </p>
        </motion.div>
      </div>
    </section>
  )
}
