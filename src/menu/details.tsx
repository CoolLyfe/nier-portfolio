import type { ReactNode } from 'react'
import { Field, SquareList, Tag } from '../components/ui'
import { Tracks } from './tabs'
import {
  diplomas,
  education,
  experience,
  findProof,
  hardSkills,
  music,
  projects,
  softSkills,
  type LogEntry,
  type Project,
  type Skill,
  type TabId,
} from '../data/profile'

/* Full dossiers (hacking palette). `renderDetail` resolves any entry with a detail. */

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <p className="panel-head mb-3 min-h-8! text-[0.9rem]">{title}</p>
      {children}
    </section>
  )
}

function Header({ over, title, sub }: { over: string; title: string; sub?: string }) {
  return (
    <header>
      <p className="label">{over}</p>
      <h2 className="quest-title mt-1 text-2xl! font-light sm:text-3xl!">{title}</h2>
      {sub && <p className="mt-2 pl-8 text-dim">{sub}</p>}
    </header>
  )
}

function ProjectDetail({ p }: { p: Project }) {
  return (
    <div className="space-y-6">
      <Header over={`INTEL // ${p.code} // ${p.period}`} title={p.title} />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {p.metrics.map((m) => (
          <div key={m.k} className="bg-item px-3 py-2">
            <p className="label">{m.k}</p>
            <p className="mt-0.5 text-xl">{m.v}</p>
          </div>
        ))}
      </div>

      <dl>
        <Field k="Contexte" v={p.context} />
        <Field k="Objectif" v={p.objective} />
        <Field
          k="Technologies"
          v={
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          }
        />
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Architecture">
          <ul className="space-y-2.5">
            {p.architecture.map((a) => (
              <li key={a.name} className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-relaxed">
                <span className="font-medium">■ {a.name}</span>
                <span>{a.role}</span>
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Rôle personnel">
          <SquareList items={p.role} />
        </Block>
      </div>

      {p.image && (
        <Block title="Preuve // capture">
          <figure>
            <div className="well p-3">
              <img src={p.image.src} alt={p.image.caption} className="mx-auto max-h-80 w-auto grayscale sepia-[.45]" />
            </div>
            <figcaption className="mt-2 text-sm text-dim">{p.image.caption}</figcaption>
          </figure>
        </Block>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Difficultés surmontées">
          <SquareList items={p.challenges} />
        </Block>
        <Block title="Retour d'expérience">
          <p className="leading-relaxed">{p.retrospective}</p>
        </Block>
      </div>

      <Block title="Compétences mobilisées">
        <div className="flex flex-wrap gap-2">
          {[...p.hardSkills, ...p.softSkills].map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </Block>

      {p.links && (
        <Block title="Liens">
          <div className="flex flex-wrap gap-2">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn">
                <span className="bullet" />
                {l.label} ↗
              </a>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}

const GROUP_LABEL: Record<LogEntry['group'], string> = {
  school: 'MAP // SCOLARITÉ',
  music: 'MAP // CONSERVATOIRE',
  job: 'QUESTS // EMPLOI',
  commitment: 'QUESTS // ENGAGEMENT',
  stage: 'QUESTS // SCÈNE',
}

function LogDetail({ l }: { l: LogEntry }) {
  const quest = l.group === 'job' || l.group === 'commitment' || l.group === 'stage'
  return (
    <div className="space-y-6">
      <Header over={`${GROUP_LABEL[l.group]} // ${l.period}`} title={l.title} sub={l.place} />
      <Block title={quest ? 'Objectifs de la quête' : 'Détails'}>
        <SquareList items={l.details} />
      </Block>
      {l.group === 'music' && (
        <>
          <Block title="Disciplines // durée de pratique">
            <Tracks />
          </Block>
          <Block title={`Diplômes obtenus (${diplomas.filter((d) => d.group === 'music').length})`}>
            <div className="grid gap-2 sm:grid-cols-2">
              {diplomas
                .filter((d) => d.group === 'music')
                .map((d) => (
                  <div key={d.id} className="bg-item px-3 py-2">
                    <p>{d.name}</p>
                    <p className="label">{d.grade}</p>
                  </div>
                ))}
            </div>
          </Block>
          <Block title="Ce que la musique m'a apporté">
            <div className="flex flex-wrap gap-2">
              {music.brought.map((b) => (
                <Tag key={b}>{b}</Tag>
              ))}
            </div>
          </Block>
        </>
      )}
      {l.skills.length > 0 && (
        <Block title={quest ? 'Récompenses : compétences' : 'Compétences'}>
          <div className="flex flex-wrap gap-2">
            {l.skills.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}

function SkillDetail({ s, kind, onJump }: { s: Skill; kind: string; onJump: (tab: TabId, id: string) => void }) {
  return (
    <div className="space-y-6">
      <Header over={kind} title={s.name} sub={s.detail} />
      {s.facts && (
        <dl>
          {s.facts.map((f) => (
            <Field key={f.k} k={f.k} v={f.v} />
          ))}
        </dl>
      )}
      <Block title={`Preuves liées (${s.proofs.length})`}>
        <div className="space-y-2">
          {s.proofs.map((id) => {
            const p = findProof(id)
            return (
              p && (
                <button key={id} type="button" onClick={() => onJump(p.tab, id)} className="btn flex! w-full">
                  <span className="bullet" />
                  <span className="w-44 flex-none truncate max-sm:w-28">{p.label}</span>
                  <span className="flex-1 truncate text-sm opacity-80">{p.summary}</span>
                  <span className="text-[0.75rem]">{p.tab.toUpperCase()}</span>
                </button>
              )
            )
          })}
        </div>
      </Block>
    </div>
  )
}

/** Title shown in the detail layer's header. */
export function detailTitle(id: string): string {
  return (
    projects.find((p) => p.id === id)?.code ??
    [...education, ...experience].find((l) => l.id === id)?.title.toUpperCase() ??
    [...hardSkills, ...softSkills].find((s) => `skill-${s.name}` === id)?.name.toUpperCase() ??
    id
  )
}

export function renderDetail(id: string, onJump: (tab: TabId, id: string) => void): ReactNode {
  const p = projects.find((x) => x.id === id)
  if (p) return <ProjectDetail p={p} />
  const l = [...education, ...experience].find((x) => x.id === id)
  if (l) return <LogDetail l={l} />
  const h = hardSkills.find((x) => `skill-${x.name}` === id)
  if (h) return <SkillDetail s={h} kind={h.group === 'instrument' ? 'WEAPONS // INSTRUMENT' : 'WEAPONS // HARD SKILL'} onJump={onJump} />
  const s = softSkills.find((x) => `skill-${x.name}` === id)
  if (s) return <SkillDetail s={s} kind="SKILLS // SOFT SKILL" onJump={onJump} />
  return null
}
