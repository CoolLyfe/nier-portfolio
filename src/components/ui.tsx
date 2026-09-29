import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/* ------------------------------------------------------------------
   Shared UI primitives for the YoRHa menu.
   ------------------------------------------------------------------ */

export type Blip = (kind?: 'move' | 'select' | 'back') => void

/** App-wide services: sound + the bottom description strip. */
export const UiContext = createContext<{ blip: Blip; setDesc: (s: string) => void }>({
  blip: () => {},
  setDesc: () => {},
})
export const useUi = () => useContext(UiContext)

/** Cut-corner window: 1px bevelled frame, "+" ticks, optional title strip. */
export function Window({
  title,
  code,
  children,
  className = '',
  bodyClass = 'p-4 sm:p-5',
}: {
  title?: string
  code?: string
  children: ReactNode
  className?: string
  bodyClass?: string
}) {
  return (
    <div className={`win ${className}`}>
      <div className="win-edge bevel h-full">
        <div className="win-body h-full">
          {title && (
            <div className="flex items-center gap-2 bg-head px-4 py-1.5 pl-6">
              <span className="h-2 w-2 bg-fg" />
              <span className="label text-fg!">{title}</span>
              {code && <span className="label ml-auto">{code}</span>}
            </div>
          )}
          <div className={bodyClass}>{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Menu row with the in-game cursor: "[ > ]" appears, colours invert.
 * Reports its description to the bottom strip on hover/focus.
 */
export function Item({
  label,
  meta,
  desc,
  selected,
  onClick,
  onHover,
}: {
  label: string
  meta?: string
  desc?: string
  selected?: boolean
  onClick?: () => void
  onHover?: () => void
}) {
  const { blip, setDesc } = useUi()
  const [flash, setFlash] = useState(false)

  const enter = () => {
    if (desc) setDesc(desc)
    if (!selected) blip('move')
    onHover?.()
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={!!selected}
      onMouseEnter={enter}
      onFocus={() => desc && setDesc(desc)}
      onClick={() => {
        setFlash(true)
        blip('select')
        onClick?.()
      }}
      onAnimationEnd={() => setFlash(false)}
      className={`item ${flash ? 'flash' : ''}`}
    >
      <span className="cur">[&gt;]</span>
      <span className="sq" />
      <span className="flex-1 truncate">{label}</span>
      {meta && <span className="text-[10px] tracking-wider opacity-60">{meta}</span>}
    </button>
  )
}

/**
 * ↑/↓ move the cursor through a list, Enter activates.
 * Ignored while typing in a field or while a window is expanded.
 */
export function useListKeys(count: number, sel: number, setSel: (i: number) => void, onEnter?: (i: number) => void) {
  const { blip } = useUi()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [data-modal]') || document.querySelector('[data-modal]')) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setSel((sel + (e.key === 'ArrowDown' ? 1 : -1) + count) % count)
        blip('move')
      } else if (e.key === 'Enter' && onEnter && !(t instanceof HTMLButtonElement)) {
        blip('select')
        onEnter(sel)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, sel, setSel, onEnter, blip])
}

/** Two-column system layout: item list | content. Stacks on mobile. */
export function Split({ list, children }: { list: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)] md:gap-8">
      <div role="listbox" className="space-y-1.5">
        {list}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-line px-2 py-0.5 font-display text-[11px] tracking-wider text-beige uppercase">
      {children}
    </span>
  )
}

export function SquareList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex gap-3 leading-relaxed">
          <span className="mt-[0.6em] h-1.5 w-1.5 flex-none bg-beige" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

export function Field({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 border-b border-line/70 py-2.5 last:border-0 max-sm:grid-cols-1 max-sm:gap-1">
      <dt className="label pt-0.5">{k}</dt>
      <dd className="leading-relaxed">{v}</dd>
    </div>
  )
}

/** Segmented slider, like the game's settings bars. */
export function Meter({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex gap-1" aria-label={`${value} sur ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-3 w-6 border border-line ${i < value ? 'bg-fg' : ''}`} />
      ))}
    </span>
  )
}

/** Section heading placed inside the content area. */
export function Heading({ children, code }: { children: ReactNode; code?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="glitch-text font-display text-xl tracking-[0.2em] uppercase">{children}</h2>
      <span className="h-px flex-1 bg-line" />
      {code && <span className="label">{code}</span>}
    </div>
  )
}
