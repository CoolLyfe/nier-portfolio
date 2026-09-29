import { useState } from 'react'
import { Field, Heading, Item, Meter, Split, SquareList, Window, useListKeys } from '../components/ui'
import { about, identity, interests, languages } from '../data/profile'

/** SYSTEM / ABOUT — identity, motivation, languages, interests. */
export function System() {
  const [sel, setSel] = useState(0)
  useListKeys(6, sel, setSel)

  const entries = [
    { label: 'Profil', desc: 'Données d’identification de l’unité.' },
    { label: 'Motivation', desc: 'Orientation professionnelle visée.' },
    { label: 'Langues', desc: 'Modules linguistiques installés.' },
    { label: 'Centres d’intérêt', desc: 'Activités hors service.' },
    { label: 'Objectifs', desc: 'Pourquoi ce portfolio existe.' },
    { label: 'Conclusion', desc: 'Bilan et suite du parcours.' },
  ]

  const panels = [
    <Window key="0" title="Identification" code="ID_01">
      <Heading code="UNIT DATA">{identity.name}</Heading>
      <dl className="mb-5">
        <Field k="Statut" v={identity.role} />
        <Field k="Formation" v={identity.status} />
        <Field k="Campus" v={identity.unit} />
        <Field k="Localisation" v={identity.location} />
        <Field k="Objectif" v={identity.target} />
      </dl>
      <p className="leading-relaxed">{about.profile}</p>
    </Window>,
    <Window key="1" title="Motivation" code="ID_02">
      <Heading>Orientation</Heading>
      <div className="space-y-4 leading-relaxed">
        <p>{about.motivation}</p>
        <p>{about.beyond}</p>
      </div>
    </Window>,
    <Window key="2" title="Langues" code="ID_03">
      <Heading>Modules linguistiques</Heading>
      <div className="divide-y divide-line/70">
        {languages.map((l) => (
          <div key={l.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <span className="font-display tracking-[0.15em] uppercase">{l.name}</span>
            <span className="flex items-center gap-4">
              <Meter value={l.value} />
              <span className="w-14 text-right font-display text-beige">{l.level}</span>
            </span>
          </div>
        ))}
      </div>
    </Window>,
    <Window key="3" title="Centres d'intérêt" code="ID_04">
      <Heading>Hors service</Heading>
      <div className="grid gap-px bg-line sm:grid-cols-2">
        {interests.map((i) => (
          <div key={i.name} className="bg-panel p-3">
            <p className="font-display tracking-[0.15em] uppercase">{i.name}</p>
            <p className="mt-1 text-sm text-beige">{i.detail}</p>
          </div>
        ))}
      </div>
    </Window>,
    <Window key="4" title="Objectifs du portfolio" code="ID_05">
      <Heading>Directives</Heading>
      <SquareList items={about.objectives} />
      <p className="label mt-6 leading-relaxed normal-case">
        INTEL : projets — LOGS : parcours, expériences et compétences — COMMS : contact. Chaque compétence renvoie à sa preuve.
      </p>
    </Window>,
    <Window key="5" title="Conclusion" code="ID_06">
      <Heading>Rapport</Heading>
      <p className="leading-relaxed">{about.conclusion}</p>
    </Window>,
  ]

  return (
    <Split
      list={entries.map((e, i) => (
        <Item key={e.label} label={e.label} meta={`0${i + 1}`} desc={e.desc} selected={i === sel} onClick={() => setSel(i)} />
      ))}
    >
      <div key={sel} className="boot-in">
        {panels[sel]}
      </div>
    </Split>
  )
}
