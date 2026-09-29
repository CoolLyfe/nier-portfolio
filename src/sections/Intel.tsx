import { useCallback, useState } from 'react'
import { Card } from '../components/Expanded'
import { Item, Split, useListKeys } from '../components/ui'
import { projects } from '../data/profile'

/** INTEL / PROJECTS — list + grid of macro cards; open → micro view. */
export function Intel({ onOpen }: { onOpen: (id: string) => void }) {
  const [sel, setSel] = useState(0)
  const open = useCallback((i: number) => onOpen(projects[i].id), [onOpen])
  useListKeys(projects.length, sel, setSel, open)

  return (
    <Split
      list={projects.map((p, i) => (
        <Item
          key={p.id}
          label={p.code}
          meta={`0${i + 1}`}
          desc={`${p.title} — ${p.summary}`}
          selected={i === sel}
          onHover={() => setSel(i)}
          onClick={() => open(i)}
        />
      ))}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Card
            key={p.id}
            id={p.id}
            code={`ARCHIVE_0${i + 1} // ${p.code}`}
            title={p.title}
            summary={p.summary}
            tags={p.stack}
            selected={i === sel}
            desc={`${p.period} — ${p.summary} [Entrée] pour ouvrir.`}
            onHover={() => setSel(i)}
            onOpen={() => open(i)}
          />
        ))}
      </div>
    </Split>
  )
}
