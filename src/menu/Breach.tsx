import { AnimatePresence, motion, type Transition } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { WindowHead, useUi } from '../components/ui'
import { HackGame } from './HackGame'

/** Servo-like easing: fast start, hard stop. */
export const MECH: Transition = { type: 'tween', ease: [0.76, 0, 0.18, 1], duration: 0.45 }

export type Phase = 'idle' | 'hacking' | 'open'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Right-column macro window. When `phase` is 'hacking' the same window
 * switches to the black/orange hacking palette and hosts the mini-game;
 * on completion the parent moves to 'open' and <DetailLayer> grows out
 * of this window (shared layoutId).
 */
export function MacroWindow({
  id,
  title,
  code,
  hackable,
  phase,
  onBreach,
  onHacked,
  onAbort,
  children,
}: {
  id: string
  title: string
  code: string
  hackable: boolean
  phase: Phase
  onBreach: () => void
  onHacked: () => void
  onAbort: () => void
  children: ReactNode
}) {
  const { blip } = useUi()
  const hacking = phase === 'hacking'
  const ref = useRef<HTMLDivElement>(null)

  // bring the window on screen when the hack starts (stacked layout on mobile)
  useEffect(() => {
    if (hacking) ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [hacking])

  // B / Escape aborts the hack
  useEffect(() => {
    if (!hacking) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
        blip('back')
        onAbort()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hacking, onAbort, blip])

  // reduced motion: skip the game, short decrypt only
  useEffect(() => {
    if (!hacking || !reduced()) return
    const t = setTimeout(onHacked, 500)
    return () => clearTimeout(t)
  }, [hacking, onHacked])

  return (
    <motion.div
      ref={ref}
      layout
      layoutId={`win-${id}`}
      transition={MECH}
      data-mode={hacking ? 'hack' : undefined}
      data-modal={hacking ? '' : undefined}
      className={`window ${hacking ? 'glitch' : ''}`}
    >
      <WindowHead title={hacking ? `HACKING // ${title}` : title} code={code} />
      {hacking ? (
        <div>
          <div className="relative h-[min(58vh,26rem)] min-h-72">
            {reduced() ? (
              <p className="grid h-full place-items-center font-display tracking-[0.2em] text-accent">DÉCHIFFREMENT…</p>
            ) : (
              <HackGame code={code} onDone={onHacked} />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2">
            <span className="label">Souris / doigt / flèches : déplacer — tir automatique</span>
            <span className="flex gap-2">
              <button type="button" onClick={onHacked} className="border border-line px-2 py-0.5 font-display text-xs tracking-[0.2em] hover:bg-sel hover:text-on-sel">
                PASSER
              </button>
              <button type="button" onClick={onAbort} className="border border-line px-2 py-0.5 font-display text-xs tracking-[0.2em] hover:bg-sel hover:text-on-sel">
                [B] ABANDONNER
              </button>
            </span>
          </div>
        </div>
      ) : (
        <div key={id} className="boot-in p-4 sm:p-5">
          {children}
          {hackable && (
            <button
              type="button"
              onClick={() => {
                blip('select')
                onBreach()
              }}
              className="row mt-5 w-auto! border-line! bg-transparent!"
            >
              <span className="bullet" />
              <span className="key mr-0!">A</span>
              Déchiffrer les données complètes
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

/** Full detail view, grown from the hacked window. */
export function DetailLayer({
  id,
  title,
  onClose,
  children,
}: {
  id: string | null
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const { blip } = useUi()
  const [flash, setFlash] = useState(true)

  useEffect(() => {
    if (!id) return
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 420)
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea')) return
      if (e.key === 'Escape' || e.key.toLowerCase() === 'b') {
        blip('back')
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [id, onClose, blip])

  return (
    <AnimatePresence>
      {id && (
        <div data-modal className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-8">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            layoutId={`win-${id}`}
            transition={MECH}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            // stays in hacking colours while it grows, then flips back
            data-mode={flash ? 'hack' : undefined}
            className="window relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden"
          >
            <div className="flex items-center gap-3 bg-sel px-4 py-2 text-on-sel">
              <span className="truncate font-display text-xs tracking-[0.2em]">■ DECRYPTED // {title}</span>
              <button
                type="button"
                onClick={() => {
                  blip('back')
                  onClose()
                }}
                className="ml-auto font-display text-xs tracking-[0.2em] hover:underline"
              >
                [B] <span className="max-sm:hidden">FERMER </span>×
              </button>
            </div>
            <motion.div
              className="overflow-y-auto p-5 sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
