import {
  about,
  contact,
  diplomas,
  education,
  experience,
  hardSkills,
  identity,
  interests,
  languages,
  music,
  projects,
  softSkills,
} from '../data/profile'

/** Structured CV as Markdown, built from profile.ts (no phone / address). */
export function cvMarkdown(): string {
  const l: string[] = []
  l.push(`# ${identity.name}`, '', `**${identity.role}** — ${identity.status}`, '')
  l.push(`- Email : ${contact.email}`, `- GitHub : ${contact.github}`, `- Localisation : ${contact.location}`, '')
  l.push('## Profil', '', about.profile, '')
  l.push('## Formation', '')
  for (const e of education) l.push(`- **${e.period}** — ${e.title}, ${e.place}`)
  l.push('', '## Diplômes et certifications', '')
  for (const d of diplomas) l.push(`- ${d.name}${d.grade ? ` — ${d.grade}` : ''}${d.year ? ` (${d.year})` : ''}`)
  l.push('', '## Musique', '', `${music.school} — ${music.years} ans.`, '')
  for (const t of music.tracks) l.push(`- ${t.name} : ${t.years} ans — ${t.note}`)
  l.push('', '## Expériences', '')
  for (const e of experience) l.push(`- **${e.period}** — ${e.title} (${e.place}) : ${e.summary}`)
  l.push('', '## Projets', '')
  for (const p of projects) l.push(`- **${p.title}** (${p.period}) — ${p.summary} [${p.stack.join(', ')}]`)
  l.push('', '## Compétences', '')
  l.push(`- Techniques : ${hardSkills.filter((s) => s.group !== 'instrument').map((s) => s.name).join(', ')}`)
  l.push(`- Instruments : ${hardSkills.filter((s) => s.group === 'instrument').map((s) => s.name).join(', ')}`)
  l.push(`- Transversales : ${softSkills.map((s) => s.name).join(', ')}`)
  l.push(`- Langues : ${languages.map((x) => `${x.name} (${x.level})`).join(', ')}`)
  l.push('', "## Centres d'intérêt", '', interests.map((i) => i.name).join(' · '), '')
  return l.join('\n')
}

export function cvJson(): string {
  return JSON.stringify(
    {
      identity,
      contact,
      profile: about.profile,
      education: education.map(({ period, title, place }) => ({ period, title, place })),
      diplomas: diplomas.map(({ name, grade, year, issuer }) => ({ name, grade, year, issuer })),
      music: { school: music.school, years: music.years, tracks: music.tracks },
      experience: experience.map(({ period, title, place, summary }) => ({ period, title, place, summary })),
      projects: projects.map(({ title, period, summary, stack, links }) => ({ title, period, summary, stack, links })),
      skills: { hard: hardSkills.map((s) => s.name), soft: softSkills.map((s) => s.name) },
      languages: languages.map(({ name, level }) => ({ name, level })),
      interests: interests.map((i) => i.name),
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
