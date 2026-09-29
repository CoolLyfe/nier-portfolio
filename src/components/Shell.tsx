import { useEffect, useState } from 'react'
import { identity, type SectionId } from '../data/profile'
import { useUi } from './ui'

export const SECTIONS: { id: SectionId; label: string; sub: string; desc: string }[] = [
  { id: 'system', label: 'SYSTEM', sub: 'ABOUT', desc: 'Identité, motivation, langues et centres d’intérêt.' },
  { id: 'intel', label: 'INTEL', sub: 'PROJECTS', desc: 'Archives des projets réalisés. Sélectionner une fenêtre pour l’ouvrir.' },
  { id: 'logs', label: 'LOGS', sub: 'EXPERIENCE', desc: 'Parcours académique, expériences, compétences et bilan.' },
  { id: 'comms', label: 'COMMS', sub: 'CONTACT', desc: 'Ouvrir un canal de transmission.' },
]

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

/** Top of screen: OS watermark row, big category title, tab bar. */
export function TopBar({
  active,
  onSelect,
  hack,
  onHack,
}: {
  active: SectionId
  onSelect: (id: SectionId) => void
  hack: boolean
  onHack: () => void
}) {
  const { setDesc, blip } = useUi()
  const now = useClock()
  const idx = SECTIONS.findIndex((s) => s.id === active)
  const current = SECTIONS[idx]

  return (
    <header className="relative z-10 px-4 pt-3 sm:px-10">
      <div className="flex items-center justify-between gap-4 label">
        <span>{hack ? 'YORHA_OS v11.4 // ROOT ACCESS' : 'YORHA_OS v11.4'}</span>
        <span className="max-sm:hidden">
          UNIT: {identity.name.toUpperCase()} // {identity.unit}
        </span>
        <span className="tabular-nums">
          {now.toLocaleDateString('fr-FR')} {now.toLocaleTimeString('fr-FR', { hour12: false })}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-end gap-4">
            <h1 key={active} className="boot-in glitch-text font-display text-5xl leading-none tracking-[0.12em] sm:text-6xl">
              {current.label}
            </h1>
            <div className="mb-1.5 flex gap-1">
              <span className="h-2 w-2 bg-fg" />
              <span className="h-2 w-2 bg-fg/50" />
              <span className="h-2 w-2 bg-fg/25" />
            </div>
          </div>
          <p className="label mt-2">
            SYS_CFG // {String(idx + 1).padStart(2, '0')} — {current.sub}
          </p>
        </div>

        <button
          type="button"
          onClick={onHack}
          onMouseEnter={() => setDesc(hack ? 'Rétablir l’interface système standard.' : 'Forcer l’accès au terminal. Touche [ ` ].')}
          className={`border px-3 py-2 font-display text-xs tracking-[0.2em] uppercase ${
            hack ? 'border-accent bg-accent text-bg' : 'border-line text-dim hover:border-fg hover:text-fg'
          }`}
        >
          {hack ? '> exit --override' : '> sudo hack --override'}
        </button>
      </div>

      <nav aria-label="Catégories" className="mt-5 grid grid-cols-4 gap-1.5 sm:flex sm:gap-2">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-current={s.id === active}
            onMouseEnter={() => setDesc(s.desc)}
            onClick={() => {
              blip('select')
              onSelect(s.id)
            }}
            className="tab max-sm:px-1! max-sm:text-xs max-sm:tracking-[0.12em] sm:min-w-36"
          >
            <span className="mr-2 text-[10px] opacity-60 max-sm:hidden">{i + 1}</span>
            {s.label}
          </button>
        ))}
      </nav>
      <div className="mt-2 h-px bg-line" />
    </header>
  )
}

/** Bottom: description strip + key hints + toggles. */
export function BottomBar({
  desc,
  crt,
  setCrt,
  sound,
  setSound,
}: {
  desc: string
  crt: boolean
  setCrt: (v: boolean) => void
  sound: boolean
  setSound: (v: boolean) => void
}) {
  return (
    <footer className="sticky bottom-0 z-20 bg-bg/95 px-4 pb-2 backdrop-blur-sm sm:px-10">
      <div className="h-px bg-line" />
      <div className="flex min-h-11 items-center gap-3 py-2">
        <span className="h-2 w-2 flex-none bg-beige" />
        <p key={desc} className="boot-in text-sm text-beige">
          {desc}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line/60 pt-1.5 label">
        <div className="flex gap-5 max-md:hidden">
          <span>[1–4 / Q E] Catégorie</span>
          <span>[↑↓] Sélection</span>
          <span>[Entrée] Ouvrir</span>
          <span>[Échap] Fermer</span>
        </div>
        <div className="flex gap-5">
          <Toggle label="CRT" on={crt} set={setCrt} />
          <Toggle label="Son" on={sound} set={setSound} />
        </div>
      </div>
    </footer>
  )
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className="flex items-center gap-2 hover:text-fg">
      <span className="grid h-3 w-3 place-items-center border border-current">{on && <span className="h-1.5 w-1.5 bg-current" />}</span>
      {label}
    </button>
  )
}

/** Fixed technical watermarks around the viewport edges (decorative). */
export function Watermarks({ section }: { section: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 max-md:hidden">
      <span className="label absolute top-1/2 right-3 origin-right -translate-y-1/2 rotate-90 opacity-50">
        SYS_CFG // 0{section + 1} ::: MEM 0x7F3A-{(section + 1) * 1137}
      </span>
      <span className="label absolute top-1/2 left-3 origin-left translate-y-1/2 -rotate-90 opacity-50">
        43.6047N // 1.4442E — TOULOUSE_NODE
      </span>
    </div>
  )
}
