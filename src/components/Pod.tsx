import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLang } from '../i18n'

/* ------------------------------------------------------------------
   Pod 042: floats in the corner and comments on what you look at.
   Any component can call usePod().say(line); hovering quickly over
   several things only keeps the last line.
   ------------------------------------------------------------------ */

const PodContext = createContext<{ say: (line?: string) => void }>({ say: () => {} })
export const usePod = () => useContext(PodContext)

const HOVER_DELAY = 160
const SHOW_MS = 9000
const IDLE_MS = 28000

export function PodProvider({ awake, setAwake, children }: { awake: boolean; setAwake: (v: boolean) => void; children: ReactNode }) {
  const { S } = useLang()
  const [line, setLine] = useState<{ text: string; n: number } | null>(null)
  const pending = useRef<ReturnType<typeof setTimeout>>(undefined)
  const last = useRef('')
  const lastAt = useRef(0)

  const show = useCallback((text: string) => {
    last.current = text
    lastAt.current = Date.now()
    setLine((l) => ({ text, n: (l?.n ?? 0) + 1 }))
  }, [])

  const say = useCallback(
    (text?: string) => {
      clearTimeout(pending.current)
      if (!text || !awake || text === last.current) return
      pending.current = setTimeout(() => show(text), HOVER_DELAY)
    },
    [awake, show],
  )

  // the bubble fades after a while; when nothing happens for long, Pod speaks up
  useEffect(() => {
    if (!line) return
    const hide = setTimeout(() => setLine(null), SHOW_MS)
    return () => clearTimeout(hide)
  }, [line])

  useEffect(() => {
    if (!awake) return
    const idle = setInterval(() => {
      if (Date.now() - lastAt.current < IDLE_MS || document.hidden) return
      const pool = S.pod.idle.filter((l) => l !== last.current)
      show(pool[Math.floor(Math.random() * pool.length)])
    }, 4000)
    return () => clearInterval(idle)
  }, [awake, S, show])

  // first greeting, once per visit
  const greeted = useRef(false)
  useEffect(() => {
    lastAt.current = Date.now()
    if (!awake || greeted.current) return
    const id = setTimeout(() => {
      greeted.current = true
      show(S.pod.hello)
    }, 1400)
    return () => clearTimeout(id)
  }, [awake, show, S.pod.hello])

  const toggle = () => {
    clearTimeout(pending.current)
    if (awake) {
      setAwake(false)
      last.current = ''
      setLine({ text: S.pod.muted, n: Date.now() })
    } else {
      setAwake(true)
      show(S.pod.idle[Math.floor(Math.random() * S.pod.idle.length)])
    }
  }

  const value = useMemo(() => ({ say }), [say])

  return (
    <PodContext.Provider value={value}>
      {children}
      <PodUnit awake={awake} line={line} name={S.pod.name} onClick={toggle} />
    </PodContext.Provider>
  )
}

function PodUnit({ awake, line, name, onClick }: { awake: boolean; line: { text: string; n: number } | null; name: string; onClick: () => void }) {
  const { t } = useLang()
  return (
    <div className="pod-unit" data-awake={awake}>
      <AnimatePresence mode="wait">
        {line && (
          <motion.div
            key={line.n}
            className="pod-bubble"
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <p className="pod-name">{name}</p>
            <Typed text={line.text} />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={onClick}
        className="pod-body"
        aria-label={awake ? t('Mettre le Pod en veille', 'Put the Pod on standby') : t('Réveiller le Pod', 'Wake the Pod up')}
        title={name}
      >
        <PodGlyph />
      </button>
    </div>
  )
}

/** Text revealed a few characters at a time, like the game's subtitles. */
function Typed({ text }: { text: string }) {
  // remounted for each line (keyed bubble), so it always starts empty
  const [n, setN] = useState(() => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? text.length : 0))
  useEffect(() => {
    const id = setInterval(() => setN((k) => (k >= text.length ? (clearInterval(id), k) : k + 2)), 22)
    return () => clearInterval(id)
  }, [text])
  return (
    <p className="pod-text">
      {text.slice(0, n)}
      <span className="opacity-0">{text.slice(n)}</span>
    </p>
  )
}

/** Pod 042: boxy body, a visor slit, two thin arms. */
export function PodGlyph() {
  return (
    <svg viewBox="0 0 48 60" aria-hidden>
      <path className="pod-shell" d="M11 4h26l5 6v22l-5 6H11l-5-6V10z" />
      <path className="pod-face" d="M14 12h20v3.5H14zM14 19h20v1.5H14zM14 24h12v1.5H14z" />
      <path className="pod-arm" d="M12 38v9l-3 6M36 38v9l3 6" />
      <path className="pod-shell" d="M7.5 53h3v3h-3zM37.5 53h3v3h-3z" />
    </svg>
  )
}
