import { useState } from 'react'
import { MenuDetail } from '../components/MenuDetail'
import { Field, Frame, SectionTitle, SquareList, Txt } from '../components/ui'
import { about, identity } from '../data/profile'

type Blip = (k?: 'move' | 'select' | 'back') => void

/** SYSTEM — introduction, objectives and conclusion of the portfolio. */
export function System({ blip }: { blip: Blip }) {
  const [sel, setSel] = useState(0)

  const entries = [
    { key: 'profile', label: 'PROFIL', meta: '01' },
    { key: 'goals', label: 'OBJECTIFS', meta: '02' },
    { key: 'guide', label: 'LECTURE', meta: '03' },
    { key: 'end', label: 'CONCLUSION', meta: '04' },
  ]

  const panels = [
    <Frame key="p" label="Données d'identification">
      <dl className="mb-5">
        <Field k="Nom" v={identity.name} />
        <Field k="Alias" v={identity.handle} />
        <Field k="Formation" v={identity.role} />
        <Field k="Statut" v={identity.status} />
        <Field k="Lieu" v={<Txt>{identity.location}</Txt>} />
      </dl>
      <div className="space-y-3 leading-relaxed">
        {about.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>
          <Txt>{about.motivations}</Txt>
        </p>
      </div>
    </Frame>,
    <Frame key="g" label="Objectifs de ce portfolio">
      <SquareList items={about.objectives} />
    </Frame>,
    <Frame key="r" label="Guide de lecture">
      <p className="leading-relaxed">{about.readingGuide}</p>
    </Frame>,
    <Frame key="c" label="Conclusion">
      <p className="leading-relaxed">{about.conclusion}</p>
    </Frame>,
  ]

  return (
    <section>
      <SectionTitle title="SYSTEM" sub="Identité // Introduction" />
      <MenuDetail entries={entries} selected={sel} onSelect={setSel} blip={blip}>
        {panels[sel]}
      </MenuDetail>
    </section>
  )
}
