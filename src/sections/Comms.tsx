import { useState, type FormEvent } from 'react'
import { Field, Heading, Item, Split, Window, useListKeys, useUi } from '../components/ui'
import { contact, identity } from '../data/profile'

/** COMMS / CONTACT — channels + a transmission form (opens the mail client). */
export function Comms() {
  const [sel, setSel] = useState(0)
  const { blip } = useUi()
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const channels = [
    { label: 'Transmission', desc: 'Rédiger un message.' },
    { label: 'Mail', desc: contact.email, href: `mailto:${contact.email}` },
    { label: 'GitHub', desc: contact.github.replace('https://', ''), href: contact.github },
  ]
  useListKeys(channels.length, sel, setSel)

  const send = (e: FormEvent) => {
    e.preventDefault()
    blip('select')
    const q = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20')
    window.location.href = `mailto:${contact.email}?${q}`
  }

  const input =
    'w-full border border-line bg-bg px-3 py-2 font-mono text-fg placeholder:text-dim focus:border-fg focus:outline-none'

  return (
    <Split
      list={channels.map((c, i) => (
        <Item key={c.label} label={c.label} meta={`CH_0${i + 1}`} desc={c.desc} selected={i === sel} onClick={() => setSel(i)} />
      ))}
    >
      <div key={sel} className="boot-in">
        {sel === 0 ? (
          <Window title="Nouvelle transmission" code="TX_READY">
            <form onSubmit={send} className="space-y-4">
              <p className="label normal-case">Destinataire : {identity.name} &lt;{contact.email}&gt;</p>
              <label className="block">
                <span className="label mb-1 block">Objet</span>
                <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={input} placeholder="Proposition de stage…" />
              </label>
              <label className="block">
                <span className="label mb-1 block">Message</span>
                <textarea required rows={7} value={body} onChange={(e) => setBody(e.target.value)} className={input} placeholder="Bonjour Louis," />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-dim">Ouvre votre messagerie avec le message pré-rempli.</p>
                <button type="submit" className="item w-auto! border border-fg px-5!">
                  <span className="cur">[&gt;]</span>
                  <span className="sq" />
                  Émettre
                </button>
              </div>
            </form>
          </Window>
        ) : (
          <Window title={`Canal ${channels[sel].label}`} code={`CH_0${sel + 1}`}>
            <Heading code="SIGNAL OK">{channels[sel].label}</Heading>
            <dl className="mb-5">
              <Field k="Adresse" v={channels[sel].desc} />
              <Field k="Localisation" v={contact.location} />
            </dl>
            <a href={channels[sel].href} target="_blank" rel="noreferrer" className="item w-auto! border border-fg">
              <span className="cur">[&gt;]</span>
              <span className="sq" />
              Ouvrir le canal
            </a>
          </Window>
        )}
      </div>
    </Split>
  )
}
