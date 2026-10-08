import { useMemo, type CSSProperties } from 'react'

/**
 * Everything behind the menu: a warm light, large slowly turning rings,
 * soft arcs instead of hard diagonals, and square dust drifting upwards
 * like the particles floating in the game's menus. Over that, a static
 * layer of hairlines, tick rulers, crosshairs and corner brackets gives the
 * surface the engraved, technical texture of the in-game pause menu.
 */
const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step)

/** A horizontal hairline with small ticks, taller every fifth one. */
function Ruler({ y, x1, x2, up = false }: { y: number; x1: number; x2: number; up?: boolean }) {
  const dir = up ? -1 : 1
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      {range(x1, x2, 16).map((x, i) => (
        <line key={x} x1={x} y1={y} x2={x} y2={y + dir * (i % 5 === 0 ? 9 : 4)} />
      ))}
    </g>
  )
}

function Cross({ x, y, s = 6 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x - s} ${y}h${s * 2}M${x} ${y - s}v${s * 2}`} />
}

/** Corner bracket; sx/sy pick which way its arms open. */
function Corner({ x, y, sx, sy, len = 26 }: { x: number; y: number; sx: 1 | -1; sy: 1 | -1; len?: number }) {
  return <path d={`M${x} ${y + sy * len}V${y}H${x + sx * len}`} />
}

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
      <svg
        className="backdrop-ornaments absolute inset-0 h-full w-full max-sm:hidden"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        {/* header strip, between the page title and the settings */}
        <line x1="420" y1="112" x2="1290" y2="112" />
        <line x1="420" y1="116" x2="1290" y2="116" className="soft" strokeDasharray="1 4" />
        <Ruler y={112} x1={440} x2={760} up />
        <path d="M1100 112v-8h190v8" className="soft" />
        {range(1112, 1280, 24).map((x) => (
          <rect key={x} x={x - 1.5} y={98} width="3" height="3" fill="currentColor" stroke="none" />
        ))}
        <g transform="translate(900 92)">
          <path d="M0 -7L7 0L0 7L-7 0Z" />
          <path d="M-60 0h48M12 0h48" className="soft" />
          <circle r="1.5" fill="currentColor" stroke="none" />
        </g>
        <Cross x={420} y={112} s={5} />
        <Cross x={1290} y={112} s={5} />

        {/* ticked rulers running down both margins */}
        {[28, 1572].map((x) => (
          <g key={x}>
            <line x1={x} y1="150" x2={x} y2="800" className="soft" />
            {range(150, 800, 16).map((y, i) => (
              <line key={y} x1={x} y1={y} x2={x + (x < 800 ? 1 : -1) * (i % 5 === 0 ? 10 : 4)} y2={y} />
            ))}
            <Cross x={x} y={130} s={5} />
            <Cross x={x} y={820} s={5} />
          </g>
        ))}
        <line x1="44" y1="150" x2="44" y2="800" className="soft" strokeDasharray="1 6" />
        <line x1="1556" y1="150" x2="1556" y2="800" className="soft" strokeDasharray="1 6" />

        {/* small target ornaments in the margins */}
        {[
          [36, 470],
          [1564, 300],
        ].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <circle r="12" fill="var(--bg)" />
            <circle r="7" strokeDasharray="2 2" />
            <path d="M0 -4L4 0L0 4L-4 0Z" fill="currentColor" stroke="none" />
          </g>
        ))}

        {/* corner brackets */}
        <Corner x={12} y={78} sx={1} sy={1} len={18} />
        <Corner x={1588} y={78} sx={-1} sy={1} len={18} />
        <Corner x={12} y={848} sx={1} sy={-1} len={18} />
        <Corner x={1588} y={848} sx={-1} sy={-1} len={18} />
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
