import type { TabId } from '../data/profile'

/* Tab glyphs, drawn on a 12×12 grid in the spirit of the game's icons. */
const PATHS: Record<TabId, string> = {
  // compass rose
  map: 'M6 0l1.4 4.6L12 6l-4.6 1.4L6 12 4.6 7.4 0 6l4.6-1.4z',
  // exclamation in a frame
  quests: 'M1 1h10v10H1zM2.5 2.5v7h7v-7zM5.2 3.5h1.6v3.2H5.2zM5.2 7.6h1.6v1.4H5.2z',
  // stacked pouch
  items: 'M3 1h6v2H3zM2 4h8v3H2zM2 8h8v3H2z',
  // sword, point up
  weapons: 'M6 0l1.2 2v5.5H9V9H6.8v3H5.2V9H3V7.5h1.8V2z',
  // circuit chip
  skills: 'M3 3h6v6H3zM4.5 0h1v2h-1zM6.5 0h1v2h-1zM4.5 10h1v2h-1zM6.5 10h1v2h-1zM0 4.5h2v1H0zM0 6.5h2v1H0zM10 4.5h2v1h-2zM10 6.5h2v1h-2z',
  // chevron on a bar (data)
  intel: 'M1 1h10v1.6H1zM1.5 4.2L6 9l4.5-4.8 1 1.1L6 11 .5 5.3z',
  // power symbol
  system:
    'M5.2 0h1.6v5.5H5.2zM3.2 2.2l1 1.2A3.6 3.6 0 1 0 7.8 3.4l1-1.2A5.2 5.2 0 1 1 3.2 2.2z',
}

export function TabIcon({ id }: { id: TabId }) {
  return (
    <span className="tab-icon" aria-hidden>
      <svg viewBox="0 0 12 12" fill="currentColor">
        <path d={PATHS[id]} fillRule="evenodd" />
      </svg>
    </span>
  )
}

/** Faint circles and diagonals behind the whole menu. */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden>
      <svg className="h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
        <circle cx="520" cy="430" r="360" />
        <circle cx="520" cy="430" r="348" />
        <circle cx="1240" cy="260" r="520" />
        <path d="M0 120L1100 900M260 0L1600 820M900 0L0 640M1600 180L700 900" />
      </svg>
    </div>
  )
}
