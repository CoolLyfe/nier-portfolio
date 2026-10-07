import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Photo } from '../data/profile'
import { useLang } from '../i18n'
import { PhotoFrame } from './Photo'
import { usePod } from './Pod'
import { useUi } from './ui'

/* ------------------------------------------------------------------
   Soft boxes shared by the home bento and the side tiles of the other
   tabs: header strip, faint escaping ring, Pod comment on hover.
   ------------------------------------------------------------------ */

/** Staggered soft entrance; skipped entirely when the visitor prefers reduced motion. */
function useEnter(n: number) {
  const still = useReducedMotion()
  return {
    initial: still ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.08 + n * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }
}

export function Tile({
  area,
  n,
  head,
  code,
  pod,
  onClick,
  className = '',
  children,
}: {
  area?: string
  n: number
  head: string
  code?: ReactNode
  pod?: string
  onClick?: () => void
  className?: string
  children: ReactNode
}) {
  const { say } = usePod()
  const { blip } = useUi()
  const enter = useEnter(n)
  return (
    <motion.section className={`tile ${className}`} style={{ gridArea: area }} {...enter} onPointerEnter={() => say(pod)}>
      <header className="tile-head">
        {onClick ? (
          <button
            type="button"
            className="tile-link"
            onClick={() => {
              blip('select')
              onClick()
            }}
          >
            {head}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <span>{head}</span>
        )}
        {code && <span className="ml-auto text-[0.75rem] opacity-80">{code}</span>}
      </header>
      <div className="tile-body">{children}</div>
    </motion.section>
  )
}

export function PhotoTile({ area, n, photo, onClick, className = '' }: { area?: string; n: number; photo: Photo; onClick: () => void; className?: string }) {
  const { say } = usePod()
  const { blip } = useUi()
  const { t } = useLang()
  const enter = useEnter(n)
  return (
    <motion.button
      type="button"
      className={`tile tile-photo ${className}`}
      style={{ gridArea: area }}
      {...enter}
      onPointerEnter={() => say(photo.pod ?? (photo.src ? undefined : t('Archive visuelle en attente de transfert. L’unité doit encore fournir la photo.', 'Visual archive awaiting transfer. The unit still has to provide the picture.')))}
      onClick={() => {
        blip('select')
        onClick()
      }}
    >
      <PhotoFrame photo={photo} className="h-full w-full" />
    </motion.button>
  )
}

/** Big light numbers with a small caption under each. */
export function Figures({ items, className = '' }: { items: [string, string][]; className?: string }) {
  return (
    <dl className={`figures ${className}`}>
      {items.map(([v, k]) => (
        <div key={k}>
          <dd>{v}</dd>
          <dt>{k}</dt>
        </div>
      ))}
    </dl>
  )
}
