import { useEffect, useState } from 'react'
import { SECTIONS } from '../components/Chrome'
import { Frame, Txt } from '../components/ui'
import { about, identity, projects, type SectionId } from '../data/profile'

/** Landing screen: the pause menu. */
export function Dashboard({
  onOpen,
  blip,
}: {
  onOpen: (id: SectionId) => void
  blip: (k?: 'move' | 'select' | 'back') => void
}) {
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor((c) => (c + (e.key === 'ArrowDown' ? 1 : -1) + SECTIONS.length) % SECTIONS.length)
        blip('move')
      } else if (e.key === 'Enter') {
        blip('select')
        onOpen(SECTIONS[cursor].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cursor, onOpen, blip])

  const previews: Record<SectionId, string> = {
    system: 'Présentation, motivations et objectifs de ce portfolio.',
    intel: `${projects.length} projets documentés : contexte, rôle, résultats, preuves.`,
    logs: 'Parcours académique, expériences, compétences et bilan personnel.',
    comms: 'Ouvrir un canal de transmission.',
  }

  return (
    <div className="boot-in grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <p className="font-display text-xs tracking-[0.3em] text-ash uppercase">{identity.unit}</p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-[0.08em] sm:text-7xl">
          {identity.name.split(' ')[0].toUpperCase()}
          <br />
          <span className="text-ash">{identity.name.split(' ').slice(1).join(' ').toUpperCase()}</span>
        </h1>
        <p className="caret mt-5 text-ash">{identity.role}</p>

        <ul role="menu" className="mt-10 space-y-1 pl-5">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                role="menuitem"
                aria-current={i === cursor}
                onMouseEnter={() => {
                  if (i !== cursor) blip('move')
                  setCursor(i)
                }}
                onFocus={() => setCursor(i)}
                onClick={() => {
                  blip('select')
                  onOpen(s.id)
                }}
                className="nier-item py-3!"
              >
                <span className="nier-square" />
                <span className="flex-1 font-display text-lg tracking-[0.25em]">{s.label}</span>
                <span className="font-display text-xs tracking-wider opacity-60">{s.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6 self-end">
        <Frame label={`${SECTIONS[cursor].label} // aperçu`}>
          <p key={cursor} className="boot-in min-h-[3rem]">
            {previews[SECTIONS[cursor].id]}
          </p>
        </Frame>
        <Frame label="Statut de l'unité">
          <dl className="grid grid-cols-2 gap-4 font-display text-sm">
            <div>
              <dt className="text-xs tracking-[0.2em] text-ash">CURSUS</dt>
              <dd>{identity.status}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.2em] text-ash">LOCALISATION</dt>
              <dd>
                <Txt>{identity.location}</Txt>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs tracking-[0.2em] text-ash">MISSION</dt>
              <dd className="font-mono text-sm font-light">{about.intro[1]}</dd>
            </div>
          </dl>
        </Frame>
      </div>
    </div>
  )
}
