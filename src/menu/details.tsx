import type { ReactNode } from 'react'
import { Field, SquareList, Tag } from '../components/ui'
import type { T } from '../data/lang'
import type { LogEntry, Profile, Project, Skill, TabId } from '../data/profile'
import { useLang } from '../i18n'
import { Tracks, findProof } from './tabs'

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

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s) => (
        <Tag key={s}>{s}</Tag>
      ))}
    </div>
  )
}

function ProjectDetail({ p }: { p: Project }) {
  const { t } = useLang()
  return (
    <div className="space-y-6">
      <Header over={`${t('PROJETS', 'PROJECTS')} // ${p.code} // ${p.period}`} title={p.title} />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {p.metrics.map((m) => (
          <div key={m.k} className="bg-item px-3 py-2">
            <p className="label">{m.k}</p>
            <p className="mt-0.5 text-xl">{m.v}</p>
          </div>
        ))}
      </div>

      <dl>
        <Field k={t('Contexte', 'Context')} v={p.context} />
        <Field k={t('Objectif', 'Goal')} v={p.objective} />
        <Field k={t('Technologies', 'Stack')} v={<Tags items={p.stack} />} />
      </dl>

      {(p.architecture.length > 0 || p.role.length > 0) && (
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
          <Block title={t('Rôle personnel', 'My role')}>
            <SquareList items={p.role} />
          </Block>
        </div>
      )}

      {p.image && (
        <Block title={t('Preuve // capture', 'Proof // screenshot')}>
          <figure>
            <div className="well p-3">
              <img src={p.image.src} alt={p.image.caption} className="mx-auto max-h-80 w-auto grayscale sepia-[.45]" />
            </div>
            <figcaption className="mt-2 text-sm text-dim">{p.image.caption}</figcaption>
          </figure>
        </Block>
      )}

      {p.retrospective ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Block title={t('Difficultés surmontées', 'Challenges overcome')}>
            <SquareList items={p.challenges} />
          </Block>
          <Block title={t('Retour d’expérience', 'Retrospective')}>
            <p className="leading-relaxed">{p.retrospective}</p>
          </Block>
        </div>
      ) : (
        <p className="desc-box text-dim">{t('Projet en cours : le dossier sera complété à la fin du projet.', 'Project in progress: this file will be completed when it ends.')}</p>
      )}

      <Block title={t('Compétences mobilisées', 'Skills used')}>
        <Tags items={[...p.hardSkills, ...p.softSkills]} />
      </Block>

      {p.links && (
        <Block title={t('Liens', 'Links')}>
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

const groupLabel = (g: LogEntry['group'], t: T) =>
  ({
    school: t('PARCOURS // SCOLARITÉ', 'PATH // SCHOOLING'),
    music: t('MUSIQUE // CONSERVATOIRE', 'MUSIC // CONSERVATOIRE'),
    stage: t('MUSIQUE // SCÈNE', 'MUSIC // STAGE'),
    lead: t('ENGAGEMENTS // RESPONSABILITÉ', 'COMMITMENTS // RESPONSIBILITY'),
    job: t('ENGAGEMENTS // EMPLOI', 'COMMITMENTS // JOB'),
    contest: t('ENGAGEMENTS // CONCOURS', 'COMMITMENTS // CONTEST'),
  })[g]

function LogDetail({ l }: { l: LogEntry }) {
  const { P, t } = useLang()
  const quest = l.group === 'lead' || l.group === 'job' || l.group === 'contest'
  const musicDiplomas = P.diplomas.filter((d) => d.group === 'music')
  return (
    <div className="space-y-6">
      <Header over={`${groupLabel(l.group, t)} // ${l.period}`} title={l.title} sub={l.place} />
      <Block title={quest ? t('Objectifs de la quête', 'Quest objectives') : t('Détails', 'Details')}>
        <SquareList items={l.details} />
      </Block>
      {l.group === 'music' && (
        <>
          <Block title={t('Disciplines // durée de pratique', 'Subjects // years of practice')}>
            <Tracks />
          </Block>
          <Block title={`${t('Diplômes obtenus', 'Diplomas earned')} (${musicDiplomas.length})`}>
            <div className="grid gap-2 sm:grid-cols-2">
              {musicDiplomas.map((d) => (
                <div key={d.id} className="bg-item px-3 py-2">
                  <p>{d.name}</p>
                  <p className="label">{d.grade}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block title={t('Ce que la musique m’a apporté', 'What music gave me')}>
            <Tags items={P.music.brought} />
          </Block>
        </>
      )}
      {l.skills.length > 0 && (
        <Block title={quest ? t('Récompenses : compétences', 'Rewards: skills') : t('Compétences', 'Skills')}>
          <Tags items={l.skills} />
        </Block>
      )}
    </div>
  )
}

function SkillDetail({ s, kind, onJump }: { s: Skill; kind: string; onJump: (tab: TabId, id: string) => void }) {
  const { P, t } = useLang()
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
      <Block title={`${t('Preuves liées', 'Linked proofs')} (${s.proofs.length})`}>
        <div className="space-y-2">
          {s.proofs.map((id) => {
            const p = findProof(P, id)
            return (
              p && (
                <button key={id} type="button" onClick={() => onJump(p.tab, id)} className="btn flex! w-full">
                  <span className="bullet" />
                  <span className="w-44 flex-none truncate max-sm:w-28">{p.label}</span>
                  <span className="flex-1 truncate text-sm opacity-80">{p.summary}</span>
                </button>
              )
            )
          })}
        </div>
      </Block>
    </div>
  )
}

const allLogs = (P: Profile) => [...P.education, ...P.experience]

/** Title shown in the detail layer's header. */
export function detailTitle(P: Profile, id: string): string {
  return (
    P.projects.find((p) => p.id === id)?.code ??
    allLogs(P).find((l) => l.id === id)?.title.toUpperCase() ??
    [...P.hardSkills, ...P.softSkills].find((s) => s.id === id)?.name.toUpperCase() ??
    id
  )
}

export function renderDetail(P: Profile, t: T, id: string, onJump: (tab: TabId, id: string) => void): ReactNode {
  const p = P.projects.find((x) => x.id === id)
  if (p) return <ProjectDetail p={p} />
  const l = allLogs(P).find((x) => x.id === id)
  if (l) return <LogDetail l={l} />
  const h = P.hardSkills.find((x) => x.id === id)
  if (h)
    return (
      <SkillDetail
        s={h}
        kind={h.group === 'instrument' ? t('MUSIQUE // INSTRUMENT', 'MUSIC // INSTRUMENT') : t('PROJETS // COMPÉTENCE TECHNIQUE', 'PROJECTS // HARD SKILL')}
        onJump={onJump}
      />
    )
  const s = P.softSkills.find((x) => x.id === id)
  if (s) return <SkillDetail s={s} kind={t('PROFIL // SOFT SKILL', 'PROFILE // SOFT SKILL')} onJump={onJump} />
  return null
}
