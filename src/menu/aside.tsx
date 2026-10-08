import type { ReactNode } from 'react'
import { GlyphIcon } from '../components/icons'
import { Figures, PhotoTile, Tile } from '../components/Tile'
import { Tag } from '../components/ui'
import type { TabId } from '../data/profile'
import { useLang } from '../i18n'

/* ------------------------------------------------------------------
   Side tiles of the column tabs, side by side under the fiche: a
   summary of the area with a few figures, and one box of its own
   (right now, photos, stack, skills gained, contact…). Same soft
   boxes as the home page (see .aside-row in index.css).
   ------------------------------------------------------------------ */

const uniq = (xs: string[]) => [...new Set(xs)]

export function AsideTiles({ tab, show }: { tab: TabId; show: (id: string) => void }) {
  const { P, S, t } = useLang()
  const def = S.tabs.find((x) => x.id === tab)!
  const photo = (id: string) => P.gallery.find((g) => g.id === id)!
  const count = <X extends { group?: string }>(xs: X[], g: string) => `${xs.filter((x) => x.group === g).length}`
  const quests = P.experience.filter((e) => e.group === 'lead' || e.group === 'job' || e.group === 'speech' || e.group === 'contest')

  const figures: Partial<Record<TabId, [string, string][]>> = {
    path: [
      [count(P.education, 'school'), t('étapes', 'steps')],
      [count(P.diplomas, 'school'), t('diplômes', 'diplomas')],
      [`${P.languages.length}`, t('langues', 'languages')],
      ['2030', t('promo EPITA', 'EPITA class')],
    ],
    projects: [
      [`${P.projects.length}`, t('projets', 'projects')],
      [count(P.projects, 'team'), t('en équipe', 'in a team')],
      [count(P.hardSkills, 'code'), t('langages', 'languages')],
      [count(P.hardSkills, 'tool'), t('outils', 'tools')],
    ],
    music: [
      [`${P.music.years}`, t('ans de conservatoire', 'years of conservatoire')],
      [count(P.diplomas, 'music'), t('diplômes', 'diplomas')],
      [count(P.hardSkills, 'instrument'), t('instruments', 'instruments')],
      [count(P.experience, 'stage'), t('scènes', 'stages')],
    ],
    commitments: [
      [count(P.experience, 'lead'), t('responsabilités', 'responsibilities')],
      [count(P.experience, 'job'), t('stage & emplois', 'internship & jobs')],
      [count(P.experience, 'speech'), t('oral & théâtre', 'speech & theatre')],
      [count(P.experience, 'contest'), t('concours', 'contests')],
      [`${uniq(quests.flatMap((e) => e.skills)).length}`, t('compétences', 'skills')],
    ],
    life: [
      [count(P.interests, 'sport'), t('sports', 'sports')],
      [count(P.interests, 'passion'), t('passions', 'passions')],
      [`${P.gallery.length}`, t('photos', 'photos')],
    ],
    profile: [
      [`${P.keySkills.length}`, t('compétences clés', 'key competences')],
      [`${P.softSkills.length}`, 'soft skills'],
      [`${P.selfAssessment.strengths.length}`, t('points forts', 'strengths')],
      [`${P.languages.length}`, t('langues', 'languages')],
    ],
  }

  const extra: Partial<Record<TabId, ReactNode>> = {
    path: (
      <Tile n={3} head={t('En ce moment', 'Right now')} code={<span className="live">LIVE</span>} className="flex-1" pod={t('Données en temps réel. Dernière synchronisation : aujourd’hui.', 'Live data. Last sync: today.')}>
        <ul className="space-y-1">
          {P.now.map((x) => (
            <li key={x.k} className="flex items-center gap-3 py-1">
              <span className="now-icon">
                <GlyphIcon name={x.icon} className="h-[1.1rem] w-[1.1rem]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="label block">{x.k}</span>
                <span className="block leading-snug">{x.v}</span>
              </span>
            </li>
          ))}
        </ul>
      </Tile>
    ),
    projects: (
      <Tile n={3} head={t('Technologies croisées', 'Tech met along the way')} code={`×${uniq(P.projects.flatMap((p) => p.stack)).length}`} className="flex-1">
        <div className="flex flex-wrap content-start gap-1.5">
          {uniq(P.projects.flatMap((p) => p.stack)).map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </div>
      </Tile>
    ),
    music: <PhotoTile n={3} photo={photo('band')} className="min-h-44 flex-1" onClick={() => show('photo-band')} />,
    commitments: (
      <Tile n={3} head={t('Ce que j’en retire', 'What I took from it')} code="+XP" className="flex-1">
        <div className="flex flex-wrap content-start gap-1.5">
          {uniq(quests.flatMap((e) => e.skills)).map((x) => (
            <Tag key={x}>{x}</Tag>
          ))}
        </div>
      </Tile>
    ),
    life: (
      <div className="grid min-h-44 flex-1 grid-cols-2 gap-[inherit]">
        <PhotoTile n={3} photo={photo('dojo')} onClick={() => show('photo-dojo')} />
        <PhotoTile n={4} photo={photo('games')} onClick={() => show('photo-games')} />
      </div>
    ),
    profile: (
      <Tile n={3} head={t('Transmission', 'Transmission')} code="COMMS" className="flex-1" pod={t('Canal ouvert. Temps de réponse estimé : rapide.', 'Channel open. Estimated reply time: fast.')}>
        <div className="flex flex-col gap-1">
          <a className="now-row" href={`mailto:${P.contact.email}`}>
            <span className="now-icon">
              <GlyphIcon name="mail" className="h-[1.1rem] w-[1.1rem]" />
            </span>
            <span className="min-w-0 flex-1 truncate">{P.contact.email}</span>
          </a>
          <a className="now-row" href={P.contact.github} target="_blank" rel="noreferrer">
            <span className="now-icon">
              <GlyphIcon name="branch" className="h-[1.1rem] w-[1.1rem]" />
            </span>
            <span className="min-w-0 flex-1 truncate">github.com/CoolLyfe ↗</span>
          </a>
        </div>
        <a className="cta cta-main mt-4 self-start" href={P.contact.cv} target="_blank" rel="noreferrer">
          <GlyphIcon name="download" className="h-4 w-4" />
          {t('CV (PDF)', 'Résumé (PDF)')}
        </a>
      </Tile>
    ),
  }

  return (
    <>
      <div key={`${tab}-zone`} className="aside-slot">
        <Tile n={2} head={t('Aperçu', 'Overview')} className="flex-1" pod={def.pod}>
          <p className="leading-relaxed">{def.desc}</p>
          <Figures items={figures[tab] ?? []} className="figures-2 mt-5" />
        </Tile>
      </div>
      <div key={`${tab}-extra`} className="aside-slot">
        {extra[tab]}
      </div>
    </>
  )
}
