import type { ReactNode } from 'react'
import { GlyphIcon, Visual, type Glyph } from '../components/icons'
import { PhotoFrame } from '../components/Photo'
import { Meter, SquareList, Tag } from '../components/ui'
import { translator, type Lang, type T } from '../data/lang'
import { PROFILES, type Diploma, type LogEntry, type Photo, type Profile, type Skill, type TabId } from '../data/profile'
import { STRINGS } from '../data/strings'
import { cvJson, cvMarkdown, download } from '../hack/cv'
import { useLang } from '../i18n'

/* ------------------------------------------------------------------
   Tabs by life area. Each tab (except HOME, see home/Home.tsx) holds
   categories (left column), each category a list of entries (middle
   column), and each entry a fiche (right column). Entries with
   `detail` open a full dossier after the hacking-mode transition
   (see menu/details.tsx).
   ------------------------------------------------------------------ */

export const TAB_IDS: TabId[] = ['home', 'path', 'projects', 'music', 'commitments', 'life', 'profile']

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
  /** what Pod says when this entry is selected */
  pod?: string
}

export interface Category {
  id: string
  label: string
  glyph: Glyph
  entries: Entry[]
}

export interface Actions {
  crt: boolean
  setCrt: (v: boolean) => void
  sound: boolean
  setSound: (v: boolean) => void
  ambient: boolean
  setAmbient: (v: boolean) => void
  podAwake: boolean
  setPodAwake: (v: boolean) => void
  lang: Lang
  setLang: (l: Lang) => void
  openTerminal: () => void
  go: (tab: TabId) => void
}

export const NO_ACTIONS: Actions = {
  crt: false,
  setCrt: () => {},
  sound: false,
  setSound: () => {},
  ambient: false,
  setAmbient: () => {},
  podAwake: false,
  setPodAwake: () => {},
  lang: 'fr',
  setLang: () => {},
  openTerminal: () => {},
  go: () => {},
}

/* Fiche building blocks --------------------------------------------- */

type Stat = { k: string; v: ReactNode }

/** Weapon-viewer fiche: preview well (or photo) + name and stats, then the description box. */
function Card({
  glyph,
  photo,
  over,
  title,
  stats,
  text,
  tags,
  children,
}: {
  glyph: Glyph
  photo?: Photo
  over: string
  title: string
  stats?: Stat[]
  text?: string
  tags?: string[]
  children?: ReactNode
}) {
  const { t } = useLang()
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)]">
        {photo ? <PhotoFrame photo={photo} className="aspect-square max-w-48" /> : <Visual glyph={glyph} />}
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
          <p className="label mb-1.5">{t('Description', 'Description')}</p>
          <p className="leading-relaxed">{text}</p>
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}

export function ActionButton({ children, onClick, href }: { children: ReactNode; onClick?: () => void; href?: string }) {
  return href ? (
    <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className="btn">
      <span className="bullet" />
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className="btn">
      <span className="bullet" />
      {children}
    </button>
  )
}

/** Conservatoire disciplines as segmented bars on a 14-year scale. */
export function Tracks() {
  const { P, t } = useLang()
  return (
    <div className="space-y-3">
      {P.music.tracks.map((x) => (
        <div key={x.name} className="grid grid-cols-[minmax(0,9.5rem)_1fr] items-center gap-x-3 gap-y-1 max-sm:grid-cols-1">
          <span className="truncate">{x.name}</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Meter value={x.years} max={P.music.years} small />
            <span className="text-[0.85rem]">
              {x.years} {t('ans', 'yrs')}
            </span>
            <span className="label">{x.note}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

/** A dead-simple tape deck: recordings are not online yet. */
function Jukebox() {
  const { t } = useLang()
  const tracks = [
    t('Guitare classique — enregistrement', 'Classical guitar — recording'),
    t('Groupe EPImusic — répétition', 'EPImusic band — rehearsal'),
    t('Kawaii future bass — première composition', 'Kawaii future bass — first composition'),
  ]
  return (
    <div className="desc-box mt-5">
      <p className="label mb-3">{t('Pistes en attente de transfert', 'Tracks awaiting transfer')}</p>
      <ol className="space-y-2">
        {tracks.map((x, i) => (
          <li key={x} className="flex items-center gap-3 opacity-70">
            <span className="font-mono text-[0.8rem]">{String(i + 1).padStart(2, '0')}</span>
            <GlyphIcon name="disc" className="h-4 w-4 flex-none" />
            <span className="flex-1 truncate">{x}</span>
            <span className="font-mono text-[0.8rem]">--:--</span>
          </li>
        ))}
      </ol>
      <div className="wave-idle mt-4" aria-hidden>
        {Array.from({ length: 32 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${-i * 0.17}s` }} />
        ))}
      </div>
    </div>
  )
}

/** Short list meta from a period: its first year, or the period itself if short. */
const shortPeriod = (p: string) => p.match(/\d{4}/)?.[0] ?? (p.length <= 8 ? p.toUpperCase() : '')

const gradeMeta = (d: Diploma, t: T) =>
  d.rank === 3 ? `${t('TB', 'VG')} ★` : d.rank === 2 ? t('TB', 'VG') : d.rank === 1 ? t('B', 'G') : (d.year ?? '')

const by = <X extends { group?: string }>(xs: X[], g: string) => xs.filter((x) => x.group === g)

/* Proofs -------------------------------------------------------------- */

/** Any proof id (project or log entry) → its label, summary and the tab that shows it. */
export function findProof(P: Profile, id: string): { tab: TabId; label: string; summary: string } | null {
  const tab = locate(id)?.tab
  if (!tab) return null
  const p = P.projects.find((x) => x.id === id)
  if (p) return { tab, label: p.code, summary: p.summary }
  const l = [...P.education, ...P.experience].find((x) => x.id === id)
  if (l) return { tab, label: l.short ?? (l.group === 'school' ? l.place : l.title).toUpperCase(), summary: l.summary }
  return null
}

const proofStat = (P: Profile, t: T, ids: string[]): Stat => ({
  k: `${t('Preuves', 'Proofs')} (${ids.length})`,
  v: ids.map((id) => findProof(P, id)?.label ?? id).join(' · '),
})

/* Tabs ---------------------------------------------------------------- */

/** Builds the categories (and their entries) of a tab. HOME has none. */
export function categoriesFor(tab: TabId, P: Profile, t: T, s: Actions): Category[] {
  const logEntry = (l: LogEntry, kind: string): Entry => ({
    id: l.id,
    label: l.group === 'school' ? l.place : l.title,
    meta: shortPeriod(l.period),
    desc: `${kind} — ${l.summary}`,
    title: kind,
    code: l.period,
    detail: true,
    pod: l.pod,
    macro: <Card glyph={l.icon} over={`${l.place} // ${l.period}`} title={l.title} text={l.summary} tags={l.skills} />,
  })

  const diploma = (d: Diploma): Entry => {
    const kind = d.group === 'music' ? t('Diplôme musical', 'Music diploma') : t('Objet clé', 'Key item')
    return {
      id: d.id,
      label: d.name,
      meta: gradeMeta(d, t),
      desc: d.detail,
      title: kind,
      code: d.group === 'music' ? 'MUSIC' : 'KEY',
      macro: (
        <Card
          glyph={d.icon}
          over={kind}
          title={d.name}
          stats={[
            ...(d.grade ? [{ k: t('Mention', 'Grade'), v: d.grade }] : []),
            ...(d.year ? [{ k: t('Année', 'Year'), v: d.year }] : []),
            { k: t('Délivré par', 'Issued by'), v: d.issuer },
          ]}
          text={d.detail}
        />
      ),
    }
  }

  const skill = (k: Skill, kind: string, code: string): Entry => ({
    id: k.id,
    label: k.name,
    meta: k.meta ?? `×${k.proofs.length}`,
    desc: k.detail,
    title: kind,
    code,
    detail: k.proofs.length > 0,
    pod: k.pod,
    macro: <Card glyph={k.icon} over={kind} title={k.name} stats={[...(k.facts ?? []), proofStat(P, t, k.proofs)]} text={k.detail} />,
  })

  const project = (id: string): Entry => {
    const n = P.projects.findIndex((p) => p.id === id)
    const p = P.projects[n]
    return {
      id: p.id,
      label: p.title.split(' — ')[0],
      meta: `0${n + 1}`,
      desc: `${p.title} — ${p.period}`,
      title: `${t('Archive', 'Archive')} 0${n + 1}`,
      code: p.code,
      detail: true,
      pod: p.pod,
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

  switch (tab) {
    case 'home':
      return []

    case 'path':
      return [
        {
          id: 'now',
          label: t('Position', 'Position'),
          glyph: 'pin',
          entries: [
            {
              id: 'node',
              label: t('Position actuelle', 'Current position'),
              meta: 'NOW',
              desc: t('Coordonnées actuelles de l’unité.', 'The unit’s current coordinates.'),
              title: t('Position', 'Position'),
              code: '43.60N 1.44E',
              macro: (
                <Card
                  glyph="pin"
                  over={t('Point de ralliement', 'Rally point')}
                  title={P.identity.location}
                  stats={[
                    { k: t('Formation', 'Studies'), v: P.identity.status },
                    { k: t('Campus', 'Campus'), v: P.identity.unit },
                    { k: t('Objectif', 'Goal'), v: P.identity.target },
                  ]}
                >
                  <div className="well mt-5 grid grid-cols-7 gap-px p-px" aria-hidden>
                    {Array.from({ length: 21 }, (_, i) => (
                      <span key={i} className={`aspect-[2/1] ${i === 10 ? 'bg-sel ping' : 'bg-item'}`} />
                    ))}
                  </div>
                </Card>
              ),
            },
          ],
        },
        { id: 'school', label: t('Scolarité', 'Schooling'), glyph: 'school', entries: by(P.education, 'school').map((e) => logEntry(e, t('Scolarité', 'Schooling'))) },
        { id: 'key', label: t('Diplômes', 'Diplomas'), glyph: 'scroll', entries: by(P.diplomas, 'school').map(diploma) },
        {
          id: 'lang',
          label: t('Langues', 'Languages'),
          glyph: 'globe',
          entries: P.languages.map((l, i) => ({
            id: `lang-${i}`,
            label: l.name,
            meta: l.level,
            desc: `${t('Module linguistique', 'Language module')} : ${l.name} (${l.level}).`,
            title: t('Module linguistique', 'Language module'),
            code: 'LANG',
            macro: <Card glyph="bubble" over={t('Langue', 'Language')} title={l.name} stats={[{ k: t('Niveau', 'Level'), v: l.level }, { k: t('Maîtrise', 'Fluency'), v: <Meter value={l.value} /> }]} />,
          })),
        },
      ]

    case 'projects':
      return [
        { id: 'team', label: t('Projets de groupe', 'Team projects'), glyph: 'grid', entries: by(P.projects, 'team').map((p) => project(p.id)) },
        { id: 'solo', label: t('Projets individuels', 'Solo projects'), glyph: 'folder', entries: by(P.projects, 'solo').map((p) => project(p.id)) },
        {
          id: 'code',
          label: t('Langages', 'Languages'),
          glyph: 'code',
          entries: by(P.hardSkills, 'code').map((k, n) => skill(k, t('Programmation', 'Programming'), `WPN_${String(n + 1).padStart(2, '0')}`)),
        },
        { id: 'tool', label: t('Outils', 'Tools'), glyph: 'terminal', entries: by(P.hardSkills, 'tool').map((k, n) => skill(k, t('Outil', 'Tool'), `TOOL_${String(n + 1).padStart(2, '0')}`)) },
      ]

    case 'music': {
      const cons = P.education.find((e) => e.group === 'music')!
      const musicDiplomas = by(P.diplomas, 'music')
      return [
        {
          id: 'conservatoire',
          label: t('Conservatoire', 'Conservatoire'),
          glyph: 'pillars',
          entries: [
            {
              ...logEntry(cons, t('Conservatoire', 'Conservatoire')),
              label: 'Bagnols-sur-Cèze',
              meta: t('14 ANS', '14 YRS'),
              macro: (
                <Card
                  glyph="pillars"
                  over={`${cons.place} // ${cons.period}`}
                  title={cons.title}
                  stats={[
                    { k: t('Durée', 'Length'), v: `${P.music.years} ${t('ans', 'years')}` },
                    { k: t('Diplômes', 'Diplomas'), v: `${musicDiplomas.length} ${t('fins de cycle', 'cycle exams')}` },
                    { k: t('Disciplines', 'Subjects'), v: t('Guitare, batterie, FM, orchestre', 'Guitar, drums, theory, orchestra') },
                  ]}
                >
                  <div className="desc-box mt-5">
                    <p className="label mb-3">{t('Disciplines // durée de pratique', 'Subjects // years of practice')}</p>
                    <Tracks />
                  </div>
                </Card>
              ),
            },
            ...musicDiplomas.map(diploma),
          ],
        },
        {
          id: 'instrument',
          label: t('Instruments', 'Instruments'),
          glyph: 'guitar',
          entries: by(P.hardSkills, 'instrument').map((k, n) => skill(k, t('Instrument', 'Instrument'), `INST_${String(n + 1).padStart(2, '0')}`)),
        },
        { id: 'stage', label: t('Scène & groupe', 'Stage & band'), glyph: 'mic', entries: by(P.experience, 'stage').map((x) => logEntry(x, t('Scène', 'Stage'))) },
        {
          id: 'jukebox',
          label: t('Jukebox', 'Jukebox'),
          glyph: 'disc',
          entries: [
            {
              id: 'jukebox',
              label: t('Enregistrements', 'Recordings'),
              meta: t('BIENTÔT', 'SOON'),
              desc: t('Enregistrements à venir : guitare, groupe, compositions.', 'Recordings coming soon: guitar, band, compositions.'),
              title: 'Jukebox',
              code: 'AUDIO',
              pod: t('Fichiers audio introuvables. Proposition : activer l’ambiance en attendant.', 'Audio files not found. Proposal: turn on the ambient sound meanwhile.'),
              macro: (
                <Card
                  glyph="disc"
                  over={t('Lecteur audio', 'Audio player')}
                  title={t('Enregistrements', 'Recordings')}
                  text={t(
                    'Des enregistrements de guitare, du groupe EPImusic et de mes compositions sur FL Studio arriveront ici. En attendant, l’ambiance sonore du menu est jouable en haut à droite.',
                    'Recordings of my guitar, the EPImusic band and my FL Studio compositions will land here. Meanwhile, the menu’s ambient sound can be played from the top right.',
                  )}
                >
                  <Jukebox />
                  <div className="mt-4">
                    <ActionButton onClick={() => s.setAmbient(!s.ambient)}>
                      {s.ambient ? t('Couper l’ambiance', 'Stop the ambience') : t('Lancer l’ambiance', 'Play the ambience')}
                    </ActionButton>
                  </div>
                </Card>
              ),
            },
          ],
        },
      ]
    }

    case 'commitments':
      return [
        { id: 'lead', label: t('Responsabilités', 'Responsibilities'), glyph: 'flag', entries: by(P.experience, 'lead').map((x) => logEntry(x, t('Engagement', 'Commitment'))) },
        { id: 'job', label: t('Emplois', 'Jobs'), glyph: 'case', entries: by(P.experience, 'job').map((x) => logEntry(x, t('Emploi', 'Job'))) },
        { id: 'contest', label: t('Concours', 'Contests'), glyph: 'star', entries: by(P.experience, 'contest').map((x) => logEntry(x, t('Concours', 'Contest'))) },
      ]

    case 'life': {
      const interest = (kind: string) => (i: Profile['interests'][number]) => ({
        id: i.id,
        label: i.name,
        meta: i.meta,
        desc: i.detail,
        title: kind,
        code: i.group === 'sport' ? 'SPORT' : 'ITEM',
        pod: i.pod,
        macro: <Card glyph={i.icon} photo={P.gallery.find((g) => g.icon === i.icon && g.src)} over={kind} title={i.name} stats={i.facts} text={i.detail} />,
      })
      return [
        { id: 'sport', label: t('Sport', 'Sport'), glyph: 'aikido', entries: by(P.interests, 'sport').map(interest(t('Sport', 'Sport'))) },
        { id: 'passion', label: t('Passions', 'Passions'), glyph: 'heart', entries: by(P.interests, 'passion').map(interest(t('Passion', 'Passion'))) },
        {
          id: 'gallery',
          label: t('Galerie', 'Gallery'),
          glyph: 'camera',
          entries: P.gallery.map((g, n) => ({
            id: `photo-${g.id}`,
            label: g.caption,
            meta: g.src ? `IMG_${String(n + 1).padStart(2, '0')}` : '···',
            desc: g.src ? g.caption : t('Photo en attente de transfert.', 'Photo awaiting transfer.'),
            title: t('Archive visuelle', 'Visual archive'),
            code: `IMG_${String(n + 1).padStart(2, '0')}`,
            pod: g.pod,
            macro: <PhotoFrame photo={g} className="aspect-[4/3] w-full" large />,
          })),
        },
      ]
    }

    case 'profile':
      return [
        {
          id: 'unit',
          label: t('Qui je suis', 'Who I am'),
          glyph: 'user',
          entries: [
            {
              id: 'profile',
              label: t('Profil', 'Profile'),
              meta: 'ID',
              desc: t('Données d’identification de l’unité.', 'The unit’s identification data.'),
              title: 'Unit Data',
              code: 'ID_01',
              macro: (
                <Card
                  glyph="user"
                  photo={P.gallery.find((g) => g.id === 'portrait' && g.src)}
                  over="Unit Data"
                  title={P.identity.name}
                  stats={[
                    { k: t('Statut', 'Status'), v: P.identity.role },
                    { k: t('Formation', 'Studies'), v: P.identity.status },
                    { k: t('Objectif', 'Goal'), v: P.identity.target },
                  ]}
                  text={P.about.profile}
                />
              ),
            },
            {
              id: 'motivation',
              label: t('Motivation', 'Motivation'),
              meta: 'ID',
              desc: t('Orientation professionnelle visée.', 'Career direction.'),
              title: t('Motivation', 'Motivation'),
              code: 'ID_02',
              macro: <Card glyph="target" over={t('Orientation', 'Direction')} title={t('Motivation', 'Motivation')} text={P.about.motivation} />,
            },
            {
              id: 'beyond',
              label: t('Au-delà de l’école', 'Beyond school'),
              meta: 'ID',
              desc: t('Ce que la musique, la scène et les engagements m’ont appris.', 'What music, stage and commitments taught me.'),
              title: t('Au-delà de l’école', 'Beyond school'),
              code: 'ID_03',
              macro: (
                <Card glyph="heart" over={t('Hors cadre', 'Off the record')} title={t('Au-delà de l’école', 'Beyond school')} text={P.about.beyond}>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {P.music.brought.map((b) => (
                      <Tag key={b}>{b}</Tag>
                    ))}
                  </div>
                </Card>
              ),
            },
            {
              id: 'objectives',
              label: t('Ce portfolio', 'This portfolio'),
              meta: 'ID',
              desc: t('Pourquoi ce portfolio existe, et comment le lire.', 'Why this portfolio exists, and how to read it.'),
              title: t('Directives', 'Directives'),
              code: 'ID_04',
              macro: (
                <Card glyph="eye" over={t('Directives', 'Directives')} title={t('Objectifs du portfolio', 'Portfolio goals')}>
                  <div className="desc-box mt-5">
                    <SquareList items={P.about.objectives} />
                  </div>
                  <p className="label mt-4 leading-relaxed normal-case">
                    {t(
                      'Les fiches qui proposent un dossier complet s’ouvrent avec [A] ou le bouton « Ouvrir le dossier ».',
                      'Cards with a full file open with [A] or the “Open full file” button.',
                    )}
                  </p>
                </Card>
              ),
            },
          ],
        },
        {
          id: 'soft',
          label: t('Soft skills', 'Soft skills'),
          glyph: 'chip',
          entries: P.softSkills.map((k, n) => skill(k, t('Compétence transversale', 'Soft skill'), `CHIP_${String(n + 1).padStart(2, '0')}`)),
        },
        {
          id: 'eval',
          label: t('Bilan', 'Assessment'),
          glyph: 'star',
          entries: [
            {
              id: 'strengths',
              label: t('Points forts', 'Strengths'),
              meta: `×${P.selfAssessment.strengths.length}`,
              desc: t('Auto-évaluation : points forts.', 'Self-assessment: strengths.'),
              title: t('Auto-évaluation', 'Self-assessment'),
              code: 'EVAL_01',
              macro: (
                <Card glyph="star" over={t('Auto-évaluation', 'Self-assessment')} title={t('Points forts', 'Strengths')}>
                  <div className="desc-box mt-5">
                    <SquareList items={P.selfAssessment.strengths} />
                  </div>
                </Card>
              ),
            },
            {
              id: 'improvements',
              label: t('Axes de progression', 'Areas to improve'),
              meta: `×${P.selfAssessment.improvements.length}`,
              desc: t('Auto-évaluation : axes d’amélioration.', 'Self-assessment: areas to improve.'),
              title: t('Auto-évaluation', 'Self-assessment'),
              code: 'EVAL_02',
              macro: (
                <Card glyph="up" over={t('Auto-évaluation', 'Self-assessment')} title={t('Axes de progression', 'Areas to improve')}>
                  <div className="desc-box mt-5">
                    <SquareList items={P.selfAssessment.improvements} />
                  </div>
                </Card>
              ),
            },
            {
              id: 'next',
              label: t('Suite du parcours', 'What’s next'),
              meta: 'NEXT',
              desc: t('Domaines d’intérêt et suite du parcours.', 'Fields of interest and next steps.'),
              title: t('Perspectives', 'Outlook'),
              code: 'NEXT',
              macro: (
                <Card glyph="target" over={t('Perspectives', 'Outlook')} title={t('Suite du parcours', 'What’s next')} text={P.outlook.next}>
                  <div className="mt-5">
                    <p className="label mb-2">{t('Domaines d’intérêt', 'Fields of interest')}</p>
                    <SquareList items={P.outlook.interests} />
                  </div>
                  <div className="desc-box mt-5">
                    <p className="label mb-1.5">{t('Conclusion', 'Conclusion')}</p>
                    <p className="leading-relaxed">{P.about.conclusion}</p>
                  </div>
                </Card>
              ),
            },
          ],
        },
        {
          id: 'comms',
          label: t('Contact', 'Contact'),
          glyph: 'mail',
          entries: [
            {
              id: 'contact',
              label: t('Me contacter', 'Get in touch'),
              meta: 'COMMS',
              desc: t('Ouvrir un canal de transmission.', 'Open a transmission channel.'),
              title: t('Transmission', 'Transmission'),
              code: 'COMMS',
              pod: t('Canal ouvert. Temps de réponse estimé : rapide.', 'Channel open. Estimated reply time: fast.'),
              onConfirm: () => (window.location.href = `mailto:${P.contact.email}`),
              macro: (
                <Card
                  glyph="mail"
                  over={t('Canal de transmission', 'Transmission channel')}
                  title={t('Contact', 'Contact')}
                  stats={[
                    { k: 'Mail', v: P.contact.email },
                    { k: 'GitHub', v: P.contact.github.replace('https://', '') },
                    { k: t('Localisation', 'Location'), v: P.contact.location },
                  ]}
                >
                  <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton href={`mailto:${P.contact.email}`}>{t('Envoyer un mail', 'Send an email')}</ActionButton>
                    <ActionButton href={P.contact.github}>GitHub ↗</ActionButton>
                  </div>
                </Card>
              ),
            },
            {
              id: 'export',
              label: t('Exporter le CV', 'Export the CV'),
              meta: 'DATA',
              desc: t('Télécharger le CV : PDF d’une page, ou version structurée.', 'Download the CV: a one-page PDF, or a structured version.'),
              title: 'Export',
              code: 'DATA',
              onConfirm: () => window.print(),
              macro: (
                <Card
                  glyph="download"
                  over="Export"
                  title={t('Exporter le CV', 'Export the CV')}
                  text={t('Version structurée du CV, générée à partir des données de ce portfolio, dans la langue affichée.', 'A structured version of the CV, generated from this portfolio’s data, in the current language.')}
                >
                  <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton onClick={() => window.print()}>{t('PDF (une page)', 'PDF (one page)')}</ActionButton>
                    <ActionButton onClick={() => download('Louis_Leymonie_CV.md', cvMarkdown(P, t), 'text/markdown')}>Markdown (.md)</ActionButton>
                    <ActionButton onClick={() => download('Louis_Leymonie_CV.json', cvJson(P), 'application/json')}>JSON (.json)</ActionButton>
                  </div>
                </Card>
              ),
            },
          ],
        },
        {
          id: 'sys',
          label: t('Système', 'System'),
          glyph: 'cog',
          entries: [
            {
              id: 'settings',
              label: t('Réglages', 'Settings'),
              meta: 'CFG',
              desc: t('Langue, son, ambiance, Pod et affichage.', 'Language, sound, ambience, Pod and display.'),
              title: t('Réglages', 'Settings'),
              code: 'CFG',
              macro: (
                <Card glyph="cog" over={t('Configuration', 'Configuration')} title={t('Réglages', 'Settings')}>
                  <div className="mt-3 divide-y divide-line/35">
                    <Toggle label={t('Langue', 'Language')} value={s.lang} options={[['fr', 'FR'], ['en', 'EN']]} set={s.setLang} />
                    <Toggle label={t('Ambiance sonore', 'Ambient sound')} value={s.ambient} options={ONOFF} set={s.setAmbient} />
                    <Toggle label={t('Effets sonores', 'Sound effects')} value={s.sound} options={ONOFF} set={s.setSound} />
                    <Toggle label="Pod 042" value={s.podAwake} options={ONOFF} set={s.setPodAwake} />
                    <Toggle label={t('Filtre CRT', 'CRT filter')} value={s.crt} options={ONOFF} set={s.setCrt} />
                  </div>
                </Card>
              ),
            },
            {
              id: 'terminal',
              label: 'Terminal',
              meta: 'ROOT',
              desc: t('Accès root au système. Archives cachées. Touche [ ² ].', 'Root access. Hidden archives. Key [ ` ].'),
              title: 'Terminal',
              code: 'ROOT',
              onConfirm: s.openTerminal,
              macro: (
                <Card
                  glyph="terminal"
                  over={t('Maintenance', 'Maintenance')}
                  title="Terminal"
                  text={t('Terminal de maintenance. Certaines archives personnelles y sont chiffrées.', 'Maintenance terminal. Some personal archives in there are encrypted.')}
                >
                  <div className="mt-5">
                    <ActionButton onClick={s.openTerminal}>{t('Ouvrir le terminal', 'Open the terminal')}</ActionButton>
                  </div>
                </Card>
              ),
            },
          ],
        },
      ]
  }
}

const ONOFF: [boolean, string][] = [
  [true, 'ON'],
  [false, 'OFF'],
]

function Toggle<V extends string | boolean>({ label, value, options, set }: { label: string; value: V; options: [V, string][]; set: (v: V) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span>{label}</span>
      <span className="flex gap-1.5" role="radiogroup" aria-label={label}>
        {options.map(([v, name]) => (
          <button
            key={name}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => set(v)}
            className={`w-14 py-1 text-sm ${value === v ? 'bg-sel text-on-sel' : 'bg-item hover:bg-sel/40'}`}
          >
            {name}
          </button>
        ))}
      </span>
    </div>
  )
}

/* Locating entries (ids are the same in both languages) --------------- */

let index: Map<string, { tab: TabId; c: number; i: number }> | null = null

/** Where an entry lives: tab, category index and entry index. */
export function locate(id: string): { tab: TabId; c: number; i: number } | null {
  if (!index) {
    index = new Map()
    for (const tab of TAB_IDS) {
      categoriesFor(tab, PROFILES.fr, translator('fr'), NO_ACTIONS).forEach((cat, c) =>
        cat.entries.forEach((e, i) => index!.set(e.id, { tab, c, i })),
      )
    }
  }
  return index.get(id) ?? null
}

export const tabDef = (lang: Lang, id: TabId) => STRINGS[lang].tabs.find((x) => x.id === id)!
