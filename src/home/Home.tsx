import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { GlyphIcon, TabIcon } from '../components/icons'
import { PhotoFrame } from '../components/Photo'
import { usePod } from '../components/Pod'
import { useUi } from '../components/ui'
import type { Photo, TabId } from '../data/profile'
import { useLang } from '../i18n'

/* ------------------------------------------------------------------
   HOME: the first screen. A mosaic of boxes of different sizes: who I
   am, what I'm doing right now, photos of what I love, and a way into
   every area. Box placement lives in index.css (.bento areas).
   ------------------------------------------------------------------ */

export function Home({ go }: { go: (tab: TabId) => void }) {
  const { P, S, t } = useLang()
  const photo = (id: string) => P.gallery.find((g) => g.id === id)!
  const counts: Partial<Record<TabId, string>> = {
    path: `${P.education.filter((e) => e.group === 'school').length} ${t('étapes', 'steps')}`,
    projects: `${P.projects.length} ${t('projets', 'projects')}`,
    music: `${P.music.years} ${t('ans', 'yrs')}`,
    commitments: `${P.experience.filter((e) => e.group !== 'stage').length} ${t('quêtes', 'quests')}`,
    life: `${P.interests.length} ${t('passions', 'passions')}`,
    profile: `${P.softSkills.length} skills`,
  }
  const figures: [string, string][] = [
    [`${P.music.years}`, t('ans de musique', 'years of music')],
    [`${P.projects.length}`, t('projets documentés', 'documented projects')],
    ['6', t('ans d’aïkido', 'years of aikido')],
    [`${P.languages.length}`, t('langues', 'languages')],
  ]

  return (
    <div className="bento">
      {/* ---- identity ---- */}
      <Tile
        area="id"
        n={0}
        head={t('Données de l’unité', 'Unit data')}
        code="UNIT_LL"
        pod={t('Unité Louis Leymonie. Statut : opérationnel. Humeur : curieuse.', 'Unit Louis Leymonie. Status: operational. Mood: curious.')}
        onClick={() => go('profile')}
      >
        <div className="flex items-center gap-6 max-sm:flex-col max-sm:items-start">
          <Portrait photo={photo('portrait')} />
          <div className="min-w-0 flex-1">
            <p className="label">{P.identity.unit}</p>
            <h2 className="home-name mt-1">{P.identity.name}</h2>
            <p className="mt-1 text-dim">{P.identity.role}</p>
            <p className="mt-3 max-w-[38rem] leading-relaxed">{P.identity.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {P.identity.facets.map((f) => (
                <span key={f} className="facet">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
        <dl className="figures mt-5">
          {figures.map(([v, k]) => (
            <div key={k}>
              <dd>{v}</dd>
              <dt>{k}</dt>
            </div>
          ))}
        </dl>
      </Tile>

      {/* ---- right now ---- */}
      <Tile area="now" n={1} head={t('En ce moment', 'Right now')} code={<span className="live">LIVE</span>} pod={t('Données en temps réel. Dernière synchronisation : aujourd’hui.', 'Live data. Last sync: today.')}>
        <ul className="space-y-1">
          {P.now.map((x) => (
            <li key={x.k}>
              <button type="button" className="now-row" onClick={() => go(x.to)}>
                <span className="now-icon">
                  <GlyphIcon name={x.icon} className="h-[1.1rem] w-[1.1rem]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="label block">{x.k}</span>
                  <span className="block leading-snug">{x.v}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="label mt-3 flex items-center gap-2">
          <GlyphIcon name="pin" className="h-3.5 w-3.5" />
          {P.identity.location}
        </p>
      </Tile>

      {/* ---- photos ---- */}
      <PhotoTile area="p1" n={2} photo={photo('stage')} onClick={() => go('music')} />
      <PhotoTile area="p2" n={4} photo={photo('dojo')} onClick={() => go('life')} />
      <PhotoTile area="p3" n={5} photo={photo('kitchen')} onClick={() => go('life')} />
      <PhotoTile area="p4" n={6} photo={photo('games')} onClick={() => go('life')} />

      {/* ---- every area ---- */}
      <Tile area="nav" n={3} head={t('Explorer', 'Explore')} code={`${S.tabs.length - 1} ${t('zones', 'areas')}`}>
        <ul className="space-y-1">
          {S.tabs
            .filter((x) => x.id !== 'home')
            .map((x) => (
              <li key={x.id}>
                <NavRow id={x.id} label={x.label} sub={x.desc} meta={counts[x.id]} pod={x.pod} onClick={() => go(x.id)} />
              </li>
            ))}
        </ul>
      </Tile>

      {/* ---- contact ---- */}
      <Tile area="ct" n={7} head={t('Transmission', 'Transmission')} code="COMMS" pod={t('Canal ouvert. Un stage ? Un groupe ? Une recette ? Tout est recevable.', 'Channel open. An internship? A band? A recipe? All accepted.')}>
        <div className="flex h-full flex-col gap-1">
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
      </Tile>
    </div>
  )
}

/** Staggered soft entrance; skipped entirely when the visitor prefers reduced motion. */
function useEnter(n: number) {
  const still = useReducedMotion()
  return {
    initial: still ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.08 + n * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }
}

/** A bento box: soft entrance, header strip, Pod comment on hover. */
function Tile({
  area,
  n,
  head,
  code,
  pod,
  onClick,
  children,
}: {
  area: string
  n: number
  head: string
  code?: ReactNode
  pod?: string
  onClick?: () => void
  children: ReactNode
}) {
  const { say } = usePod()
  const { blip } = useUi()
  const enter = useEnter(n)
  return (
    <motion.section
      className="tile"
      style={{ gridArea: area }}
      {...enter}
      onPointerEnter={() => say(pod)}
    >
      <header className="tile-head">
        {onClick ? (
          <button
            type="button"
            className="tile-link"
            onClick={() => {
              blip('select')
              onClick()
            }}
          >
            {head}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <span>{head}</span>
        )}
        {code && <span className="ml-auto text-[0.75rem] opacity-80">{code}</span>}
      </header>
      <div className="tile-body">{children}</div>
    </motion.section>
  )
}

function PhotoTile({ area, n, photo, onClick }: { area: string; n: number; photo: Photo; onClick: () => void }) {
  const { say } = usePod()
  const { blip } = useUi()
  const { t } = useLang()
  const enter = useEnter(n)
  return (
    <motion.button
      type="button"
      className="tile tile-photo"
      style={{ gridArea: area }}
      {...enter}
      onPointerEnter={() => say(photo.pod ?? (photo.src ? undefined : t('Archive visuelle en attente de transfert. L’unité doit encore fournir la photo.', 'Visual archive awaiting transfer. The unit still has to provide the picture.')))}
      onClick={() => {
        blip('select')
        onClick()
      }}
    >
      <PhotoFrame photo={photo} className="h-full w-full" />
    </motion.button>
  )
}

function NavRow({ id, label, sub, meta, pod, onClick }: { id: TabId; label: string; sub: string; meta?: string; pod: string; onClick: () => void }) {
  const { say } = usePod()
  const { blip, setDesc } = useUi()
  return (
    <button
      type="button"
      className="nav-row"
      onPointerEnter={() => {
        say(pod)
        setDesc(sub)
      }}
      onFocus={() => setDesc(sub)}
      onClick={() => {
        blip('select')
        onClick()
      }}
    >
      <span className="pod" aria-hidden />
      <TabIcon id={id} />
      <span className="flex-1 truncate">{label}</span>
      {meta && <span className="text-[0.78rem] opacity-75">{meta}</span>}
    </button>
  )
}

/** Round portrait in orbit rings; a placeholder until the photo arrives. */
function Portrait({ photo }: { photo: Photo }) {
  return (
    <div className="portrait">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" fill="none" stroke="currentColor" aria-hidden>
        <circle cx="50" cy="50" r="49" strokeWidth="0.5" strokeDasharray="1 3" className="spin-slow" />
        <path d="M50 1a49 49 0 0 1 49 49" strokeWidth="1.4" className="spin-rev" />
        <circle cx="50" cy="50" r="43" strokeWidth="0.4" />
      </svg>
      <div className="portrait-in">
        {photo.src ? <img src={photo.src} alt={photo.caption} /> : <GlyphIcon name={photo.icon} className="h-1/2 w-1/2 opacity-80" />}
      </div>
    </div>
  )
}
