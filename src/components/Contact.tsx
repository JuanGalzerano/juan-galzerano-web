import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Mail, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { contact, nav, site } from '../content'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

const links = [
  { label: 'GitHub', value: site.githubUser, href: site.github, icon: GithubIcon },
  { label: 'LinkedIn', value: 'juan-ignacio-galzerano', href: site.linkedin, icon: LinkedinIcon },
  { label: 'Teléfono', value: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, '')}`, icon: Phone },
]

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Sin permiso de portapapeles: el mailto de al lado sigue funcionando.
    }
  }

  return (
    <section id="contacto" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <SectionHead index={nav[5].index} eyebrow={contact.eyebrow} title={contact.title} />

      <Reveal delay={0.05}>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-chalk-dim">{contact.text}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-3 border border-draft bg-draft px-6 py-4 font-mono text-sm text-ink-900 transition-colors hover:bg-transparent hover:text-draft"
          >
            <Mail size={16} />
            {site.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="tag inline-flex items-center gap-2 border border-line px-5 py-4 text-chalk-dim transition-colors hover:border-draft hover:text-draft"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copiado' : 'Copiar mail'}
          </button>
        </div>

        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3">
          {links.map(({ label, value, href, icon: Icon }) => (
            <li key={label} className="bg-ink-800">
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer noopener"
                className="group flex h-full items-center justify-between gap-4 p-6 transition-colors hover:bg-ink-700/60"
              >
                <span>
                  <span className="tag block text-chalk-faint">{label}</span>
                  <span className="mt-1.5 block font-mono text-sm text-chalk">{value}</span>
                </span>
                <span className="flex items-center gap-1 text-chalk-faint transition-colors group-hover:text-draft">
                  <Icon size={16} />
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
