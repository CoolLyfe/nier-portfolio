import type { ReactNode } from 'react'
import { TabIcon, Visual, type Glyph } from '../components/icons'
import { Meter, SquareList, Tag } from '../components/ui'
import {
  about,
  contact,
  diplomas,
  education,
  experience,
  findProof,
  hardSkills,
  identity,
  interests,
  languages,
  music,
  outlook,
  projects,
  selfAssessment,
  softSkills,
  type Diploma,
  type LogEntry,
  type TabId,
} from '../data/profile'
import { cvJson, cvMarkdown, download } from '../hack/cv'

/* ------------------------------------------------------------------
   The seven game tabs. Each tab holds categories (left column), each
   category a list of entries (middle column), and each entry a fiche
   (right column). Entries with `detail` open a full dossier after the
   hacking-mode transition (see menu/details.tsx).
   ------------------------------------------------------------------ */

export interface Entry {
  id: string
  label: string
  meta?: string
  desc: string // bottom-bar text
  title: string // window title
  code: string
  detail?: boolean
  macro: ReactNode
  onConfirm?: () => void
}

export interface Category {
  id: string
  label: string
  glyph: Glyph
  entries: Entry[]
}

export interface TabDef {
  id: TabId
  label: string
  sub: string // "INTEL — Unit Data"
  desc: string
}

export const TABS: TabDef[] = [
  { id: 'map', label: 'MAP', sub: 'Parcours', desc: 'Carte du parcours : scolarité, conservatoire et position actuelle.' },
  { id: 'quests', label: 'QUESTS', sub: 'Expériences', desc: 'Emplois, engagements et scène.' },
  { id: 'items', label: 'ITEMS', sub: 'Inventaire', desc: 'Diplômes, langues et loisirs.' },
  { id: 'weapons', label: 'WEAPONS', sub: 'Arsenal', desc: 'Programmation, outils et instruments, reliés à leurs preuves.' },
  { id: 'skills', label: 'SKILLS', sub: 'Soft skills', desc: 'Compétences transversales, bilan et perspectives.' },
  { id: 'intel', label: 'INTEL', sub: 'Unit Data', desc: 'Archives des projets réalisés.' },
  { id: 'system', label: 'SYSTEM', sub: 'Profile', desc: 'Sommaire, profil de l’unité, contact et réglages.' },
]

/* Fiche building blocks --------------------------------------------- */

type Stat = { k: string; v: ReactNode }

/** "Preuves" stat: the names of the linked projects / experiences. */
const proofStat = (ids: string[]): Stat => ({
  k: `Preuves (${ids.length})`,
  v: ids.map((id) => findProof(id)?.label ?? id).join(' · '),
})

/** Weapon-viewer fiche: preview well + name and stats, then the description box. */
function Card({
  glyph,
  over,
  title,
  stats,
  text,
  tags,
  children,
}: {
  glyph: Glyph
  over: string
  title: string
  stats?: Stat[]
  text?: string
  tags?: string[]
  children?: ReactNode
}) {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)]">
        <Visual glyph={glyph} />
        <div className="min-w-0">
          <p className="label">{over}</p>
          <p className="quest-title mt-1">{title}</p>
          {stats && stats.length > 0 && (
            <dl className="mt-3">
              {stats.map((s) => (
                <div key={s.k} className="stat">
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
      {text && (
        <div className="desc-box mt-5">
          <p className="label mb-1.5">Description</p>
          <p className="leading-relaxed">{text}</p>
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

function ActionButton({ children, onClick, href }: { children: ReactNode; onClick?: () => void; href?: string }) {
  const cls = 'btn'
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      <span className="bullet" />
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      <span className="bullet" />
      {children}
    </button>
  )
}

/** Conservatoire disciplines as segmented bars on a 14-year scale. */
export function Tracks() {
  return (
    <div className="space-y-3">
      {music.tracks.map((t) => (
        <div key={t.name} className="grid grid-cols-[minmax(0,9.5rem)_1fr] items-center gap-x-3 gap-y-1 max-sm:grid-cols-1">
          <span className="truncate">{t.name}</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Meter value={t.years} max={music.years} small />
            <span className="text-[0.85rem]">{t.years} ans</span>
            <span className="label">{t.note}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

/** Short list meta from a period: its first year, or the period itself if short. */
const shortPeriod = (p: string) => p.match(/\d{4}/)?.[0] ?? (p.length <= 7 ? p.toUpperCase() : '')

const gradeMeta = (d: Diploma) =>
  d.grade?.includes('félicitations') ? 'TB ★' : d.grade?.includes('Très bien') ? 'TB' : d.grade?.includes('Bien') ? 'B' : (d.year ?? '')

const musicDiplomas = diplomas.filter((d) => d.group === 'music')

function logEntry(l: LogEntry, kind: string): Entry {
  return {
    id: l.id,
    label: l.group === 'school' ? l.place : l.title,
    meta: shortPeriod(l.period),
    desc: `${kind} — ${l.summary}`,
    title: kind,
    code: l.period,
    detail: true,
    macro: <Card glyph={l.icon} over={`${l.place} // ${l.period}`} title={l.title} text={l.summary} tags={l.skills} />,
  }
}

const by = <T extends { group?: string }>(xs: T[], g: string) => xs.filter((x) => x.group === g)

export interface Actions {
  crt: boolean
  setCrt: (v: boolean) => void
  sound: boolean
  setSound: (v: boolean) => void
  openTerminal: () => void
  go: (tab: TabId) => void
}

export const NO_ACTIONS: Actions = {
  crt: false,
  setCrt: () => {},
  sound: false,
  setSound: () => {},
  openTerminal: () => {},
  go: () => {},
}

/** Builds the categories (and their entries) of a tab. */
export function categoriesFor(tab: TabId, s: Actions): Category[] {
  switch (tab) {
    case 'map':
      return [
        {
          id: 'now',
          label: 'Position',
          glyph: 'pin',
          entries: [
            {
              id: 'node',
              label: 'Position actuelle',
              meta: 'NOW',
              desc: 'Coordonnées actuelles de l’unité.',
              title: 'Position',
              code: '43.60N 1.44E',
              macro: (
                <Card
                  glyph="pin"
                  over="Point de ralliement"
                  title={identity.location}
                  stats={[
                    { k: 'Formation', v: identity.status },
                    { k: 'Campus', v: identity.unit },
                    { k: 'Objectif', v: identity.target },
                  ]}
                >
                  <div className="well mt-5 grid grid-cols-7 gap-px p-px" aria-hidden>
                    {Array.from({ length: 21 }, (_, i) => (
                      <span key={i} className={`aspect-[2/1] ${i === 10 ? 'bg-sel' : 'bg-item'}`} />
                    ))}
                  </div>
                </Card>
              ),
            },
          ],
        },
        {
          id: 'school',
          label: 'Scolarité',
          glyph: 'school',
          entries: by(education, 'school').map((e) => logEntry(e, 'Scolarité')),
        },
        {
          id: 'music',
          label: 'Conservatoire',
          glyph: 'pillars',
          entries: by(education, 'music').map((e) => ({
            ...logEntry(e, 'Conservatoire'),
            label: 'Bagnols-sur-Cèze',
            meta: '14 ANS',
            macro: (
              <Card
                glyph="pillars"
                over={`${e.place} // ${e.period}`}
                title={e.title}
                stats={[
                  { k: 'Durée', v: `${music.years} ans` },
                  { k: 'Diplômes', v: `${musicDiplomas.length} fins de cycle` },
                  { k: 'Disciplines', v: 'Guitare, batterie, FM, orchestre' },
                ]}
              >
                <div className="desc-box mt-5">
                  <p className="label mb-3">Disciplines // durée de pratique</p>
                  <Tracks />
                </div>
              </Card>
            ),
          })),
        },
      ]

    case 'quests':
      return [
        { id: 'job', label: 'Emplois', glyph: 'case', entries: by(experience, 'job').map((x) => logEntry(x, 'Emploi')) },
        { id: 'commitment', label: 'Engagements', glyph: 'flag', entries: by(experience, 'commitment').map((x) => logEntry(x, 'Engagement')) },
        { id: 'stage', label: 'Scène', glyph: 'mic', entries: by(experience, 'stage').map((x) => logEntry(x, 'Scène')) },
      ]

    case 'items': {
      const diploma = (d: Diploma): Entry => ({
        id: d.id,
        label: d.name,
        meta: gradeMeta(d),
        desc: d.detail,
        title: d.group === 'music' ? 'Diplôme musical' : 'Objet clé',
        code: d.group === 'music' ? 'MUSIC' : 'KEY',
        macro: (
          <Card
            glyph={d.icon}
            over={d.group === 'music' ? 'Diplôme musical' : 'Objet clé'}
            title={d.name}
            stats={[
              ...(d.grade ? [{ k: 'Mention', v: d.grade }] : []),
              ...(d.year ? [{ k: 'Année', v: d.year }] : []),
              { k: 'Délivré par', v: d.issuer },
            ]}
            text={d.detail}
          />
        ),
      })
      return [
        { id: 'key', label: 'Objets clés', glyph: 'scroll', entries: by(diplomas, 'school').map(diploma) },
        { id: 'music', label: 'Diplômes musicaux', glyph: 'medal', entries: musicDiplomas.map(diploma) },
        {
          id: 'lang',
          label: 'Langues',
          glyph: 'bubble',
          entries: languages.map((l) => ({
            id: `lang-${l.name}`,
            label: l.name,
            meta: l.level,
            desc: `Module linguistique : ${l.name} (${l.level}).`,
            title: 'Module linguistique',
            code: 'LANG',
            macro: (
              <Card glyph="bubble" over="Langue" title={l.name} stats={[{ k: 'Niveau', v: l.level }, { k: 'Maîtrise', v: <Meter value={l.value} /> }]} />
            ),
          })),
        },
        {
          id: 'hobby',
          label: 'Loisirs',
          glyph: 'heart',
          entries: interests.map((i) => ({
            id: `int-${i.name}`,
            label: i.name,
            meta: '×1',
            desc: i.detail,
            title: 'Centre d’intérêt',
            code: 'ITEM',
            macro: <Card glyph={i.icon} over="Objet personnel" title={i.name} text={i.detail} />,
          })),
        },
      ]
    }

    case 'weapons': {
      const groups = [
        { id: 'code', label: 'Programmation', glyph: 'code' as const, prefix: 'WPN' },
        { id: 'tool', label: 'Outils', glyph: 'terminal' as const, prefix: 'TOOL' },
        { id: 'instrument', label: 'Instruments', glyph: 'guitar' as const, prefix: 'INST' },
      ]
      return groups.map((g) => ({
        id: g.id,
        label: g.label,
        glyph: g.glyph,
        entries: by(hardSkills, g.id).map<Entry>((k, n) => ({
          id: `skill-${k.name}`,
          label: k.name,
          meta: k.meta ?? `×${k.proofs.length}`,
          desc: k.detail,
          title: g.label,
          code: `${g.prefix}_${String(n + 1).padStart(2, '0')}`,
          detail: k.proofs.length > 0,
          macro: (
            <Card
              glyph={k.icon}
              over={g.label}
              title={k.name}
              stats={[...(k.facts ?? []), proofStat(k.proofs)]}
              text={k.detail}
            />
          ),
        })),
      }))
    }

    case 'skills':
      return [
        {
          id: 'soft',
          label: 'Soft skills',
          glyph: 'chip',
          entries: softSkills.map<Entry>((k, n) => ({
            id: `skill-${k.name}`,
            label: k.name,
            meta: `×${k.proofs.length}`,
            desc: k.detail,
            title: 'Soft skill',
            code: `CHIP_${String(n + 1).padStart(2, '0')}`,
            detail: true,
            macro: (
              <Card
                glyph={k.icon}
                over="Compétence transversale"
                title={k.name}
                stats={[proofStat(k.proofs)]}
                text={k.detail}
              />
            ),
          })),
        },
        {
          id: 'eval',
          label: 'Bilan',
          glyph: 'star',
          entries: [
            {
              id: 'strengths',
              label: 'Points forts',
              meta: `×${selfAssessment.strengths.length}`,
              desc: 'Auto-évaluation : points forts.',
              title: 'Auto-évaluation',
              code: 'EVAL_01',
              macro: (
                <Card glyph="star" over="Auto-évaluation" title="Points forts">
                  <div className="desc-box mt-5">
                    <SquareList items={selfAssessment.strengths} />
                  </div>
                </Card>
              ),
            },
            {
              id: 'improvements',
              label: 'Axes de progression',
              meta: `×${selfAssessment.improvements.length}`,
              desc: 'Auto-évaluation : axes d’amélioration.',
              title: 'Auto-évaluation',
              code: 'EVAL_02',
              macro: (
                <Card glyph="up" over="Auto-évaluation" title="Axes de progression">
                  <div className="desc-box mt-5">
                    <SquareList items={selfAssessment.improvements} />
                  </div>
                </Card>
              ),
            },
          ],
        },
        {
          id: 'next',
          label: 'Perspectives',
          glyph: 'target',
          entries: [
            {
              id: 'next',
              label: 'Suite du parcours',
              meta: 'NEXT',
              desc: 'Domaines d’intérêt et suite du parcours.',
              title: 'Perspectives',
              code: 'NEXT',
              macro: (
                <Card glyph="target" over="Perspectives" title="Suite du parcours" text={outlook.next}>
                  <div className="mt-5">
                    <p className="label mb-2">Domaines d'intérêt</p>
                    <SquareList items={outlook.interests} />
                  </div>
                </Card>
              ),
            },
          ],
        },
      ]

    case 'intel': {
      const project = (id: string) => {
        const n = projects.findIndex((p) => p.id === id)
        const p = projects[n]
        return {
          id: p.id,
          label: p.title.split(' — ')[0],
          meta: `0${n + 1}`,
          desc: `${p.title} — ${p.period}`,
          title: `Archive 0${n + 1}`,
          code: p.code,
          detail: true,
          macro: (
            <Card glyph="folder" over={p.period} title={p.title} stats={p.metrics.slice(0, 3)} text={p.summary} tags={p.stack}>
              {p.image && (
                <div className="well mt-4 p-2">
                  <img src={p.image.src} alt="" className="mx-auto max-h-44 w-auto opacity-85 grayscale sepia-[.45]" />
                </div>
              )}
            </Card>
          ),
        }
      }
      return [
        { id: 'team', label: 'Projets de groupe', glyph: 'grid', entries: by(projects, 'team').map((p) => project(p.id)) },
        { id: 'solo', label: 'Projets individuels', glyph: 'folder', entries: by(projects, 'solo').map((p) => project(p.id)) },
      ]
    }

    case 'system':
      return [
        {
          id: 'unit',
          label: 'Unité',
          glyph: 'user',
          entries: [
            {
              id: 'home',
              label: 'Sommaire',
              meta: 'INDEX',
              desc: 'Vue d’ensemble du portfolio et accès rapide aux onglets.',
              title: 'Sommaire',
              code: 'INDEX',
              macro: <Home go={s.go} />,
            },
            {
              id: 'profile',
              label: 'Profil',
              meta: 'ID',
              desc: 'Données d’identification de l’unité.',
              title: 'Unit Data',
              code: 'ID_01',
              macro: (
                <Card
                  glyph="user"
                  over="Unit Data"
                  title={identity.name}
                  stats={[
                    { k: 'Statut', v: identity.role },
                    { k: 'Formation', v: identity.status },
                    { k: 'Campus', v: identity.unit },
                    { k: 'Objectif', v: identity.target },
                  ]}
                  text={about.profile}
                />
              ),
            },
            {
              id: 'motivation',
              label: 'Motivation',
              meta: 'ID',
              desc: 'Orientation professionnelle visée.',
              title: 'Motivation',
              code: 'ID_02',
              macro: (
                <Card glyph="target" over="Orientation" title="Motivation" text={about.motivation}>
                  <div className="desc-box mt-4">
                    <p className="label mb-1.5">Au-delà de l'école</p>
                    <p className="leading-relaxed">{about.beyond}</p>
                  </div>
                </Card>
              ),
            },
            {
              id: 'objectives',
              label: 'Objectifs',
              meta: 'ID',
              desc: 'Pourquoi ce portfolio existe, et comment le lire.',
              title: 'Directives',
              code: 'ID_03',
              macro: (
                <Card glyph="eye" over="Directives" title="Objectifs du portfolio">
                  <div className="desc-box mt-5">
                    <SquareList items={about.objectives} />
                  </div>
                  <p className="label mt-4 leading-relaxed normal-case">
                    Les fiches qui proposent un dossier complet s'ouvrent avec [A] ou le bouton « Ouvrir le dossier ».
                  </p>
                </Card>
              ),
            },
            {
              id: 'conclusion',
              label: 'Conclusion',
              meta: 'ID',
              desc: 'Bilan et suite du parcours.',
              title: 'Rapport',
              code: 'ID_04',
              macro: <Card glyph="scroll" over="Rapport" title="Conclusion" text={about.conclusion} />,
            },
          ],
        },
        {
          id: 'comms',
          label: 'Transmission',
          glyph: 'mail',
          entries: [
            {
              id: 'contact',
              label: 'Contact',
              meta: 'COMMS',
              desc: 'Ouvrir un canal de transmission.',
              title: 'Transmission',
              code: 'COMMS',
              onConfirm: () => (window.location.href = `mailto:${contact.email}`),
              macro: (
                <Card
                  glyph="mail"
                  over="Canal de transmission"
                  title="Contact"
                  stats={[
                    { k: 'Mail', v: contact.email },
                    { k: 'GitHub', v: contact.github.replace('https://', '') },
                    { k: 'Localisation', v: contact.location },
                  ]}
                >
                  <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton href={`mailto:${contact.email}`}>Envoyer un mail</ActionButton>
                    <ActionButton href={contact.github}>GitHub ↗</ActionButton>
                  </div>
                </Card>
              ),
            },
            {
              id: 'export',
              label: 'Exporter le CV',
              meta: 'DATA',
              desc: 'Télécharger une version structurée du CV.',
              title: 'Export',
              code: 'DATA',
              onConfirm: () => download('Louis_Leymonie_CV.md', cvMarkdown(), 'text/markdown'),
              macro: (
                <Card glyph="download" over="Export" title="Exporter le CV" text="Version structurée du CV, générée à partir des données de ce portfolio.">
                  <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton onClick={() => download('Louis_Leymonie_CV.md', cvMarkdown(), 'text/markdown')}>Markdown (.md)</ActionButton>
                    <ActionButton onClick={() => download('Louis_Leymonie_CV.json', cvJson(), 'application/json')}>JSON (.json)</ActionButton>
                  </div>
                </Card>
              ),
            },
          ],
        },
        {
          id: 'sys',
          label: 'Système',
          glyph: 'cog',
          entries: [
            {
              id: 'terminal',
              label: 'Terminal',
              meta: 'ROOT',
              desc: 'Accès root au système. Archives cachées. Touche [ ² ].',
              title: 'Terminal',
              code: 'ROOT',
              onConfirm: s.openTerminal,
              macro: (
                <Card glyph="terminal" over="Maintenance" title="Terminal" text="Terminal de maintenance. Certaines archives personnelles y sont chiffrées.">
                  <div className="mt-5">
                    <ActionButton onClick={s.openTerminal}>Ouvrir le terminal</ActionButton>
                  </div>
                </Card>
              ),
            },
            {
              id: 'settings',
              label: 'Réglages',
              meta: 'CFG',
              desc: 'Affichage et son.',
              title: 'Réglages',
              code: 'CFG',
              macro: (
                <Card glyph="cog" over="Configuration" title="Réglages">
                  <div className="mt-3 divide-y divide-line/35">
                    <Toggle label="Filtre CRT" on={s.crt} set={s.setCrt} />
                    <Toggle label="Effets sonores" on={s.sound} set={s.setSound} />
                  </div>
                </Card>
              ),
            },
          ],
        },
      ]
  }
}

/** Where an entry lives: tab, category index and entry index. */
export function locate(id: string): { tab: TabId; c: number; i: number } | null {
  for (const t of TABS) {
    const cats = categoriesFor(t.id, NO_ACTIONS)
    for (let c = 0; c < cats.length; c++) {
      const i = cats[c].entries.findIndex((e) => e.id === id)
      if (i >= 0) return { tab: t.id, c, i }
    }
  }
  return null
}

/** SYSTEM › Sommaire: who, music highlights, and a shortcut per tab. */
function Home({ go }: { go: (tab: TabId) => void }) {
  const counts: Partial<Record<TabId, string>> = {
    map: `${education.length} étapes`,
    quests: `${experience.length} quêtes`,
    items: `${diplomas.length} diplômes`,
    weapons: `${hardSkills.length} compétences`,
    skills: `${softSkills.length} soft skills`,
    intel: `${projects.length} projets`,
  }
  return (
    <div>
      <p className="label">{identity.unit}</p>
      <p className="quest-title mt-1">{identity.name}</p>
      <p className="mt-3 leading-relaxed">
        {identity.role}. {identity.status}. {identity.target}.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ['14 ans', 'de conservatoire'],
          ['5', 'diplômes de musique'],
          ['11 ans', 'de guitare'],
          [String(projects.length), 'projets documentés'],
        ].map(([v, k]) => (
          <div key={k} className="bg-item px-3 py-2">
            <p className="text-xl">{v}</p>
            <p className="label">{k}</p>
          </div>
        ))}
      </div>

      <p className="label mt-6 mb-2">Accès rapide</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {TABS.filter((t) => t.id !== 'system').map((t) => (
          <button key={t.id} type="button" onClick={() => go(t.id)} className="btn flex! w-full">
            <TabIcon id={t.id} />
            <span className="w-24 flex-none">{t.label}</span>
            <span className="flex-1 truncate text-sm opacity-80">{t.sub}</span>
            <span className="text-[0.75rem]">{counts[t.id]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span>{label}</span>
      <span className="flex gap-1.5" role="radiogroup" aria-label={label}>
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={on === v}
            onClick={() => set(v)}
            className={`w-16 py-1 text-sm ${on === v ? 'bg-sel text-on-sel' : 'bg-item hover:bg-sel/40'}`}
          >
            {v ? 'ON' : 'OFF'}
          </button>
        ))}
      </span>
    </div>
  )
}

