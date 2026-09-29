import { AnimatePresence, motion, type Transition } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { education, experience, projects, type LogEntry, type Project } from '../data/profile'
import { Field, SquareList, Tag, useUi } from './ui'

/** Mechanical, slightly "servo-like" easing: fast start, hard stop. */
export const MECH: Transition = { type: 'tween', ease: [0.76, 0, 0.18, 1], duration: 0.42 }

/**
 * Macro card (collapsed state). Shares a layoutId with its expanded
 * view, so Framer Motion morphs the card into the full window.
 */
export function Card({
  id,
  code,
  title,
  summary,
  tags,
  selected,
  onOpen,
  onHover,
  desc,
}: {
  id: string
  code: string
  title: string
  summary: string
  tags: string[]
  selected?: boolean
  onOpen: () => void
  onHover?: () => void
  desc: string
}) {
  const { setDesc, blip } = useUi()
  return (
    <motion.button
      layoutId={`win-${id}`}
      transition={MECH}
      type="button"
      onClick={() => {
        blip('select')
        onOpen()
      }}
      onMouseEnter={() => {
        setDesc(desc)
        onHover?.()
      }}
      onFocus={() => setDesc(desc)}
      className={`win group block h-full w-full text-left ${selected ? 'z-[1]' : ''}`}
    >
      <div className={`win-edge bevel h-full ${selected ? 'bg-fg!' : 'group-hover:bg-fg'}`}>
        <div className="win-body flex h-full flex-col">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 pl-6 ${
              selected ? 'bg-fg text-bg' : 'bg-head group-hover:bg-fg group-hover:text-bg'
            }`}
          >
            <span className="font-display text-xs tracking-[0.2em]">{selected ? '[>]' : '■'}</span>
            <span className="font-display text-xs tracking-[0.22em]">{code}</span>
            <span className="ml-auto font-display text-[10px] tracking-widest opacity-70">OPEN +</span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <p className="font-display text-lg leading-snug tracking-wide">{title}</p>
            <p className="text-sm text-beige">{summary}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {tags.slice(0, 3).map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

/** Resolve an id to a project or a log entry. */
function lookup(id: string): { kind: 'project'; p: Project } | { kind: 'log'; l: LogEntry } | null {
  const p = projects.find((x) => x.id === id)
  if (p) return { kind: 'project', p }
  const l = [...education, ...experience].find((x) => x.id === id)
  if (l) return { kind: 'log', l }
  return null
}

/** Micro view: full-screen window zoomed from its card. */
export function Expanded({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { blip } = useUi()

  useEffect(() => {
    if (!id) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  const item = id ? lookup(id) : null

  return (
    <AnimatePresence>
      {id && item && (
        <div data-modal className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-8">
          <motion.div
            className="absolute inset-0 bg-bg/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            layoutId={`win-${id}`}
            transition={MECH}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            role="dialog"
            aria-modal="true"
            className="win relative flex max-h-full w-full max-w-5xl"
          >
            <div className="win-edge bevel flex w-full">
              <div className="win-body flex w-full flex-col overflow-hidden">
                <div className="flex items-center gap-3 bg-fg px-4 py-2 pl-6 text-bg">
                  <span className="font-display text-xs tracking-[0.2em]">[&gt;]</span>
                  <span className="font-display text-xs tracking-[0.22em]">
                    {item.kind === 'project' ? `INTEL // ${item.p.code}` : `LOGS // ${item.l.period}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      blip('back')
                      onClose()
                    }}
                    className="ml-auto font-display text-xs tracking-[0.2em] hover:underline"
                  >
                    [ÉCHAP] FERMER ×
                  </button>
                </div>
                {/* content fades in after the window has finished growing */}
                <motion.div
                  className="overflow-y-auto p-5 sm:p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                >
                  {item.kind === 'project' ? <ProjectDetail p={item.p} /> : <LogDetail l={item.l} />}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-4">
      <p className="label mb-3">{title}</p>
      {children}
    </section>
  )
}

function ProjectDetail({ p }: { p: Project }) {
  return (
    <div className="space-y-6">
      <header>
        <p className="label">{p.period}</p>
        <h2 className="glitch-text mt-1 font-display text-2xl tracking-wide sm:text-3xl">{p.title}</h2>
      </header>

      {/* metrics strip */}
      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {p.metrics.map((m) => (
          <div key={m.k} className="bg-panel p-3">
            <p className="label">{m.k}</p>
            <p className="mt-1 font-display text-xl">{m.v}</p>
          </div>
        ))}
      </div>

      <dl>
        <Field k="Contexte" v={p.context} />
        <Field k="Objectif" v={p.objective} />
        <Field
          k="Technologies"
          v={
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          }
        />
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Architecture">
          <ul className="space-y-2.5">
            {p.architecture.map((a) => (
              <li key={a.name} className="grid grid-cols-[auto_1fr] gap-3">
                <span className="font-display text-sm text-beige">▸ {a.name}</span>
                <span className="text-sm leading-relaxed">{a.role}</span>
              </li>
            ))}
          </ul>
        </Block>
        <Block title="Rôle personnel">
          <SquareList items={p.role} />
        </Block>
      </div>

      {p.image && (
        <Block title="Preuve // capture">
          <figure>
            <div className="bg-[#e2ded4] p-3">
              <img src={p.image.src} alt={p.image.caption} className="mx-auto max-h-80 w-auto" />
            </div>
            <figcaption className="mt-2 text-sm text-beige">{p.image.caption}</figcaption>
          </figure>
        </Block>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title="Difficultés surmontées">
          <SquareList items={p.challenges} />
        </Block>
        <Block title="Retour d'expérience">
          <p className="leading-relaxed">{p.retrospective}</p>
        </Block>
      </div>

      <Block title="Compétences mobilisées">
        <div className="flex flex-wrap gap-2">
          {[...p.hardSkills, ...p.softSkills].map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </Block>

      {p.links && (
        <Block title="Liens">
          <div className="flex flex-wrap gap-2">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="item w-auto!">
                <span className="cur">[&gt;]</span>
                <span className="sq" />
                {l.label}
              </a>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}

function LogDetail({ l }: { l: LogEntry }) {
  return (
    <div className="space-y-6">
      <header>
        <p className="label">{l.period}</p>
        <h2 className="glitch-text mt-1 font-display text-2xl tracking-wide sm:text-3xl">{l.title}</h2>
        <p className="mt-1 text-beige">{l.place}</p>
      </header>
      <Block title="Détails">
        <SquareList items={l.details} />
      </Block>
      {l.skills.length > 0 && (
        <Block title="Compétences développées">
          <div className="flex flex-wrap gap-2">
            {l.skills.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}
