import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Row, UiContext, modalOpen, useListKeys } from './components/ui'
import { identity, type TabId } from './data/profile'
import { Terminal } from './hack/Terminal'
import { useBlip, usePersistentFlag } from './hooks/useSettings'
import { DetailLayer, MacroWindow, type Phase } from './menu/Breach'
import { detailTitle, renderDetail } from './menu/details'
import { TABS, entriesFor } from './menu/tabs'

const readHash = (): TabId => {
  const h = window.location.hash.slice(1)
  return TABS.some((t) => t.id === h) ? (h as TabId) : 'system'
}
// Deep links: ?open=<id> shows a detail, ?hack=<id> starts its hacking sequence,
// ?skipboot skips the intro.
const params = new URLSearchParams(window.location.search)
const NO_SETTINGS = { crt: false, setCrt: () => {}, sound: false, setSound: () => {}, openTerminal: () => {} }

export default function App() {
  const [tab, setTab] = useState<TabId>(readHash)
  // cursor position per tab; a deep-linked id pre-selects its entry
  const [sel, setSel] = useState<Record<string, number>>(() => {
    const id = params.get('open') ?? params.get('hack')
    const t = readHash()
    const i = id ? entriesFor(t, NO_SETTINGS).findIndex((e) => e.id === id) : -1
    return i >= 0 ? { [t]: i } : {}
  })
  const [breach, setBreach] = useState<{ id: string; phase: Phase } | null>(() => {
    const open = params.get('open')
    const hack = params.get('hack')
    return open ? { id: open, phase: 'open' } : hack ? { id: hack, phase: 'hacking' } : null
  })
  const [terminal, setTerminal] = useState<'closed' | 'open' | 'min'>('closed')
  const [desc, setDesc] = useState(() => TABS.find((t) => t.id === readHash())!.desc)
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

  const tabIdx = TABS.findIndex((t) => t.id === tab)
  const tabDef = TABS[tabIdx]
  const openTerminal = useCallback(() => setTerminal('open'), [])
  const settings = { crt, setCrt, sound, setSound, openTerminal }
  const entries = entriesFor(tab, settings)
  const cur = Math.min(sel[tab] ?? 0, entries.length - 1)
  const entry = entries[cur]
  const setCur = useCallback((i: number) => setSel((s) => ({ ...s, [tab]: i })), [tab])

  const go = useCallback((id: TabId) => {
    setTab(id)
    setDesc(TABS.find((t) => t.id === id)!.desc)
    history.replaceState(null, '', `${window.location.pathname}#${id}`)
  }, [])

  // keep the active tab visible in the scrollable tab bar (mobile)
  useEffect(() => {
    tabsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [tab])

  // Confirm = start hacking for hackable entries, else the entry's own action.
  const confirm = (i: number) => {
    const e = entries[i]
    if (!e) return
    if (e.hackable) setBreach({ id: e.id, phase: 'hacking' })
    else e.onConfirm?.()
  }
  useListKeys(entries.length, cur, setCur, confirm)

  // ←/→ or Q/E switch tabs, 1–7 jump, ² / ` toggles the terminal.
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
      if (e.key === 'ArrowLeft' || k === 'q') go(TABS[(tabIdx - 1 + TABS.length) % TABS.length].id)
      else if (e.key === 'ArrowRight' || k === 'e') go(TABS[(tabIdx + 1) % TABS.length].id)
      else if (n >= 1 && n <= TABS.length) go(TABS[n - 1].id)
      else return
      e.preventDefault()
      blip('move')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tabIdx, booting, go, blip])

  // From a skill's proof list: jump to that tab and select the entry.
  const jump = (to: TabId, id: string) => {
    setBreach(null)
    go(to)
    const i = entriesFor(to, settings).findIndex((e) => e.id === id)
    setSel((s) => ({ ...s, [to]: Math.max(0, i) }))
  }

  const endBoot = useCallback(() => {
    setBooting(false)
    try {
      sessionStorage.setItem('nier.booted', '1')
    } catch {
      /* ignore */
    }
  }, [])

  const phase: Phase = breach?.phase ?? 'idle'
  const hints =
    phase === 'hacking'
      ? [['◄▲▼►', 'Déplacer'], ['AUTO', 'Tir'], ['B', 'Abandonner']]
      : phase === 'open'
        ? [['▲▼', 'Défiler'], ['B', 'Fermer']]
        : [['◄ ►', 'Onglet'], ['▲ ▼', 'Sélection'], ['A', entry?.hackable ? 'Hacker' : 'Confirmer'], ['²', 'Terminal']]

  return (
    <UiContext.Provider value={ui}>
      <AnimatePresence>{booting && <Boot onDone={endBoot} />}</AnimatePresence>
      {crt && <div className="crt" aria-hidden />}

      <LayoutGroup>
        <div className="flex min-h-dvh flex-col">
          {/* ---- top: OS line + tab bar + ▼ rule + title ---- */}
          <header className="px-4 pt-3 sm:px-10">
            <div className="label flex justify-between gap-4">
              <span>YoRHa // {identity.name}</span>
              <span className="max-sm:hidden">{identity.unit}</span>
            </div>
            <nav ref={tabsRef} aria-label="Onglets" className="mt-3 flex overflow-x-auto border-b border-line pb-2 [scrollbar-width:none]">
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
                  {t.label}
                </button>
              ))}
            </nav>
            <div className="tri-rule mt-2" aria-hidden />
            <div className="mt-5 flex items-end gap-4">
              <h1 key={tab} className="boot-in font-display text-4xl leading-none tracking-[0.14em] sm:text-5xl">
                {tabDef.label}
              </h1>
              <p className="label mb-1">
                {tabDef.label} — {tabDef.sub}
              </p>
            </div>
          </header>

          {/* ---- two-column split ---- */}
          <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 content-start gap-6 px-4 py-6 sm:px-10 md:grid-cols-[minmax(15rem,21rem)_minmax(0,1fr)] md:gap-10">
            <div key={tab} role="listbox" aria-label={tabDef.label} className="boot-in space-y-1.5 md:pl-6">
              {entries.map((e, i) => (
                <Row
                  key={e.id}
                  label={e.label}
                  meta={e.meta}
                  desc={e.desc}
                  selected={i === cur}
                  onSelect={() => setCur(i)}
                  onConfirm={() => confirm(i)}
                />
              ))}
            </div>

            <div className="min-w-0">
              {entry && (
                <MacroWindow
                  id={entry.id}
                  title={entry.title}
                  code={entry.code}
                  hackable={!!entry.hackable}
                  phase={breach?.id === entry.id ? phase : 'idle'}
                  onBreach={() => setBreach({ id: entry.id, phase: 'hacking' })}
                  onHacked={() => setBreach({ id: entry.id, phase: 'open' })}
                  onAbort={() => setBreach(null)}
                >
                  {entry.macro}
                </MacroWindow>
              )}
            </div>
          </main>

          {/* ---- bottom status bar ---- */}
          <footer className="sticky bottom-0 z-20 border-t border-line bg-bg/95 px-4 backdrop-blur-sm sm:px-10">
            <div className="flex min-h-10 items-center gap-3 py-2">
              <span className="h-2 w-2 flex-none bg-fg" />
              <p key={desc} className="boot-in text-sm">
                {desc}
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-line/40 py-2">
              {hints.map(([k, v]) => (
                <span key={k} className="label flex items-center text-fg!">
                  <span className="key">{k}</span>
                  {v}
                </span>
              ))}
            </div>
          </footer>
        </div>

        <DetailLayer
          id={breach?.phase === 'open' ? breach.id : null}
          title={breach ? detailTitle(breach.id) : ''}
          onClose={() => setBreach(null)}
        >
          {breach && renderDetail(breach.id, jump)}
        </DetailLayer>
      </LayoutGroup>

      {terminal !== 'closed' && (
        <div data-mode="hack">
          <Terminal
            visible={terminal === 'open'}
            onExit={() => setTerminal('closed')}
            onMinimize={() => setTerminal('min')}
            onNavigate={(to, id) => {
              go(to)
              if (id) {
                setTerminal('min')
                setBreach({ id, phase: 'open' })
              }
            }}
          />
          {terminal === 'min' && (
            <button
              type="button"
              onClick={() => setTerminal('open')}
              className="fixed right-4 bottom-28 z-40 border border-line bg-bg px-3 py-2 font-display text-xs tracking-[0.2em] text-accent hover:bg-sel hover:text-on-sel sm:right-10"
            >
              &gt; TERMINAL_
            </button>
          )}
        </div>
      )}
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
      <div className="w-[min(30rem,88vw)] font-display tracking-[0.15em]">
        {steps.slice(0, n).map((s) => (
          <p key={s} className="boot-in py-0.5">
            {s}
          </p>
        ))}
        <div className="mt-5 h-1.5 border border-line">
          <div className="h-full bg-sel transition-[width] duration-200" style={{ width: `${(n / steps.length) * 100}%` }} />
        </div>
        <p className="label mt-3">Cliquer ou appuyer sur une touche pour passer</p>
      </div>
    </motion.div>
  )
}
