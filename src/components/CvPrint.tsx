import { useLang } from '../i18n'

/* ------------------------------------------------------------------
   One-page résumé, built from profile.ts in the current language.
   Hidden on screen; when the page is printed (the home page's
   "CV (PDF)" button, or Ctrl+P) it replaces the menu, so "Save as
   PDF" gives a sober A4 résumé a recruiter can file.
   ------------------------------------------------------------------ */

export function CvPrint() {
  const { P, t } = useLang()
  const site = `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '')
  const projects = [...P.featured, ...P.projects.map((p) => p.id).filter((id) => !P.featured.includes(id))].map(
    (id) => P.projects.find((p) => p.id === id)!,
  )
  const school = P.education.filter((e) => e.group === 'school').slice(0, 3)
  const experience = P.experience.filter((e) => (e.group === 'lead' && e.id !== 'club3d') || e.group === 'job' || e.id === 'epimusic' || e.id === 'eloquence')
  const code = P.hardSkills.filter((s) => s.group === 'code').map((s) => s.name)
  const musicDiplomas = P.diplomas.filter((d) => d.group === 'music').length
  const tools = P.hardSkills.filter((s) => s.group === 'tool').map((s) => s.name)

  return (
    <article className="cv-print" aria-hidden>
      <header className="cv-head">
        <div>
          <h1>{P.identity.name}</h1>
          <p className="cv-role">{P.identity.role}</p>
          <p>{P.identity.headline}</p>
        </div>
        <ul className="cv-contact">
          <li>{P.contact.email}</li>
          <li>{P.contact.github.replace('https://', '')}</li>
          <li>{site.replace(/^https?:\/\//, '')}</li>
          <li>{P.contact.location}</li>
        </ul>
      </header>
      <p className="cv-seeking">{P.identity.seeking}</p>

      <div className="cv-cols">
        <div>
          <section>
            <h2>{t('Profil', 'Profile')}</h2>
            <p>{P.about.profile}</p>
          </section>

          <section>
            <h2>{t('Projets', 'Projects')}</h2>
            {projects.map((p) => (
              <div key={p.id} className="cv-item">
                <p className="cv-line">
                  <strong>{p.title}</strong>
                  <span>{p.period}</span>
                </p>
                <p>{p.summary}</p>
                {p.role[0] && <p className="cv-dim">{p.role[0]}</p>}
                <p className="cv-dim">{p.stack.join(' · ')}</p>
              </div>
            ))}
          </section>

          <section>
            <h2>{t('Expériences et engagements', 'Experience and commitments')}</h2>
            {experience.map((e) => (
              <div key={e.id} className="cv-item">
                <p className="cv-line">
                  <strong>
                    {e.title} — {e.place}
                  </strong>
                  <span>{e.period}</span>
                </p>
                <p>{e.summary}</p>
              </div>
            ))}
          </section>
        </div>

        <aside>
          <section>
            <h2>{t('Formation', 'Education')}</h2>
            {school.map((e) => (
              <div key={e.id} className="cv-item">
                <p>
                  <strong>{e.title}</strong>
                </p>
                <p className="cv-dim">
                  {e.place}, {e.period}
                </p>
              </div>
            ))}
          </section>

          <section>
            <h2>{t('Compétences', 'Skills')}</h2>
            <p>
              <strong>{t('Langages', 'Languages')} :</strong> {code.join(', ')}
            </p>
            <p>
              <strong>{t('Outils', 'Tools')} :</strong> {tools.join(', ')}
            </p>
            <p>
              <strong>{t('Transversales', 'Soft skills')} :</strong> {P.softSkills.slice(0, 6).map((s) => s.name).join(', ')}
            </p>
          </section>

          <section>
            <h2>{t('Langues', 'Languages')}</h2>
            <p>{P.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}</p>
          </section>

          <section>
            <h2>{t('Musique', 'Music')}</h2>
            <p>
              {P.music.school}, {P.music.years} {t('ans', 'years')}.
            </p>
            <p className="cv-dim">{P.music.tracks.map((x) => `${x.name} (${x.years} ${t('ans', 'yrs')})`).join(', ')}</p>
            <p className="cv-dim">{musicDiplomas} {t('diplômes de fin de cycle, dont félicitations du jury.', 'end-of-cycle diplomas, one with the jury’s congratulations.')}</p>
          </section>

          <section>
            <h2>{t('Centres d’intérêt', 'Interests')}</h2>
            <p>{P.interests.map((i) => i.name).join(' · ')}</p>
          </section>
        </aside>
      </div>
    </article>
  )
}
