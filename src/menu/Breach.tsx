import { AnimatePresence, motion, type Transition } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { WindowHead, useUi } from '../components/ui'
import { VoidScene, VoidShip } from '../components/VoidScene'
import { useLang } from '../i18n'

/** Servo-like easing: fast start, hard stop. */
export const MECH: Transition = { type: 'tween', ease: [0.76, 0, 0.18, 1], duration: 0.45 }

export type Phase = 'idle' | 'breach' | 'open'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const BREACH_MS = 650

/**
 * Right-column fiche. Opening its dossier sinks the same window into the
 * hacking void for a short decrypt, then the parent moves to 'open' and
 * <DetailLayer> grows out of it (shared layoutId) as a floating platform.
 */
export function MacroWindow({
  id,
  title,
  code,
  detail,
  phase,
  onBreach,
  onOpened,
  children,
}: {
  id: string
  title: string
  code: string
  detail: boolean
  phase: Phase
  onBreach: () => void
  onOpened: () => void
  children: ReactNode
}) {
  const { blip } = useUi()
  const { t } = useLang()
  const breaching = phase === 'breach'
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!breaching) return
    ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    const timer = setTimeout(onOpened, reduced() ? 0 : BREACH_MS)
    return () => clearTimeout(timer)
  }, [breaching, onOpened])

  return (
    <motion.div
      ref={ref}
      layout
      layoutId={`win-${id}`}
      transition={MECH}
      data-mode={breaching ? 'void' : undefined}
      data-modal={breaching ? '' : undefined}
      className={`window fiche flex h-full flex-col ${breaching ? 'breach glitch' : ''}`}
    >
      <WindowHead title={breaching ? `HACKING // ${title}` : title} code={code} />
      {breaching ? (
        <div className="grid flex-1 place-items-center p-8">
          <div className="w-[min(22rem,80%)]">
            <p className="font-mono text-sm tracking-[0.2em] text-accent">{t('DÉCHIFFREMENT', 'DECRYPTING')} // {code}</p>
            <div className="mt-3 h-2 bg-item">
              <div className="decrypt-bar h-full bg-sel" style={{ animationDuration: `${BREACH_MS}ms` }} />
            </div>
          </div>
        </div>
      ) : (
        <div key={id} className="boot-in relative z-[1] flex flex-1 flex-col p-4 sm:p-6">
          {children}
          {detail && <div className="min-h-6 flex-1" />}
          {detail && (
            <button
              type="button"
              onClick={() => {
                blip('select')
                onBreach()
              }}
              className="btn self-start"
            >
              <span className="bullet" />
              {t('Ouvrir le dossier complet', 'Open full file')}
              <span className="key ml-2">A</span>
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

/**
 * Full dossier, grown from the fiche: a pale platform floating in the
 * hacking void, bobbing above its own shadow, with the ship hovering by.
 */
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
  const { t } = useLang()

  useEffect(() => {
    if (!id) return
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
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [id, onClose, blip])

  return (
    <AnimatePresence>
      {id && (
        <div data-modal data-mode="void" className="fixed inset-0 z-50 grid grid-rows-[minmax(0,1fr)] place-items-center p-3 pt-10 pb-16 sm:px-16 sm:pt-[9vh] sm:pb-[15vh]">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          >
            <VoidScene label={title} />
          </motion.div>
          <motion.div
            layoutId={`win-${id}`}
            transition={MECH}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative flex max-h-full w-full max-w-[60rem] flex-col"
          >
            <span className="platform-shadow" aria-hidden />
            <div className="platform flex min-h-0 flex-col">
              <div className="panel-head">
                <span className="truncate">
                  {t('Accès déverrouillé', 'Access unlocked')} -{title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    blip('back')
                    onClose()
                  }}
                  className="ml-auto flex flex-none items-center text-[0.85rem] hover:opacity-70"
                >
                  <span className="key bg-on-sel! text-sel!">B</span>
                  <span className="max-sm:hidden">{t('Fermer', 'Close')}</span>
                </button>
              </div>
              <motion.div
                className="min-h-0 overflow-y-auto p-5 sm:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
              >
                {children}
              </motion.div>
            </div>
            <VoidShip />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
