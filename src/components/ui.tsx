import type { ReactNode } from 'react'

/* Small shared building blocks for the NieR-style UI. */

export const isTodo = (s: string) => s.startsWith('TODO:')

/** Renders text, or a red "missing data" flag when the value is a TODO. */
export function Txt({ children }: { children: string }) {
  if (!isTodo(children)) return <>{children}</>
  return (
    <span
      className="inline-block border border-dashed border-alert px-1.5 text-alert"
      title={children.slice(5).trim()}
    >
      [ DONNÉE MANQUANTE : {children.slice(5).trim()} ]
    </span>
  )
}

/** Panel with thin border and corner brackets. */
export function Frame({
  children,
  className = '',
  label,
}: {
  children: ReactNode
  className?: string
  label?: string
}) {
  return (
    <div className={`frame bg-ink-2/70 ${className}`}>
      {label && (
        <div className="flex items-center gap-2 border-b border-line px-4 py-1.5 font-display text-xs tracking-[0.2em] text-ash uppercase">
          <span className="inline-block h-1.5 w-1.5 bg-ash" />
          {label}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}

/** Big section heading: "INTEL" + subtitle + ruled line. */
export function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="mb-6">
      <div className="flex items-end gap-4">
        <h1 className="font-display text-4xl tracking-[0.15em] sm:text-5xl">{title}</h1>
        <span className="mb-1.5 hidden font-display text-xs tracking-[0.25em] text-ash uppercase sm:inline">
          {sub}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-bone/60" />
        <span className="h-1.5 w-1.5 bg-bone" />
        <span className="h-1.5 w-1.5 bg-bone/50" />
        <span className="h-1.5 w-1.5 bg-bone/25" />
      </div>
      <p className="mt-2 font-display text-xs tracking-[0.2em] text-ash uppercase sm:hidden">{sub}</p>
    </header>
  )
}

/** Label/value row like the game's stat sheets. */
export function Field({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-line/60 py-2 last:border-0 max-sm:grid-cols-1 max-sm:gap-0.5">
      <dt className="font-display text-xs tracking-[0.18em] text-ash uppercase">{k}</dt>
      <dd>{v}</dd>
    </div>
  )
}

/** Bullet list with square markers. */
export function SquareList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span className="mt-[0.55em] h-1.5 w-1.5 flex-none bg-ash" />
          <span>
            <Txt>{it}</Txt>
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-line px-2 py-0.5 font-display text-xs tracking-wider text-bone/90">
      {children}
    </span>
  )
}
