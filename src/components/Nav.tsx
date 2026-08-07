import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { nav, site } from '../content'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>(nav[0].id)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Marca la sección visible más cercana al tope del viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-ink-800/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-baseline gap-2">
          <span className="font-display text-xl text-chalk">JG</span>
          <span className="tag text-chalk-faint transition-colors group-hover:text-draft">
            {site.githubUser}
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`tag transition-colors ${
                active === item.id ? 'text-draft' : 'text-chalk-dim hover:text-chalk'
              }`}
            >
              <span className="text-chalk-faint">{item.index}</span> {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="p-2 text-chalk-dim transition-colors hover:text-draft"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="p-2 text-chalk-dim transition-colors hover:text-draft"
          >
            <LinkedinIcon size={18} />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            className="p-2 text-chalk-dim transition-colors hover:text-draft md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-ink-800/95 px-5 pb-5 backdrop-blur-md md:hidden">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="tag block border-b border-line py-3 text-chalk-dim last:border-0"
            >
              <span className="text-chalk-faint">{item.index}</span> {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
