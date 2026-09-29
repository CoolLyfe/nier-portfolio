import { useEffect, useState } from 'react'
import { identity, type SectionId } from '../data/profile'

export const SECTIONS: { id: SectionId; label: string; sub: string }[] = [
  { id: 'system', label: 'SYSTEM', sub: 'Identité' },
  { id: 'intel', label: 'INTEL', sub: 'Projets' },
  { id: 'logs', label: 'LOGS', sub: 'Parcours & compétences' },
  { id: 'comms', label: 'COMMS', sub: 'Contact' },
]

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now.toLocaleTimeString('fr-FR', { hour12: false })
}

/** Top bar: unit id, clock and the four category tabs. */
export function Header({
  active,
  onSelect,
}: {
  active: SectionId | null
  onSelect: (id: SectionId | null) => void
}) {
  const clock = useClock()
  return (
    <header className="border-b border-line">
      <div className="flex items-center justify-between gap-4 px-4 py-2 font-display text-[11px] tracking-[0.2em] text-ash uppercase sm:px-8">
        <button type="button" onClick={() => onSelect(null)} className="hover:text-bone">
          {identity.name}
          <span className="max-sm:hidden"> // {identity.unit}</span>
        </button>
        <span className="tabular-nums">{clock}</span>
      </div>
      <nav aria-label="Sections" className="grid grid-cols-4 border-t border-line/60 sm:flex sm:px-6">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-current={active === s.id}
            onClick={() => onSelect(s.id)}
            className="nier-item justify-center px-1! py-3! font-display text-xs tracking-[0.15em] before:hidden! sm:w-auto! sm:justify-start sm:px-4! sm:text-sm sm:tracking-[0.25em]"
          >
            <span className="text-[10px] opacity-60 max-sm:hidden">{i + 1}</span>
            {s.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

/** Bottom bar: key hints + effect toggles. */
export function StatusBar({
  scanlines,
  setScanlines,
  sound,
  setSound,
}: {
  scanlines: boolean
  setScanlines: (v: boolean) => void
  sound: boolean
  setSound: (v: boolean) => void
}) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-4 py-2 font-display text-[11px] tracking-[0.18em] text-ash uppercase sm:px-8">
      <div className="hidden gap-5 md:flex">
        <span>[1–4] Section</span>
        <span>[↑↓] Sélection</span>
        <span>[Échap] Retour</span>
      </div>
      <div className="flex gap-4">
        <Toggle label="Scanlines" on={scanlines} set={setScanlines} />
        <Toggle label="Son" on={sound} set={setSound} />
      </div>
    </footer>
  )
}

/** NieR-style checkbox: empty square / filled square. */
function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => set(!on)}
      className="flex items-center gap-2 hover:text-bone"
    >
      <span className="grid h-3 w-3 place-items-center border border-current">
        {on && <span className="h-1.5 w-1.5 bg-current" />}
      </span>
      {label}
    </button>
  )
}
