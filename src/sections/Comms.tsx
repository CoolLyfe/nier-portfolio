import { useState, type FormEvent } from 'react'
import { Frame, SectionTitle, isTodo } from '../components/ui'
import { contact } from '../data/profile'

type Blip = (k?: 'move' | 'select' | 'back') => void

/** COMMS — direct channels + a "transmission" form that opens the mail client. */
export function Comms({ blip }: { blip: Blip }) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const channels = [
    { id: 'MAIL', value: contact.email, href: `mailto:${contact.email}` },
    { id: 'GITHUB', value: contact.github.replace('https://', ''), href: contact.github },
    { id: 'LINKEDIN', value: contact.linkedin, href: contact.linkedin },
  ]

  const send = (e: FormEvent) => {
    e.preventDefault()
    blip('select')
    const q = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20')
    window.location.href = `mailto:${contact.email}?${q}`
  }

  const input =
    'w-full border border-line bg-ink px-3 py-2 font-mono text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none'

  return (
    <section>
      <SectionTitle title="COMMS" sub="Canal de transmission" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Frame label="Canaux ouverts">
          <ul className="space-y-1">
            {channels.map((c) =>
              isTodo(c.value) ? (
                <li key={c.id} className="flex items-center gap-3 px-3 py-2.5 text-alert">
                  <span className="h-2 w-2 border border-alert" />
                  <span className="w-24 font-display tracking-[0.2em]">{c.id}</span>
                  <span className="text-sm">[ SIGNAL ABSENT : {c.value.slice(5).trim()} ]</span>
                </li>
              ) : (
                <li key={c.id}>
                  <a href={c.href} target="_blank" rel="noreferrer" className="nier-item" onClick={() => blip('select')}>
                    <span className="nier-square" />
                    <span className="w-24 font-display tracking-[0.2em]">{c.id}</span>
                    <span className="truncate text-sm">{c.value}</span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </Frame>

        <Frame label="Nouvelle transmission">
          <form onSubmit={send} className="space-y-4">
            <label className="block">
              <span className="mb-1 block font-display text-xs tracking-[0.2em] text-ash">OBJET</span>
              <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={input} placeholder="Proposition de stage…" />
            </label>
            <label className="block">
              <span className="mb-1 block font-display text-xs tracking-[0.2em] text-ash">MESSAGE</span>
              <textarea required rows={6} value={body} onChange={(e) => setBody(e.target.value)} className={input} placeholder="Bonjour Louis," />
            </label>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-ash">Ouvre votre messagerie avec le message pré-rempli.</p>
              <button type="submit" className="nier-item w-auto! border border-bone px-5! font-display tracking-[0.25em] before:hidden!">
                <span className="nier-square" />
                ÉMETTRE
              </button>
            </div>
          </form>
        </Frame>
      </div>
    </section>
  )
}
