import { useState } from 'react'
import { MenuDetail } from '../components/MenuDetail'
import { Frame, SectionTitle, SquareList, Txt } from '../components/ui'
import {
  education,
  experience,
  hardSkills,
  methodSkills,
  outlook,
  projects,
  selfAssessment,
  softSkills,
  type Skill,
  type TimelineEntry,
} from '../data/profile'

type Blip = (k?: 'move' | 'select' | 'back') => void

/** Vertical timeline with square nodes. */
function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative ml-1 border-l border-line">
      {entries.map((e) => (
        <li key={e.title} className="relative pb-7 pl-6 last:pb-0">
          <span className="absolute top-1.5 -left-[5px] h-[9px] w-[9px] border border-bone bg-ink" />
          <p className="font-display text-xs tracking-[0.2em] text-ash">
            <Txt>{e.period}</Txt>
          </p>
          <h3 className="mt-1 font-display text-lg tracking-wide">
            <Txt>{e.title}</Txt>
          </h3>
          <p className="mb-2 text-sm text-ash">
            <Txt>{e.place}</Txt>
          </p>
          {e.details.length > 0 && <SquareList items={e.details} />}
        </li>
      ))}
    </ol>
  )
}

/** Skill rows; each proof is a button that jumps to the project in INTEL. */
function SkillTable({ skills, onProof }: { skills: Skill[]; onProof: (id: string) => void }) {
  return (
    <div className="divide-y divide-line/60">
      {skills.map((s) => (
        <div key={s.name} className="grid gap-2 py-3 sm:grid-cols-[9rem_1fr]">
          <p className="font-display tracking-[0.12em]">{s.name}</p>
          <div>
            <p className="text-sm">{s.detail}</p>
            {s.proofs.length > 0 && (
              <p className="mt-1.5 flex flex-wrap items-center gap-2 font-display text-xs text-ash">
                PREUVES :
                {s.proofs.map((id) => {
                  const p = projects.find((pr) => pr.id === id)
                  return (
                    p && (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onProof(id)}
                        className="border border-line px-1.5 text-bone hover:bg-bone hover:text-ink"
                      >
                        {p.code} ▸
                      </button>
                    )
                  )
                })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/** LOGS — academic path, experience, skills, self-assessment, outlook. */
export function Logs({ blip, onProof }: { blip: Blip; onProof: (projectId: string) => void }) {
  const [sel, setSel] = useState(0)

  const entries = [
    { key: 'edu', label: 'FORMATION' },
    { key: 'exp', label: 'EXPÉRIENCE' },
    { key: 'hard', label: 'HARD SKILLS' },
    { key: 'soft', label: 'SOFT SKILLS' },
    { key: 'self', label: 'BILAN' },
    { key: 'next', label: 'PERSPECTIVES' },
  ]

  const panels = [
    <Frame key="edu" label="Parcours académique">
      <Timeline entries={education} />
    </Frame>,
    <Frame key="exp" label="Expériences professionnelles">
      <Timeline entries={experience} />
    </Frame>,
    <div key="hard" className="space-y-5">
      <Frame label="Compétences techniques">
        <SkillTable skills={hardSkills} onProof={onProof} />
      </Frame>
      <Frame label="Méthodologie">
        <SquareList items={methodSkills} />
      </Frame>
    </div>,
    <Frame key="soft" label="Compétences transversales">
      <SkillTable skills={softSkills} onProof={onProof} />
    </Frame>,
    <div key="self" className="grid gap-5 xl:grid-cols-2">
      <Frame label="Points forts">
        <SquareList items={selfAssessment.strengths} />
      </Frame>
      <Frame label="Axes d'amélioration">
        <SquareList items={selfAssessment.improvements} />
      </Frame>
    </div>,
    <Frame key="next" label="Ouverture">
      <p className="mb-2 font-display text-xs tracking-[0.2em] text-ash">DOMAINES D'INTÉRÊT</p>
      <SquareList items={outlook.interests} />
      <p className="mt-5 mb-2 font-display text-xs tracking-[0.2em] text-ash">SUITE DU PARCOURS</p>
      <p>
        <Txt>{outlook.next}</Txt>
      </p>
    </Frame>,
  ]

  return (
    <section>
      <SectionTitle title="LOGS" sub="Parcours // Compétences" />
      <MenuDetail entries={entries} selected={sel} onSelect={setSel} blip={blip}>
        {panels[sel]}
      </MenuDetail>
    </section>
  )
}
