import { MenuDetail } from '../components/MenuDetail'
import { Field, Frame, SectionTitle, SquareList, Tag, Txt } from '../components/ui'
import { projects } from '../data/profile'

type Blip = (k?: 'move' | 'select' | 'back') => void

/** INTEL — project list + detailed project sheet. */
export function Intel({
  selected,
  onSelect,
  blip,
}: {
  selected: number
  onSelect: (i: number) => void
  blip: Blip
}) {
  const p = projects[selected]

  return (
    <section>
      <SectionTitle title="INTEL" sub="Projets réalisés" />
      <MenuDetail
        entries={projects.map((pr, i) => ({ key: pr.id, label: pr.code, meta: String(i + 1).padStart(2, '0') }))}
        selected={selected}
        onSelect={onSelect}
        blip={blip}
      >
        <div className="space-y-5">
          <Frame label={`Dossier ${String(selected + 1).padStart(2, '0')} // ${p.period}`}>
            <h2 className="font-display text-2xl tracking-wide">{p.title}</h2>
            <dl className="mt-4">
              <Field k="Contexte" v={p.context} />
              <Field k="Objectif" v={p.objective} />
              <Field
                k="Technologies"
                v={
                  <div className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                }
              />
              {p.links && (
                <Field
                  k="Liens"
                  v={
                    <div className="flex flex-wrap gap-4">
                      {p.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-ash underline-offset-4 hover:bg-bone hover:text-ink"
                        >
                          ▸ {l.label}
                        </a>
                      ))}
                    </div>
                  }
                />
              )}
            </dl>
          </Frame>

          <div className="grid gap-5 xl:grid-cols-2">
            <Frame label="Rôle personnel">
              <SquareList items={p.role} />
            </Frame>
            <Frame label="Résultats">
              <SquareList items={p.results} />
            </Frame>
          </div>

          {p.image && (
            <Frame label="Preuve // capture">
              <figure>
                {/* light plate so transparent screenshots stay readable */}
                <div className="bg-bone p-3">
                  <img src={p.image.src} alt={p.image.caption} className="mx-auto max-h-96 w-auto" loading="lazy" />
                </div>
                <figcaption className="mt-2 text-sm text-ash">{p.image.caption}</figcaption>
              </figure>
            </Frame>
          )}

          <div className="grid gap-5 xl:grid-cols-2">
            <Frame label="Compétences mobilisées">
              <p className="mb-2 font-display text-xs tracking-[0.2em] text-ash">HARD SKILLS</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {p.hardSkills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
              <p className="mb-2 font-display text-xs tracking-[0.2em] text-ash">SOFT SKILLS</p>
              <div className="flex flex-wrap gap-2">
                {p.softSkills.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </Frame>
            <Frame label="Retour d'expérience">
              <p className="leading-relaxed">
                <Txt>{p.retrospective}</Txt>
              </p>
            </Frame>
          </div>
        </div>
      </MenuDetail>
    </section>
  )
}
