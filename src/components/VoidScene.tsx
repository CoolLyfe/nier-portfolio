import { useMemo, type CSSProperties } from 'react'

/*
 * Behind an open dossier: the hacking-game void. Pale columns sinking into
 * a warm dark fog, extruded blocks drifting at different depths, white
 * motes, a few orange sparks, and a label engraved on a far platform.
 * Everything moves slowly and out of phase so the dossier seems to float.
 */

const seeded = (i: number) => (n: number) => {
  const x = Math.sin((i + 1) * 7919 + n * 104729) * 43758.5453
  return x - Math.floor(x)
}

/* [left %, width vw, top %, depth 0 (near) – 1 (far), drift period s] */
const COLUMNS: [number, number, number, number, number][] = [
  [-3, 13, -18, 0.2, 23],
  [11, 6, -30, 0.75, 31],
  [21, 4, -12, 1, 37],
  [70, 5, -26, 0.9, 34],
  [79, 9, -10, 0.45, 27],
  [91, 12, -22, 0.15, 21],
]

/* [left %, top %, size rem, depth, drift period s] */
const BLOCKS: [number, number, number, number, number][] = [
  [6, 72, 3.2, 0.2, 13],
  [17, 18, 1.6, 0.8, 17],
  [30, 86, 2.2, 0.5, 15],
  [62, 8, 1.3, 0.9, 19],
  [84, 64, 2.6, 0.35, 14],
  [93, 30, 1.8, 0.6, 18],
  [48, 94, 1.4, 0.85, 21],
]

export function VoidScene({ label }: { label: string }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const r = seeded(i)
        return {
          left: `${r(1) * 100}%`,
          top: `${r(2) * 100}%`,
          size: r(3) < 0.85 ? 2 : 3,
          spark: i % 11 === 0,
          dur: 5 + r(4) * 9,
          delay: -r(5) * 14,
          rise: `${-(2 + r(6) * 6)}rem`,
        }
      }),
    [],
  )

  return (
    <div className="void-scene" aria-hidden>
      <div className="void-floor" />
      <div className="void-fog" />

      {COLUMNS.map(([left, w, top, depth, period], i) => (
        <span
          key={`c${i}`}
          className="void-column"
          style={
            {
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}vw`,
              '--depth': depth,
              animationDuration: `${period}s`,
              animationDelay: `${-i * 4}s`,
            } as CSSProperties
          }
        />
      ))}

      <p className="void-engraving">
        <span>{label}</span>
        <span>UNLOCKED</span>
      </p>

      {BLOCKS.map(([left, top, size, depth, period], i) => (
        <span
          key={`b${i}`}
          className="void-block"
          style={
            {
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}rem`,
              height: `${size}rem`,
              '--depth': depth,
              animationDuration: `${period}s`,
              animationDelay: `${-i * 2.3}s`,
            } as CSSProperties
          }
        />
      ))}

      {motes.map((m, i) => (
        <span
          key={`m${i}`}
          className={`void-mote ${m.spark ? 'spark' : ''}`}
          style={
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.delay}s`,
              '--rise': m.rise,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** The hacking ship, hovering next to the dossier inside its target ring. */
export function VoidShip() {
  return (
    <div className="void-ship" aria-hidden>
      <svg viewBox="-20 -20 40 40" className="h-full w-full">
        <circle r="17" className="ring" />
        <circle r="13" className="ring thin" />
        <path d="M0 -9L8 7L0 3.5L-8 7Z" className="hull" />
        <circle cy="-1" r="1.6" className="core" />
      </svg>
      <span className="void-ship-shadow" />
    </div>
  )
}
