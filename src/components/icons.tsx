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

/* Line glyphs (24×24) for category rows and the fiche visual. */
const GLYPHS = {
  pin: 'M12 21s-6-6.2-6-11a6 6 0 1 1 12 0c0 4.8-6 11-6 11zM12 8v4M10 10h4',
  school: 'M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6',
  pillars: 'M3 9l9-5 9 5zM5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18',
  note: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM9 9l11-2',
  guitar:
    'M13.5 10.5L20 4M18.5 2.5l3 3M11 9.5a3 3 0 0 1 3.5 3.5 4.6 4.6 0 0 1-1.5 6.5 5 5 0 0 1-8.6-3.6A4.6 4.6 0 0 1 9.5 11 3 3 0 0 1 11 9.5zM9.5 14.5l2 2',
  bass: 'M12.5 11.5L22 2M20 1.5l2.5 2.5M10 10.5a3 3 0 0 1 3.5 3.5 4.6 4.6 0 0 1-1.5 6.5 5 5 0 0 1-8.6-3.6A4.6 4.6 0 0 1 8.5 12 3 3 0 0 1 10 10.5zM7 15.5h3M7 17.5h3',
  drums: 'M4 10a8 3 0 1 0 16 0 8 3 0 1 0-16 0zM4 10v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7M4 14l3 5M20 14l-3 5M12 13v7M5 2l6 6M19 2l-6 6',
  wave: 'M2 12h3l2-6 3 12 3-9 2 5 2-2h5',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  lambda: 'M6 4h3l9 16M12 11l-6 9',
  graph: 'M5 8a2.5 2.5 0 1 1 0-.01zM19 8a2.5 2.5 0 1 1 0-.01zM12 19a2.5 2.5 0 1 1 0-.01zM7.4 6h9.2M6.3 9.8l4.4 6.5M17.7 9.8l-4.4 6.5',
  branch: 'M6 3v12M6 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM18 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM18 8c0 5-12 2-12 7',
  terminal: 'M3 4h18v16H3zM7 9l3 3-3 3M12 15h5',
  web: 'M3 4h18v16H3zM3 8h18M6 6h.01M8.5 6h.01M8 12h8M8 16h5',
  case: 'M3 7h18v12H3zM9 7V4h6v3M3 12h18M11 12v2h2v-2',
  flag: 'M5 21V3M5 4h13l-3 4 3 4H5',
  mic: 'M9 2h6v11H9zM5 10a7 7 0 0 0 14 0M12 17v4M8 21h8',
  scroll: 'M4 3h16v13H4zM8 7h8M8 10h8M8 13h4M16 16a3 3 0 1 0 0 .01M14.5 18.5L13 22M17.5 18.5L19 22',
  medal: 'M8 2l4 7 4-7M12 9a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 12.5v5M10 13.5l2-1',
  plane: 'M21 4L3 11l7 2 2 7zM10 13l11-9',
  bubble: 'M3 5h18v11H10l-5 4v-4H3zM7 9h10M7 12h6',
  heart: 'M12 20s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z',
  gamepad: 'M6 8h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5 2l-2-2H9l-2 2a3 3 0 0 1-5-2v-1a4 4 0 0 1 4-4zM7 10.5v3M5.5 12h3M16 11h.01M18 13h.01',
  folder: 'M3 5h7l2 2h9v12H3zM3 10h18',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4 4-6 8-6s8 2 8 6',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  download: 'M12 3v12M7 10l5 5 5-5M4 20h16',
  cog: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v4M12 18v4M2 12h4M18 12h4M5 5l2.8 2.8M16.2 16.2L19 19M5 19l2.8-2.8M16.2 7.8L19 5',
  chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9 2v5M15 2v5M9 17v5M15 17v5M2 9h5M2 15h5M17 9h5M17 15h5',
  star: 'M12 3l2.6 6 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.2L7.8 14 3 9.6 9.4 9z',
  up: 'M12 20V5M6 11l6-6 6 6M4 21h16',
  target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM12 11.5v1',
  grid: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
} as const

export type Glyph = keyof typeof GLYPHS

export function GlyphIcon({ name, className = '' }: { name: Glyph; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      aria-hidden
    >
      <path d={GLYPHS[name]} />
    </svg>
  )
}

/**
 * The fiche's preview well, like the weapon viewer: concentric rings,
 * crosshair ticks and the glyph standing in for the 3D model.
 */
export function Visual({ glyph }: { glyph: Glyph }) {
  return (
    <div className="visual well">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" aria-hidden>
        <circle cx="50" cy="50" r="44" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="36" strokeWidth="0.4" strokeDasharray="1.5 2.5" />
        <path d="M50 2v8M50 90v8M2 50h8M90 50h8" strokeWidth="0.6" />
      </svg>
      <GlyphIcon name={glyph} className="relative h-[46%] w-[46%]" />
      <span className="corner tl" />
      <span className="corner br" />
    </div>
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
