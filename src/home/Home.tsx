import { GlyphIcon, TabIcon } from '../components/icons'
import { usePod } from '../components/Pod'
import { PhotoTile, Tile } from '../components/Tile'
import { useUi } from '../components/ui'
import type { Photo, TabId } from '../data/profile'
import { useLang } from '../i18n'

/* ------------------------------------------------------------------
   HOME: the cover of the portfolio. Few words, lots of room, and it
   fits on one screen (from tablet width up): who I am, three photos
   of what I love, and a door into every area. The details live in
   the tabs. Box placement lives in index.css (.bento areas).
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

  return (
    <div className="bento">
      {/* ---- identity: the cover itself ---- */}
      <Tile
        area="id"
        n={0}
        head={t('Données de l’unité', 'Unit data')}
        code="UNIT_LL"
        className="tile-cover"
        pod={t('Unité Louis Leymonie. Statut : opérationnel. Humeur : curieuse.', 'Unit Louis Leymonie. Status: operational. Mood: curious.')}
        onClick={() => go('profile')}
      >
        <div className="flex flex-1 items-center gap-[clamp(1.5rem,4vw,3.5rem)] max-sm:flex-col max-sm:items-start">
          <Portrait photo={photo('portrait')} />
          <div className="min-w-0 flex-1">
            <p className="label">{P.identity.unit}</p>
            <p className="greeting mt-4">{t('Bonjour, je suis', 'Hello, I’m')}</p>
            <h2 className="home-name">{P.identity.name}</h2>
            <p className="mt-2 text-[1.05rem]">{P.identity.role}</p>
            <p className="seeking mt-5">
              <span className="live" aria-hidden />
              {P.identity.seeking}
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <a className="cta cta-main" href={P.contact.cv} target="_blank" rel="noreferrer">
                <GlyphIcon name="download" className="h-4 w-4" />
                {t('CV (PDF)', 'Résumé (PDF)')}
              </a>
              <a className="cta" href={P.contact.github} target="_blank" rel="noreferrer">
                <GlyphIcon name="branch" className="h-4 w-4" />
                GitHub
              </a>
              <a className="cta" href={`mailto:${P.contact.email}`}>
                <GlyphIcon name="mail" className="h-4 w-4" />
                {t('Me contacter', 'Get in touch')}
              </a>
            </div>
          </div>
        </div>
      </Tile>

      {/* ---- what I love ---- */}
      <PhotoTile area="p1" n={1} photo={photo('stage')} onClick={() => go('music')} />
      <PhotoTile area="p2" n={2} photo={photo('plane')} onClick={() => go('life')} />
      <PhotoTile area="p3" n={3} photo={photo('museum')} onClick={() => go('music')} />

      {/* ---- a door into every area ---- */}
      <Tile area="nav" n={4} head={t('Explorer', 'Explore')} code={`${S.tabs.length - 1} ${t('zones', 'areas')}`}>
        <ul className="doors">
          {S.tabs
            .filter((x) => x.id !== 'home')
            .map((x) => (
              <li key={x.id}>
                <Door id={x.id} label={x.label} sub={x.desc} meta={counts[x.id]} pod={x.pod} onClick={() => go(x.id)} />
              </li>
            ))}
        </ul>
      </Tile>
    </div>
  )
}

function Door({ id, label, sub, meta, pod, onClick }: { id: TabId; label: string; sub: string; meta?: string; pod: string; onClick: () => void }) {
  const { say } = usePod()
  const { blip, setDesc } = useUi()
  return (
    <button
      type="button"
      className="nav-row door"
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
      {meta && <span className="door-meta text-[0.78rem] opacity-75">{meta}</span>}
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
