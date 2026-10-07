import { GlyphIcon, TabIcon } from '../components/icons'
import { usePod } from '../components/Pod'
import { Figures, PhotoTile, Tile } from '../components/Tile'
import { useUi } from '../components/ui'
import type { Photo, TabId } from '../data/profile'
import { useLang } from '../i18n'
import { findProof } from '../menu/tabs'

/* ------------------------------------------------------------------
   HOME: the first screen. A mosaic of boxes of different sizes: who I
   am and what I'm looking for, what sets me apart, featured projects,
   what I'm doing right now, photos of what I love, and a way into
   every area. Box placement lives in index.css (.bento areas).
   ------------------------------------------------------------------ */

/** Entry ids that count as positions of responsibility. */
const RESPONSIBILITIES = ['epimusic', 'bdl', 'tutorat']

export function Home({ go, show }: { go: (tab: TabId) => void; show: (id: string) => void }) {
  const { P, S, t } = useLang()
  const { say } = usePod()
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
    [`${P.projects.length}`, t('projets documentés', 'documented projects')],
    [`${P.hardSkills.filter((s) => s.group !== 'instrument').length}`, t('langages et outils', 'languages and tools')],
    [`${RESPONSIBILITIES.length}`, t('rôles à responsabilité', 'leadership roles')],
    [`${P.music.years}`, t('ans de conservatoire', 'years at the conservatoire')],
  ]
  const featured = P.featured.map((id) => P.projects.find((p) => p.id === id)!)

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
        <div className="flex items-center gap-8 max-sm:flex-col max-sm:items-start">
          <Portrait photo={photo('portrait')} />
          <div className="min-w-0 flex-1">
            <p className="label">{P.identity.unit}</p>
            <p className="greeting mt-3">{t('Bonjour, je suis', 'Hello, I’m')}</p>
            <h2 className="home-name">{P.identity.name}</h2>
            <p className="mt-1">{P.identity.role}</p>
            <p className="mt-0.5 text-dim">{P.identity.headline}</p>
            <p className="seeking mt-3">
              <span className="live" aria-hidden />
              {P.identity.seeking}
            </p>
            <p className="mt-3 max-w-[40rem] leading-relaxed">{P.identity.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {P.identity.facets.map((f) => (
                <span key={f} className="facet">
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="cta cta-main" onClick={() => window.print()}>
                <GlyphIcon name="download" className="h-4 w-4" />
                {t('CV (PDF)', 'Résumé (PDF)')}
              </button>
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
        <Figures items={figures} className="mt-7" />
      </Tile>

      {/* ---- right now ---- */}
      <Tile area="now" n={1} head={t('En ce moment', 'Right now')} code={<span className="live">LIVE</span>} pod={t('Données en temps réel. Dernière synchronisation : aujourd’hui.', 'Live data. Last sync: today.')}>
        <ul className="space-y-2.5">
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
        <div className="welcome mt-6">
          <p className="leading-relaxed">
            {t('Bienvenue, et merci de passer par ici. Prenez votre temps : chaque case mène quelque part.', 'Welcome, and thanks for stopping by. Take your time: every box leads somewhere.')}
          </p>
          <p className="label mt-2 flex items-center gap-2">
            <GlyphIcon name="pin" className="h-3.5 w-3.5" />
            {P.identity.location}
          </p>
        </div>
      </Tile>

      {/* ---- what sets me apart ---- */}
      <Tile area="as" n={2} head={t('Atouts', 'Strengths')} code="+α" pod={t('Analyse comparative : profil au-delà de la moyenne. Chaque atout est vérifiable.', 'Comparative analysis: above-average profile. Every strength can be checked.')}>
        <ul className="strengths">
          {P.strengths.map((x) => (
            <li key={x.id}>
              <span className="now-icon">
                <GlyphIcon name={x.icon} className="h-[1.1rem] w-[1.1rem]" />
              </span>
              <div className="min-w-0">
                <p className="font-medium">{x.title}</p>
                <p className="mt-0.5 text-[0.9rem] leading-snug text-dim">{x.text}</p>
                <p className="mt-1.5 flex flex-wrap gap-1">
                  {x.proofs.map((id) => (
                    <button key={id} type="button" className="proof" onClick={() => show(id)}>
                      {findProof(P, id)?.label ?? id}
                    </button>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Tile>

      {/* ---- featured projects ---- */}
      <Tile area="fp" n={3} head={t('Projets phares', 'Featured projects')} onClick={() => go('projects')} code={`${P.projects.length} ${t('au total', 'in total')}`}>
        <ul className="space-y-1">
          {featured.map((p) => (
            <li key={p.id}>
              <button type="button" className="now-row items-start!" onClick={() => show(p.id)} onPointerEnter={() => p.pod && say(p.pod)}>
                <span className="project-code">{p.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block leading-snug">{p.summary}</span>
                  <span className="label mt-1 block">
                    {p.stack.slice(0, 3).join(' · ')} — {p.group === 'team' ? t('équipe', 'team') : t('solo', 'solo')}
                  </span>
                </span>
                <span aria-hidden className="self-center opacity-70">→</span>
              </button>
            </li>
          ))}
        </ul>
      </Tile>

      {/* ---- photos ---- */}
      <PhotoTile area="p1" n={4} photo={photo('stage')} onClick={() => go('music')} />
      <PhotoTile area="p2" n={6} photo={photo('dojo')} onClick={() => go('life')} />
      <PhotoTile area="p3" n={7} photo={photo('kitchen')} onClick={() => go('life')} />
      <PhotoTile area="p4" n={8} photo={photo('games')} onClick={() => go('life')} />

      {/* ---- every area ---- */}
      <Tile area="nav" n={5} head={t('Explorer', 'Explore')} code={`${S.tabs.length - 1} ${t('zones', 'areas')}`}>
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
      <Tile area="ct" n={9} head={t('Transmission', 'Transmission')} code="COMMS" pod={t('Canal ouvert. Une question ? Un groupe ? Une recette ? Tout est recevable.', 'Channel open. A question? A band? A recipe? All accepted.')}>
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
