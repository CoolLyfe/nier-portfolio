import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

/* ------------------------------------------------------------------
   Shared UI primitives for the NieR menu.
   ------------------------------------------------------------------ */

export type Blip = (kind?: 'move' | 'select' | 'back') => void

/** App-wide services: sound + the bottom description line. */
export const UiContext = createContext<{ blip: Blip; setDesc: (s: string) => void }>({
  blip: () => {},
  setDesc: () => {},
})
export const useUi = () => useContext(UiContext)

/** True while a modal layer (hacking, detail, terminal) owns the keyboard. */
export const modalOpen = () => document.querySelector('[data-modal]') !== null

/** List row: ■ bullet, ► chevron and colour inversion when selected. */
export function Row({
  label,
  meta,
  desc,
  selected,
  onSelect,
  onConfirm,
}: {
  label: string
  meta?: string
  desc?: string
  selected: boolean
  onSelect: () => void
  onConfirm?: () => void
}) {
  const { blip, setDesc } = useUi()
  const [flash, setFlash] = useState(false)
  // selection state at pointer-down: focus selects the row before `click`
  // fires, so this is what tells a "select" tap from a "confirm" tap
  const wasSelected = useRef<boolean | null>(null)

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      // mouse hover selects; on touch the first tap selects, the second confirms
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        if (!selected) blip('move')
        onSelect()
        if (desc) setDesc(desc)
      }}
      onPointerDown={() => (wasSelected.current = selected)}
      onFocus={() => {
        onSelect()
        if (desc) setDesc(desc)
      }}
      onClick={() => {
        setFlash(true)
        blip('select')
        const confirmTap = wasSelected.current ?? selected
        wasSelected.current = null
        if (confirmTap) onConfirm?.()
        else onSelect()
      }}
      onAnimationEnd={() => setFlash(false)}
      className={`row ${flash ? 'flash' : ''}`}
    >
      <span className="bullet" />
      <span className="flex-1 truncate">{label}</span>
      {meta && <span className="text-[11px] tracking-wider opacity-70">{meta}</span>}
    </button>
  )
}

/**
 * ↑/↓ move the cursor, Enter or A confirms.
 * Ignored while typing or while a modal layer is open.
 */
export function useListKeys(count: number, sel: number, setSel: (i: number) => void, onConfirm?: (i: number) => void) {
  const { blip } = useUi()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea') || modalOpen() || count === 0) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setSel((sel + (e.key === 'ArrowDown' ? 1 : -1) + count) % count)
        blip('move')
      } else if ((e.key === 'Enter' || e.key.toLowerCase() === 'a') && onConfirm) {
        if (e.key === 'Enter' && e.target instanceof HTMLButtonElement) return // native click handles it
        e.preventDefault()
        blip('select')
        onConfirm(sel)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count, sel, setSel, onConfirm, blip])
}

/** Rectangular window with title strip. */
export function Window({
  title,
  code,
  children,
  className = '',
}: {
  title: string
  code?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`window ${className}`}>
      <WindowHead title={title} code={code} />
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}

export function WindowHead({ title, code }: { title: string; code?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-line bg-panel-2 px-4 py-1.5">
      <span className="h-2 w-2 bg-fg" />
      <span className="label text-fg!">{title}</span>
      {code && <span className="label ml-auto">{code}</span>}
    </div>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-line px-2 py-0.5 font-display text-[11px] tracking-wider uppercase">{children}</span>
  )
}

export function SquareList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex gap-3 leading-relaxed">
          <span className="mt-[0.6em] h-1.5 w-1.5 flex-none bg-fg" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

export function Field({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3 border-b border-line/40 py-2.5 last:border-0 max-sm:grid-cols-1 max-sm:gap-1">
      <dt className="label pt-0.5">{k}</dt>
      <dd className="leading-relaxed">{v}</dd>
    </div>
  )
}

/** Segmented bar, like the game's settings sliders. */
export function Meter({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex gap-1" aria-label={`${value} sur ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`h-3 w-6 border border-line ${i < value ? 'bg-fg' : ''}`} />
      ))}
    </span>
  )
}
