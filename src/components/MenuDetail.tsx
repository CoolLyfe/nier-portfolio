import { useEffect, useRef, type ReactNode } from 'react'

export interface MenuEntry {
  key: string
  label: string
  meta?: string
}

/**
 * The core NieR layout: a selectable list on the left, a detail panel on
 * the right. ↑/↓ move the cursor while the component is mounted.
 * On narrow screens the list stacks above the detail.
 */
export function MenuDetail({
  entries,
  selected,
  onSelect,
  blip,
  children,
}: {
  entries: MenuEntry[]
  selected: number
  onSelect: (i: number) => void
  blip: (k?: 'move' | 'select' | 'back') => void
  children: ReactNode
}) {
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const d = e.key === 'ArrowDown' ? 1 : -1
      onSelect((selected + d + entries.length) % entries.length)
      blip('move')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, entries.length, onSelect, blip])

  const pick = (i: number) => {
    onSelect(i)
    blip('select')
    // on mobile, jump to the detail that just changed
    if (window.matchMedia('(max-width: 767px)').matches) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(14rem,18rem)_1fr] md:gap-8">
      <ul role="listbox" aria-label="Éléments" className="space-y-1 md:pl-5">
        {entries.map((e, i) => (
          <li key={e.key}>
            <button
              type="button"
              role="option"
              aria-selected={i === selected}
              onClick={() => pick(i)}
              onMouseEnter={() => i !== selected && blip('move')}
              className="nier-item"
            >
              <span className="nier-square" />
              <span className="flex-1 font-display tracking-[0.15em]">{e.label}</span>
              {e.meta && <span className="font-display text-[10px] tracking-wider opacity-60">{e.meta}</span>}
            </button>
          </li>
        ))}
      </ul>
      <div ref={detailRef} key={entries[selected]?.key} className="boot-in min-w-0 scroll-mt-4">
        {children}
      </div>
    </div>
  )
}
