import { useCallback, useEffect, useState } from 'react'
import { Header, SECTIONS, StatusBar } from './components/Chrome'
import { projects, type SectionId } from './data/profile'
import { useBlip, usePersistentFlag } from './hooks/useSettings'
import { Comms } from './sections/Comms'
import { Dashboard } from './sections/Dashboard'
import { Intel } from './sections/Intel'
import { Logs } from './sections/Logs'
import { System } from './sections/System'

const readHash = (): SectionId | null => {
  const h = window.location.hash.slice(1)
  return SECTIONS.some((s) => s.id === h) ? (h as SectionId) : null
}

export default function App() {
  // Current section lives in the URL hash so each section is linkable (#intel…).
  const [section, setSection] = useState<SectionId | null>(readHash)
  const [projectIdx, setProjectIdx] = useState(0)
  const [scanlines, setScanlines] = usePersistentFlag('nier.scanlines', true)
  const [sound, setSound] = usePersistentFlag('nier.sound', false)
  const blip = useBlip(sound)

  const go = useCallback((id: SectionId | null) => {
    setSection(id)
    history.pushState(null, '', id ? `#${id}` : window.location.pathname)
    window.scrollTo({ top: 0 })
  }, [])

  // Browser back/forward
  useEffect(() => {
    const onPop = () => setSection(readHash())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Global keys: 1–4 jump to a section, Escape returns to the menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= SECTIONS.length) {
        blip('select')
        go(SECTIONS[n - 1].id)
      } else if (e.key === 'Escape' && section) {
        blip('back')
        go(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [section, go, blip])

  // A skill "proof" button opens the matching project in INTEL.
  const openProject = (id: string) => {
    setProjectIdx(Math.max(0, projects.findIndex((p) => p.id === id)))
    blip('select')
    go('intel')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {scanlines && <div className="scanlines" aria-hidden />}
      <Header active={section} onSelect={go} />

      <main key={section ?? 'home'} className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
        {section === null && <Dashboard onOpen={go} blip={blip} />}
        {section === 'system' && <System blip={blip} />}
        {section === 'intel' && <Intel selected={projectIdx} onSelect={setProjectIdx} blip={blip} />}
        {section === 'logs' && <Logs blip={blip} onProof={openProject} />}
        {section === 'comms' && <Comms blip={blip} />}
      </main>

      <StatusBar scanlines={scanlines} setScanlines={setScanlines} sound={sound} setSound={setSound} />
    </div>
  )
}
