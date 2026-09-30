import type { ReactNode } from 'react'
import { Field, Meter, SquareList, Tag } from '../components/ui'
import {
  about,
  contact,
  education,
  experience,
  hardSkills,
  identity,
  interests,
  languages,
  outlook,
  projects,
  selfAssessment,
  softSkills,
  type TabId,
} from '../data/profile'
import { cvJson, cvMarkdown, download } from '../hack/cv'

/* ------------------------------------------------------------------
   The seven game tabs, and what each list entry shows in the right
   column (macro view). `hackable` entries open a deep view after the
   hacking sequence (see menu/details.tsx).
   ------------------------------------------------------------------ */

export interface Entry {
  id: string
  label: string
  meta?: string
  desc: string // bottom-bar text
  title: string // window title
  code: string
  hackable?: boolean
  macro: ReactNode
  onConfirm?: () => void
}

export interface TabDef {
  id: TabId
  label: string
  sub: string // "INTEL — Unit Data"
  desc: string
}

export const TABS: TabDef[] = [
  { id: 'map', label: 'MAP', sub: 'Parcours', desc: 'Carte du parcours : formation et position actuelle.' },
  { id: 'quests', label: 'QUESTS', sub: 'Expériences', desc: 'Quêtes principales (expériences) et secondaires (activités).' },
  { id: 'items', label: 'ITEMS', sub: 'Inventaire', desc: 'Langues et centres d’intérêt.' },
  { id: 'weapons', label: 'WEAPONS', sub: 'Hard skills', desc: 'Arsenal technique : langages et outils, reliés à leurs preuves.' },
  { id: 'skills', label: 'SKILLS', sub: 'Soft skills', desc: 'Compétences transversales, bilan et perspectives.' },
  { id: 'intel', label: 'INTEL', sub: 'Unit Data', desc: 'Archives des projets réalisés.' },
  { id: 'system', label: 'SYSTEM', sub: 'Profile', desc: 'Profil de l’unité, contact et réglages.' },
]

/* Small reusable macro layouts ------------------------------------- */

function Summary({ over, title, text, tags }: { over: string; title: string; text: string; tags?: string[] }) {
  return (
    <div>
      <p className="label">{over}</p>
      <p className="quest-title mt-1">{title}</p>
      <p className="mt-2 pl-7 leading-relaxed">{text}</p>
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 pl-7">
          {tags.slice(0, 4).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
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

export interface Settings {
  crt: boolean
  setCrt: (v: boolean) => void
  sound: boolean
  setSound: (v: boolean) => void
  openTerminal: () => void
}

/** Builds the entries of a tab. */
export function entriesFor(tab: TabId, s: Settings): Entry[] {
  switch (tab) {
    case 'map':
      return [
        {
          id: 'node',
          label: 'Position actuelle',
          meta: 'NOW',
          desc: 'Coordonnées actuelles de l’unité.',
          title: 'Position',
          code: '43.60N 1.44E',
          macro: (
            <div>
              <Summary over="Point de ralliement" title={identity.location} text={`${identity.status} — ${identity.unit}.`} />
              <div className="well mt-5 grid grid-cols-5 gap-px p-px" aria-hidden>
                {Array.from({ length: 25 }, (_, i) => (
                  <span key={i} className={`aspect-[2/1] ${i === 12 ? 'bg-sel' : 'bg-item'}`} />
                ))}
              </div>
            </div>
          ),
        },
        ...education.map<Entry>((e) => ({
          id: e.id,
          label: e.place,
          meta: e.period.slice(0, 4),
          desc: `${e.period} — ${e.title}`,
          title: e.place,
          code: e.period,
          hackable: true,
          macro: <Summary over={e.period} title={e.title} text={e.summary} tags={e.skills} />,
        })),
      ]

    case 'quests':
      return experience.map<Entry>((x) => ({
        id: x.id,
        label: x.title,
        meta: x.quest === 'main' ? 'MAIN' : 'SIDE',
        desc: `${x.quest === 'main' ? 'Quête principale' : 'Quête secondaire'} — ${x.place}`,
        title: x.quest === 'main' ? 'Quête principale' : 'Quête secondaire',
        code: x.period,
        hackable: true,
        macro: <Summary over={`${x.place} // ${x.period}`} title={x.title} text={x.summary} tags={x.skills} />,
      }))

    case 'items':
      return [
        ...languages.map<Entry>((l) => ({
          id: `lang-${l.name}`,
          label: l.name,
          meta: l.level,
          desc: `Module linguistique : ${l.name} (${l.level}).`,
          title: 'Module linguistique',
          code: 'LANG',
          macro: (
            <div>
              <Summary over="Langue" title={l.name} text={`Niveau : ${l.level}.`} />
              <div className="mt-4">
                <Meter value={l.value} />
              </div>
            </div>
          ),
        })),
        ...interests.map<Entry>((i) => ({
          id: `int-${i.name}`,
          label: i.name,
          meta: '×1',
          desc: i.detail,
          title: 'Centre d’intérêt',
          code: 'ITEM',
          macro: <Summary over="Objet personnel" title={i.name} text={i.detail} />,
        })),
      ]

    case 'weapons':
      return hardSkills.map<Entry>((k, n) => ({
        id: `skill-${k.name}`,
        label: k.name,
        meta: `×${k.proofs.length}`,
        desc: k.detail,
        title: 'Arme technique',
        code: `WPN_${String(n + 1).padStart(2, '0')}`,
        hackable: k.proofs.length > 0,
        macro: (
          <div>
            <Summary over="Hard skill" title={k.name} text={k.detail} />
            <dl className="mt-4">
              <Field k="Preuves" v={`${k.proofs.length} réalisation(s) liée(s)`} />
            </dl>
          </div>
        ),
      }))

    case 'skills':
      return [
        ...softSkills.map<Entry>((k, n) => ({
          id: `skill-${k.name}`,
          label: k.name,
          meta: `×${k.proofs.length}`,
          desc: k.detail,
          title: 'Soft skill',
          code: `CHIP_${String(n + 1).padStart(2, '0')}`,
          hackable: true,
          macro: <Summary over="Compétence transversale" title={k.name} text={k.detail} />,
        })),
        {
          id: 'self',
          label: 'Bilan',
          meta: 'EVAL',
          desc: 'Auto-évaluation : points forts et axes de progression.',
          title: 'Auto-évaluation',
          code: 'EVAL',
          macro: (
            <div className="space-y-5">
              <div>
                <p className="label mb-2">Points forts</p>
                <SquareList items={selfAssessment.strengths} />
              </div>
              <div>
                <p className="label mb-2">Axes d'amélioration</p>
                <SquareList items={selfAssessment.improvements} />
              </div>
            </div>
          ),
        },
        {
          id: 'next',
          label: 'Perspectives',
          meta: 'NEXT',
          desc: 'Domaines d’intérêt et suite du parcours.',
          title: 'Perspectives',
          code: 'NEXT',
          macro: (
            <div>
              <p className="label mb-2">Domaines d'intérêt</p>
              <SquareList items={outlook.interests} />
              <p className="label mt-5 mb-2">Suite du parcours</p>
              <p className="leading-relaxed">{outlook.next}</p>
            </div>
          ),
        },
      ]

    case 'intel':
      return projects.map<Entry>((p, n) => ({
        id: p.id,
        label: p.title.split(' — ')[0],
        meta: `0${n + 1}`,
        desc: `${p.title} — ${p.period}`,
        title: `Archive 0${n + 1}`,
        code: p.code,
        hackable: true,
        macro: (
          <div>
            <Summary over={p.period} title={p.title} text={p.summary} tags={p.stack} />
            {p.image && (
              <div className="well mt-4 p-2">
                <img src={p.image.src} alt="" className="mx-auto max-h-44 w-auto opacity-85 grayscale sepia-[.45]" />
              </div>
            )}
          </div>
        ),
      }))

    case 'system':
      return [
        {
          id: 'profile',
          label: 'Profil',
          meta: 'ID',
          desc: 'Données d’identification de l’unité.',
          title: 'Unit Data',
          code: 'ID_01',
          macro: (
            <div>
              <p className="quest-title">{identity.name}</p>
              <dl className="mt-3 mb-4">
                <Field k="Statut" v={identity.role} />
                <Field k="Formation" v={identity.status} />
                <Field k="Campus" v={identity.unit} />
                <Field k="Objectif" v={identity.target} />
              </dl>
              <p className="leading-relaxed">{about.profile}</p>
            </div>
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
            <div className="space-y-4 leading-relaxed">
              <p>{about.motivation}</p>
              <p>{about.beyond}</p>
            </div>
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
            <div>
              <SquareList items={about.objectives} />
              <p className="label mt-5 leading-relaxed normal-case">
                Les fenêtres marquées [A] contiennent des données chiffrées : lancez le hacking pour y accéder.
              </p>
            </div>
          ),
        },
        {
          id: 'conclusion',
          label: 'Conclusion',
          meta: 'ID',
          desc: 'Bilan et suite du parcours.',
          title: 'Rapport',
          code: 'ID_04',
          macro: <p className="leading-relaxed">{about.conclusion}</p>,
        },
        {
          id: 'contact',
          label: 'Contact',
          meta: 'COMMS',
          desc: 'Ouvrir un canal de transmission.',
          title: 'Transmission',
          code: 'COMMS',
          onConfirm: () => (window.location.href = `mailto:${contact.email}`),
          macro: (
            <div>
              <dl className="mb-5">
                <Field k="Mail" v={contact.email} />
                <Field k="GitHub" v={contact.github.replace('https://', '')} />
                <Field k="Localisation" v={contact.location} />
              </dl>
              <div className="flex flex-wrap gap-2">
                <ActionButton href={`mailto:${contact.email}`}>Envoyer un mail</ActionButton>
                <ActionButton href={contact.github}>GitHub ↗</ActionButton>
              </div>
            </div>
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
            <div>
              <p className="mb-4 leading-relaxed">Version structurée du CV, générée à partir des données de ce portfolio.</p>
              <div className="flex flex-wrap gap-2">
                <ActionButton onClick={() => download('Louis_Leymonie_CV.md', cvMarkdown(), 'text/markdown')}>Markdown (.md)</ActionButton>
                <ActionButton onClick={() => download('Louis_Leymonie_CV.json', cvJson(), 'application/json')}>JSON (.json)</ActionButton>
              </div>
            </div>
          ),
        },
        {
          id: 'terminal',
          label: 'Terminal',
          meta: 'ROOT',
          desc: 'Accès root au système. Archives cachées. Touche [ ² ].',
          title: 'Terminal',
          code: 'ROOT',
          onConfirm: s.openTerminal,
          macro: (
            <div>
              <p className="mb-4 leading-relaxed">Terminal de maintenance. Certaines archives personnelles y sont chiffrées.</p>
              <ActionButton onClick={s.openTerminal}>Ouvrir le terminal</ActionButton>
            </div>
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
            <div className="divide-y divide-line/35">
              <Toggle label="Filtre CRT" on={s.crt} set={s.setCrt} />
              <Toggle label="Effets sonores" on={s.sound} set={s.setSound} />
            </div>
          ),
        },
      ]
  }
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
