import { ArrowUp } from 'lucide-react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Profile } from './components/Profile'
import { Projects } from './components/Projects'
import { Stack } from './components/Stack'
import { Experience } from './components/Experience'
import { Education } from './components/Education'
import { Contact } from './components/Contact'
import { site } from './content'

export default function App() {
  return (
    <div className="grain relative min-h-screen">
      <div className="blueprint-grid" aria-hidden />

      <Nav />

      <main className="relative z-10">
        <Hero />
        <Profile />
        <Projects />
        <Stack />
        <Experience />
        <Education />
        <Contact />
      </main>

      <footer className="relative z-10 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="tag text-chalk-faint">
            {site.shortName} · {site.location}
          </p>
          <a href="#top" className="tag inline-flex items-center gap-2 text-chalk-dim transition-colors hover:text-draft">
            Volver arriba <ArrowUp size={13} />
          </a>
        </div>
      </footer>
    </div>
  )
}
