import type { T } from '../data/lang'
import type { Profile } from '../data/profile'

/** Structured CV as Markdown, built from profile.ts in the current language (no phone / address). */
export function cvMarkdown(P: Profile, t: T): string {
  const l: string[] = []
  l.push(`# ${P.identity.name}`, '', `**${P.identity.role}** — ${P.identity.status}`, '')
  l.push(`- Email : ${P.contact.email}`, `- GitHub : ${P.contact.github}`, `- ${t('Localisation', 'Location')} : ${P.contact.location}`, '')
  l.push(`## ${t('Profil', 'Profile')}`, '', P.about.profile, '')
  l.push(`## ${t('Formation', 'Education')}`, '')
  for (const e of P.education) l.push(`- **${e.period}** — ${e.title}, ${e.place}`)
  l.push('', `## ${t('Diplômes et certifications', 'Diplomas and certifications')}`, '')
  for (const d of P.diplomas) l.push(`- ${d.name}${d.grade ? ` — ${d.grade}` : ''}${d.year ? ` (${d.year})` : ''}`)
  l.push('', `## ${t('Musique', 'Music')}`, '', `${P.music.school} — ${P.music.years} ${t('ans', 'years')}.`, '')
  for (const x of P.music.tracks) l.push(`- ${x.name} : ${x.years} ${t('ans', 'years')} — ${x.note}`)
  l.push('', `## ${t('Expériences et engagements', 'Experience and commitments')}`, '')
  for (const e of P.experience) l.push(`- **${e.period}** — ${e.title} (${e.place}) : ${e.summary}`)
  l.push('', `## ${t('Projets', 'Projects')}`, '')
  for (const p of P.projects) l.push(`- **${p.title}** (${p.period}) — ${p.summary} [${p.stack.join(', ')}]`)
  l.push('', `## ${t('Compétences', 'Skills')}`, '')
  l.push(`- ${t('Techniques', 'Technical')} : ${P.hardSkills.filter((s) => s.group !== 'instrument').map((s) => s.name).join(', ')}`)
  l.push(`- Instruments : ${P.hardSkills.filter((s) => s.group === 'instrument').map((s) => s.name).join(', ')}`)
  l.push(`- ${t('Transversales', 'Soft skills')} : ${P.softSkills.map((s) => s.name).join(', ')}`)
  l.push(`- ${t('Langues', 'Languages')} : ${P.languages.map((x) => `${x.name} (${x.level})`).join(', ')}`)
  l.push('', `## ${t('Centres d’intérêt', 'Interests')}`, '', P.interests.map((i) => `${i.name} (${i.meta.toLowerCase()})`).join(' · '), '')
  return l.join('\n')
}

export function cvJson(P: Profile): string {
  return JSON.stringify(
    {
      identity: { name: P.identity.name, unit: P.identity.unit, role: P.identity.role, status: P.identity.status, target: P.identity.target },
      contact: P.contact,
      profile: P.about.profile,
      education: P.education.map(({ period, title, place }) => ({ period, title, place })),
      diplomas: P.diplomas.map(({ name, grade, year, issuer }) => ({ name, grade, year, issuer })),
      music: { school: P.music.school, years: P.music.years, tracks: P.music.tracks },
      experience: P.experience.map(({ period, title, place, summary }) => ({ period, title, place, summary })),
      projects: P.projects.map(({ title, period, summary, stack, links }) => ({ title, period, summary, stack, links })),
      skills: { hard: P.hardSkills.map((s) => s.name), soft: P.softSkills.map((s) => s.name) },
      languages: P.languages.map(({ name, level }) => ({ name, level })),
      interests: P.interests.map((i) => i.name),
    },
    null,
    2,
  )
}

/** Trigger a browser download of generated text. */
export function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
