import type { Photo } from '../data/profile'
import { useLang } from '../i18n'
import { GlyphIcon } from './icons'

/**
 * A photo in a NieR image well. Pictures are toned to the sand palette
 * and regain their colour on hover. Without a picture yet, the frame
 * shows a camera viewfinder waiting for its data.
 */
export function PhotoFrame({ photo, className = '', large }: { photo: Photo; className?: string; large?: boolean }) {
  const { t } = useLang()
  return (
    <figure className={`photo well ${className}`} data-empty={!photo.src}>
      {photo.src ? (
        <img src={photo.src} alt={photo.caption} loading="lazy" />
      ) : (
        <div className="photo-empty">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" aria-hidden>
            <circle cx="50" cy="50" r="30" strokeWidth="0.35" />
            <circle cx="50" cy="50" r="24" strokeWidth="0.35" strokeDasharray="1 2.2" className="spin-slow" />
            <path d="M50 14v8M50 78v8M14 50h8M78 50h8" strokeWidth="0.5" />
          </svg>
          <GlyphIcon name={photo.icon} className={`relative ${large ? 'h-16 w-16' : 'h-9 w-9'}`} />
          <p className={`relative mt-2 max-w-[85%] text-center font-mono leading-relaxed tracking-[0.14em] text-balance ${large ? 'text-[0.75rem]' : 'text-[0.6rem]'}`}>
            {t('DONNÉE VISUELLE EN ATTENTE', 'VISUAL DATA PENDING')}
          </p>
        </div>
      )}
      <figcaption>
        <span className="bullet" />
        {photo.caption}
      </figcaption>
      <span className="corner tl" />
      <span className="corner br" />
    </figure>
  )
}
