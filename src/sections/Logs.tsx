import { Card } from '../components/Expanded'
import { Heading, Item, Split, SquareList, Window, useListKeys, useUi } from '../components/ui'
import {
  education,
  experience,
  findProof,
  hardSkills,
  outlook,
  selfAssessment,
  softSkills,
  type LogEntry,
  type Skill,
} from '../data/profile'

export const LOG_TABS = ['Formation', 'Expériences', 'Hard skills', 'Soft skills', 'Bilan', 'Perspectives'] as const

function CardGrid({ entries, onOpen }: { entries: LogEntry[]; onOpen: (id: string) => void }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {entries.map((e) => (
        <Card
          key={e.id}
          id={e.id}
          code={e.period.toUpperCase()}
          title={e.title}
          summary={`${e.place} — ${e.summary}`}
          tags={e.skills}
          desc={`${e.place} — ${e.summary}`}
          onOpen={() => onOpen(e.id)}
        />
      ))}
    </div>
  )
}

/** Skill rows; each proof button opens the project/experience that shows it. */
function SkillTable({ skills, onOpen }: { skills: Skill[]; onOpen: (id: string) => void }) {
  const { setDesc, blip } = useUi()
  return (
    <div className="divide-y divide-line/70">
      {skills.map((s) => (
        <div key={s.name} className="grid gap-2 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <p className="font-display tracking-[0.15em] uppercase">{s.name}</p>
          <div>
            <p className="text-sm leading-relaxed">{s.detail}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="label">Preuves :</span>
              {s.proofs.map((id) => {
                const p = findProof(id)
                return (
                  p && (
                    <button
                      key={id}
                      type="button"
                      onMouseEnter={() => setDesc(`Ouvrir la preuve : ${p.label}`)}
                      onClick={() => {
                        blip('select')
                        onOpen(id)
                      }}
                      className="border border-line px-1.5 font-display text-[11px] tracking-wider text-beige uppercase hover:border-fg hover:bg-fg hover:text-bg"
                    >
                      {p.label} ▸
                    </button>
                  )
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/** LOGS / EXPERIENCE */
export function Logs({ tab, setTab, onOpen }: { tab: number; setTab: (i: number) => void; onOpen: (id: string) => void }) {
  useListKeys(LOG_TABS.length, tab, setTab)

  const descs = [
    'Parcours académique, du collège à l’EPITA.',
    'Expériences professionnelles, responsabilités et activités.',
    'Compétences techniques, reliées à leurs preuves.',
    'Compétences transversales, reliées à leurs preuves.',
    'Auto-évaluation : points forts et axes de progression.',
    'Domaines d’intérêt et suite du parcours.',
  ]

  const panels = [
    <CardGrid key="0" entries={education} onOpen={onOpen} />,
    <CardGrid key="1" entries={experience} onOpen={onOpen} />,
    <Window key="2" title="Hard skills" code="SKL_01">
      <SkillTable skills={hardSkills} onOpen={onOpen} />
    </Window>,
    <Window key="3" title="Soft skills" code="SKL_02">
      <SkillTable skills={softSkills} onOpen={onOpen} />
    </Window>,
    <div key="4" className="grid gap-5 xl:grid-cols-2">
      <Window title="Points forts" code="EVAL_+">
        <SquareList items={selfAssessment.strengths} />
      </Window>
      <Window title="Axes d'amélioration" code="EVAL_−">
        <SquareList items={selfAssessment.improvements} />
      </Window>
    </div>,
    <Window key="5" title="Perspectives" code="NEXT">
      <Heading>Domaines d'intérêt</Heading>
      <SquareList items={outlook.interests} />
      <div className="mt-6">
        <Heading>Suite du parcours</Heading>
        <p className="leading-relaxed">{outlook.next}</p>
      </div>
    </Window>,
  ]

  return (
    <Split
      list={LOG_TABS.map((t, i) => (
        <Item key={t} label={t} meta={`0${i + 1}`} desc={descs[i]} selected={i === tab} onClick={() => setTab(i)} />
      ))}
    >
      <div key={tab} className="boot-in">
        {panels[tab]}
      </div>
    </Split>
  )
}
