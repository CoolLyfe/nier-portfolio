import { useMemo, type CSSProperties } from 'react'

/**
 * Everything behind the menu: a warm light, large slowly turning rings,
 * soft arcs instead of hard diagonals, and square dust drifting upwards
 * like the particles floating in the game's menus.
 */
export function Backdrop() {
  const dust = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin((i + 1) * 9301 + n * 49297) * 233280
          return x - Math.floor(x)
        }
        return {
          left: `${r(1) * 100}%`,
          size: 2 + Math.round(r(2) * 5),
          duration: 26 + r(3) * 34,
          delay: -r(4) * 60,
          drift: `${(r(5) - 0.5) * 9}rem`,
          opacity: 0.12 + r(6) * 0.32,
        }
      }),
    [],
  )

  return (
    <div className="backdrop" aria-hidden>
      <div className="backdrop-light" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
        <g className="spin-slower" style={{ transformOrigin: '520px 470px' }}>
          <circle cx="520" cy="470" r="360" />
          <circle cx="520" cy="470" r="348" strokeDasharray="2 14" />
          <path d="M520 98a372 372 0 0 1 372 372" strokeWidth="3" />
        </g>
        <g className="spin-slower-rev" style={{ transformOrigin: '1260px 260px' }}>
          <circle cx="1260" cy="260" r="520" />
          <circle cx="1260" cy="260" r="470" strokeDasharray="1 10" />
        </g>
        <path d="M-40 760C300 600 620 860 980 700S1500 520 1680 620" />
        <path d="M-40 200C260 120 520 300 860 190S1380 40 1680 140" strokeDasharray="4 10" />
      </svg>
      <div className="dust">
        {dust.map((d, i) => (
          <span
            key={i}
            style={
              {
                left: d.left,
                width: d.size,
                height: d.size,
                opacity: d.opacity,
                animationDuration: `${d.duration}s`,
                animationDelay: `${d.delay}s`,
                '--drift': d.drift,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
