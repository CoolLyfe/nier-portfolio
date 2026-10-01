import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Backdrop, GlyphIcon, TabIcon } from './components/icons'
import { Row, UiContext, modalOpen } from './components/ui'
import { identity, type TabId } from './data/profile'
import { Terminal } from './hack/Terminal'
import { useBlip, usePersistentFlag } from './hooks/useSettings'
import { DetailLayer, MacroWindow, type Phase } from './menu/Breach'
import { detailTitle, renderDetail } from './menu/details'
import { NO_ACTIONS, TABS, categoriesFor, locate } from './menu/tabs'

type Pos = { c: number; i: number }

const readHash = (): TabId => {
  const h = window.location.hash.slice(1)
  return TABS.some((t) => t.id === h) ? (h as TabId) : 'system'
}
// Deep links: ?open=<id> shows a dossier (?hack=<id> is kept as an alias),
// ?skipboot skips the intro.
const params = new URLSearchParams(window.location.search)
const deepId = params.get('open') ?? params.get('hack')
const deep = deepId ? locate(deepId) : null
const deepOpen = !!deep && !!categoriesFor(deep.tab, NO_ACTIONS)[deep.c].entries[deep.i].detail

export default function App() {
  const [tab, setTab] = useState<TabId>(() => deep?.tab ?? readHash())
  // cursor per tab: category + entry; a deep-linked id pre-selects its entry
  const [pos, setPos] = useState<Partial<Record<TabId, Pos>>>(() => (deep ? { [deep.tab]: { c: deep.c, i: deep.i } } : {}))
  // which column the arrows drive, as in the game's two-level menus
  const [focus, setFocus] = useState<'cat' | 'list'>('list')
  const [breach, setBreach] = useState<{ id: string; phase: Phase } | null>(() => (deepOpen && deepId ? { id: deepId, phase: 'open' } : null))
  const [terminal, setTerminal] = useState<'closed' | 'open' | 'min'>('closed')
  const [desc, setDesc] = useState(() => TABS.find((t) => t.id === (deep?.tab ?? readHash()))!.desc)
  const [crt, setCrt] = usePersistentFlag('nier.crt', true)
  const [sound, setSound] = usePersistentFlag('nier.sound', false)
  const [booting, setBooting] = useState(() => {
    try {
      return !params.has('skipboot') && sessionStorage.getItem('nier.booted') !== '1'
    } catch {
      return true
    }
  })
  const blip = useBlip(sound)
  const ui = useMemo(() => ({ blip, setDesc }), [blip])
  const tabsRef = useRef<HTMLElement>(null)

  const go = useCallback((id: TabId) => {
    setTab(id)
    setFocus('list')
    setDesc(TABS.find((t) => t.id === id)!.desc)
    history.replaceState(null, '', `${window.location.pathname}#${id}`)
  }, [])

  const tabIdx = TABS.findIndex((t) => t.id === tab)
  const tabDef = TABS[tabIdx]
  const openTerminal = useCallback(() => setTerminal('open'), [])
  const cats = categoriesFor(tab, { crt, setCrt, sound, setSound, openTerminal, go })
  const c = Math.min(pos[tab]?.c ?? 0, cats.length - 1)
  const cat = cats[c]
  const cur = Math.min(pos[tab]?.i ?? 0, cat.entries.length - 1)
  const entry = cat.entries[cur]
  const setCat = useCallback((n: number) => setPos((p) => ({ ...p, [tab]: { c: n, i: 0 } })), [tab])
  const setCur = useCallback((n: number) => setPos((p) => ({ ...p, [tab]: { c, i: n } })), [tab, c])

  // keep the active tab visible in the scrollable tab bar (mobile)
  useEffect(() => {
    tabsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [tab])

  // Confirm = open the dossier when there is one, else the entry's own action.
  const confirm = (i: number) => {
    const e = cat.entries[i]
    if (!e) return
    if (e.detail) setBreach({ id: e.id, phase: 'breach' })
    else e.onConfirm?.()
  }

  // Q/E or 1–7 switch tabs, ←/→ switch column, ↑/↓ move, A confirm, B back, ² terminal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea') || e.metaKey || e.ctrlKey || e.altKey || booting) return
      if (e.key === '`' || e.key === '²') {
        setTerminal((t) => (t === 'open' ? 'min' : 'open'))
        return
      }
      if (modalOpen()) return
      const k = e.key.toLowerCase()
      const n = Number(e.key)
      if (k === 'q' || k === 'e' || (n >= 1 && n <= TABS.length)) {
        go(n >= 1 ? TABS[n - 1].id : TABS[(tabIdx + (k === 'e' ? 1 : -1) + TABS.length) % TABS.length].id)
        blip('move')
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const d = e.key === 'ArrowDown' ? 1 : -1
        if (focus === 'cat') setCat((c + d + cats.length) % cats.length)
        else setCur((cur + d + cat.entries.length) % cat.entries.length)
        blip('move')
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setFocus(e.key === 'ArrowRight' ? 'list' : 'cat')
        blip('move')
      } else if (k === 'a' || e.key === 'Enter') {
        if (e.key === 'Enter' && e.target instanceof HTMLButtonElement) return // native click handles it
        blip('select')
        if (focus === 'cat') setFocus('list')
        else confirm(cur)
      } else if ((k === 'b' || e.key === 'Escape') && focus === 'list') {
        setFocus('cat')
        blip('back')
      } else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // From a dossier's proof list, the sommaire or the terminal: show that entry.
  const jump = (to: TabId, id?: string, open = false) => {
    setBreach(null)
    go(to)
    const at = id ? locate(id) : null
    if (at) {
      setPos((p) => ({ ...p, [at.tab]: { c: at.c, i: at.i } }))
      if (open) setBreach({ id: id!, phase: 'open' })
    }
  }

  const endBoot = useCallback(() => {
    setBooting(false)
    try {
      sessionStorage.setItem('nier.booted', '1')
    } catch {
      /* ignore */
    }
  }, [])

  const onOpened = useCallback(() => setBreach((b) => (b ? { ...b, phase: 'open' } : b)), [])
  const phase: Phase = breach?.phase ?? 'idle'
  const hints =
    phase === 'breach'
      ? [['…', 'Déchiffrement']]
      : phase === 'open'
        ? [['▲▼', 'Défiler'], ['B', 'Fermer']]
        : [
            ['Q E', 'Onglet'],
            ['◄►', 'Colonne'],
            ['▲▼', 'Sélection'],
            ['A', focus === 'cat' ? 'Entrer' : entry?.detail ? 'Dossier' : 'Confirmer'],
            ['²', 'Terminal'],
          ]

  return (
    <UiContext.Provider value={ui}>
      <MotionConfig reducedMotion="user">
      <AnimatePresence>{booting && <Boot onDone={endBoot} />}</AnimatePresence>
      <Backdrop />
      {crt && <div className="crt" aria-hidden />}

      <LayoutGroup>
        <div className="flex min-h-dvh flex-col">
          {/* ---- top: tab bar + dotted rule + title ---- */}
          <header className="pt-4 sm:pt-5">
            <nav ref={tabsRef} aria-label="Onglets" className="tabbar px-4 sm:pl-[4.5vw] sm:pr-[3vw]">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-current={t.id === tab}
                  onMouseEnter={() => setDesc(t.desc)}
                  onClick={() => {
                    blip('select')
                    go(t.id)
                  }}
                  className="tab"
                >
                  <span className="pod" aria-hidden />
                  <TabIcon id={t.id} />
                  {t.label}
                </button>
              ))}
            </nav>
            <div className="dot-rule mt-[0.45rem]" aria-hidden />
            <div className="mt-4 flex items-end gap-2 px-4 sm:px-[3vw]">
              <h1 key={tab} className="boot-in page-title">
                {tabDef.label}
                <span className="page-sub">-{tabDef.sub}</span>
              </h1>
              <p className="label mb-1 ml-auto max-sm:hidden">
                {identity.name} // {identity.unit}
              </p>
            </div>
          </header>

          {/* ---- categories | list | fiche ---- */}
          <main className="grid w-full flex-1 grid-cols-1 content-start gap-5 px-4 pt-6 pb-6 sm:px-[3vw] md:grid-cols-[minmax(15rem,34%)_minmax(0,1fr)] xl:grid-cols-[minmax(12rem,17%)_minmax(15rem,24%)_minmax(0,1fr)] xl:grid-rows-[1fr] xl:content-stretch xl:gap-[2.6vw] xl:pl-[4.5vw]">
            {/* categories: vertical panel on large screens, strip below */}
            <div key={`${tab}-cats`} className="boot-in panel max-xl:hidden" data-focus={focus === 'cat'}>
              <span className="rail" aria-hidden />
              <p className="panel-head">{tabDef.sub}</p>
              <div className="panel-rule mb-2" aria-hidden />
              <div role="listbox" aria-label={`Catégories ${tabDef.label}`} className="space-y-1 pr-5 pl-2">
                {cats.map((k, n) => (
                  <Row
                    key={k.id}
                    label={k.label}
                    meta={String(k.entries.length)}
                    glyph={k.glyph}
                    selected={n === c}
                    onSelect={() => {
                      if (n !== c) setCat(n)
                      setFocus('cat')
                    }}
                    onConfirm={() => setFocus('list')}
                  />
                ))}
              </div>
              <span className="track" aria-hidden />
            </div>
            <div role="tablist" aria-label={`Catégories ${tabDef.label}`} className="subtabs flex md:col-span-2 xl:hidden">
              {cats.map((k, n) => (
                <button
                  key={k.id}
                  type="button"
                  role="tab"
                  aria-selected={n === c}
                  onClick={() => {
                    blip('select')
                    setCat(n)
                  }}
                  className="subtab"
                >
                  <GlyphIcon name={k.glyph} className="glyph" />
                  {k.label}
                </button>
              ))}
            </div>

            <div key={`${tab}-${c}`} className="boot-in panel self-start pb-3 xl:self-stretch" data-focus={focus === 'list'}>
              <span className="rail" aria-hidden />
              <p className="panel-head">{cat.label}</p>
              <div className="panel-rule mb-2" aria-hidden />
              <div role="listbox" aria-label={cat.label} className="space-y-1 pr-5 pl-2">
                {cat.entries.map((e, i) => (
                  <Row
                    key={e.id}
                    label={e.label}
                    meta={e.meta}
                    desc={e.desc}
                    selected={i === cur}
                    onSelect={() => {
                      setCur(i)
                      setFocus('list')
                    }}
                    onConfirm={() => confirm(i)}
                  />
                ))}
              </div>
              <span className="track" aria-hidden />
            </div>

            <div className="min-w-0">
              {entry && (
                <MacroWindow
                  id={entry.id}
                  title={entry.title}
                  code={entry.code}
                  detail={!!entry.detail}
                  phase={breach?.id === entry.id ? phase : 'idle'}
                  onBreach={() => setBreach({ id: entry.id, phase: 'breach' })}
                  onOpened={onOpened}
                >
                  {entry.macro}
                </MacroWindow>
              )}
            </div>
          </main>

          {/* ---- bottom help bar + dotted rule ---- */}
          <footer className="sticky bottom-0 z-20 bg-bg/90 pt-2 pb-3 backdrop-blur-[2px]">
            <div className="helpbar mx-4 flex-wrap sm:mx-[3vw]">
              <p key={desc} className="boot-in mr-auto py-1 text-[0.95rem]">
                {desc}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 max-sm:hidden">
                {hints.map(([k, v]) => (
                  <span key={k} className="flex items-center text-[0.9rem]">
                    <span className={`key ${k.length > 1 ? 'pill' : ''}`}>{k}</span>
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="dot-rule mt-3" aria-hidden />
          </footer>
        </div>

        <DetailLayer
          id={breach?.phase === 'open' ? breach.id : null}
          title={breach ? detailTitle(breach.id) : ''}
          onClose={() => setBreach(null)}
        >
          {breach && renderDetail(breach.id, (to, id) => jump(to, id))}
        </DetailLayer>
      </LayoutGroup>

      {terminal !== 'closed' && (
        <div data-mode="hack">
          <Terminal
            visible={terminal === 'open'}
            onExit={() => setTerminal('closed')}
            onMinimize={() => setTerminal('min')}
            onNavigate={(to, id) => {
              if (id) setTerminal('min')
              jump(to, id, !!id)
            }}
          />
          {terminal === 'min' && (
            <button
              type="button"
              onClick={() => setTerminal('open')}
              className="fixed right-4 bottom-28 z-40 border border-line bg-bg px-3 py-2 font-mono text-xs tracking-[0.2em] text-accent hover:bg-sel hover:text-on-sel sm:right-10"
            >
              &gt; TERMINAL_
            </button>
          )}
        </div>
      )}
      </MotionConfig>
    </UiContext.Provider>
  )
}

/** Short boot sequence, once per session. Any key or click skips it. */
function Boot({ onDone }: { onDone: () => void }) {
  const steps = ['YoRHa SYSTEM BOOT', 'MEMORY CHECK ……… OK', `UNIT DATA: ${identity.name.toUpperCase()}`, 'MENU ……… READY']
  const [n, setN] = useState(0)

  useEffect(() => {
    const t = setTimeout(n >= steps.length ? onDone : () => setN(n + 1), n >= steps.length ? 300 : 220)
    return () => clearTimeout(t)
  }, [n, steps.length, onDone])

  useEffect(() => {
    window.addEventListener('keydown', onDone)
    return () => window.removeEventListener('keydown', onDone)
  }, [onDone])

  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-bg" exit={{ opacity: 0, transition: { duration: 0.25 } }} onClick={onDone}>
      <div className="w-[min(30rem,88vw)] tracking-[0.12em]">
        {steps.slice(0, n).map((s) => (
          <p key={s} className="boot-in py-0.5">
            {s}
          </p>
        ))}
        <div className="mt-5 h-2 bg-item">
          <div className="h-full bg-sel transition-[width] duration-200" style={{ width: `${(n / steps.length) * 100}%` }} />
        </div>
        <div className="dot-rule mt-4" aria-hidden />
        <p className="label mt-2">Cliquer ou appuyer sur une touche pour passer</p>
      </div>
    </motion.div>
  )
}
