import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Expanded } from './components/Expanded'
import { BottomBar, SECTIONS, TopBar, Watermarks } from './components/Shell'
import { UiContext } from './components/ui'
import { identity, type SectionId } from './data/profile'
import { Terminal } from './hack/Terminal'
import { useBlip, usePersistentFlag } from './hooks/useSettings'
import { Comms } from './sections/Comms'
import { Intel } from './sections/Intel'
import { Logs } from './sections/Logs'
import { System } from './sections/System'

const readHash = (): SectionId => {
  const h = window.location.hash.slice(1)
  return SECTIONS.some((s) => s.id === h) ? (h as SectionId) : 'system'
}

// Deep links: ?open=<project|log id> opens a window, ?hack starts in hacking mode.
const params = new URLSearchParams(window.location.search)

const typing = (e: KeyboardEvent) => (e.target as HTMLElement).closest('input, textarea') !== null

export default function App() {
  const [section, setSection] = useState<SectionId>(readHash)
  const [logsTab, setLogsTab] = useState(0)
  const [openId, setOpenId] = useState<string | null>(() => params.get('open'))
  const [hack, setHack] = useState(() => params.has('hack'))
  const [termVisible, setTermVisible] = useState(() => params.has('hack'))
  const [desc, setDesc] = useState(() => SECTIONS.find((s) => s.id === readHash())!.desc)
  const [crt, setCrt] = usePersistentFlag('yorha.crt', true)
  const [sound, setSound] = usePersistentFlag('yorha.sound', false)
  const [booting, setBooting] = useState(() => {
    try {
      return !params.has('skipboot') && sessionStorage.getItem('yorha.booted') !== '1'
    } catch {
      return true
    }
  })
  const blip = useBlip(sound)
  const ui = useMemo(() => ({ blip, setDesc }), [blip])

  const go = useCallback((id: SectionId) => {
    setSection(id)
    setDesc(SECTIONS.find((s) => s.id === id)!.desc)
    history.replaceState(null, '', `#${id}`)
  }, [])

  // Hacking mode: glitch burst, swap theme variables, open the terminal.
  const toggleHack = useCallback(() => {
    document.body.classList.add('glitching')
    setTimeout(() => document.body.classList.remove('glitching'), 540)
    setTimeout(() => {
      setHack((h) => {
        setTermVisible(!h)
        return !h
      })
    }, 160)
    blip('select')
  }, [blip])

  useEffect(() => {
    document.documentElement.dataset.mode = hack ? 'hack' : 'system'
  }, [hack])

  useEffect(() => {
    const onPop = () => setSection(readHash())
    window.addEventListener('hashchange', onPop)
    return () => window.removeEventListener('hashchange', onPop)
  }, [])

  // Global keys: 1–4 / Q E switch category, ` toggles hacking mode.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (typing(e) || e.metaKey || e.ctrlKey || e.altKey || openId || booting) return
      const idx = SECTIONS.findIndex((s) => s.id === section)
      const n = Number(e.key)
      if (n >= 1 && n <= SECTIONS.length) go(SECTIONS[n - 1].id)
      else if (e.key.toLowerCase() === 'q') go(SECTIONS[(idx - 1 + SECTIONS.length) % SECTIONS.length].id)
      else if (e.key.toLowerCase() === 'e') go(SECTIONS[(idx + 1) % SECTIONS.length].id)
      else if (e.key === '`' || e.key === '²') return toggleHack()
      else return
      blip('select')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [section, openId, booting, go, blip, toggleHack])

  const endBoot = useCallback(() => {
    setBooting(false)
    try {
      sessionStorage.setItem('yorha.booted', '1')
    } catch {
      /* ignore */
    }
  }, [])

  const sectionIdx = SECTIONS.findIndex((s) => s.id === section)

  return (
    <UiContext.Provider value={ui}>
      <AnimatePresence>{booting && <Boot onDone={endBoot} />}</AnimatePresence>
      {crt && <div className="crt" aria-hidden />}
      {hack && (
        <>
          <div className="hack-floor" aria-hidden />
          <div className="hack-horizon" aria-hidden />
        </>
      )}
      <Watermarks section={sectionIdx} />

      <LayoutGroup>
        <div id="app" className="relative z-10 flex min-h-dvh flex-col">
          <TopBar active={section} onSelect={go} hack={hack} onHack={toggleHack} />

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-10 sm:py-8">
            <div key={section} className="boot-in">
              {section === 'system' && <System />}
              {section === 'intel' && <Intel onOpen={setOpenId} />}
              {section === 'logs' && <Logs tab={logsTab} setTab={setLogsTab} onOpen={setOpenId} />}
              {section === 'comms' && <Comms />}
            </div>
          </main>

          <BottomBar desc={desc} crt={crt} setCrt={setCrt} sound={sound} setSound={setSound} />
        </div>

        <Expanded id={openId} onClose={() => setOpenId(null)} />
      </LayoutGroup>

      {hack && (
        <>
          <Terminal
            visible={termVisible}
            onExit={toggleHack}
            onMinimize={() => setTermVisible(false)}
            onNavigate={(s, id) => {
              go(s)
              if (id) {
                setTermVisible(false)
                setOpenId(id)
              }
            }}
          />
          {!termVisible && (
            <button
              type="button"
              onClick={() => setTermVisible(true)}
              className="fixed right-4 bottom-24 z-40 border border-accent bg-bg px-3 py-2 font-display text-xs tracking-[0.2em] text-accent hover:bg-accent hover:text-bg sm:right-8"
            >
              &gt; TERMINAL_
            </button>
          )}
        </>
      )}
    </UiContext.Provider>
  )
}

/** Short boot sequence, once per session. Any key or click skips it. */
function Boot({ onDone }: { onDone: () => void }) {
  const steps = [
    'YORHA_OS v11.4 ………………………… BOOT',
    'MEMORY CHECK ……………………………… OK',
    `LOADING UNIT DATA: ${identity.name.toUpperCase()}`,
    'PERSONALITY DATA ……………………… OK',
    'SYSTEM MENU ………………………………… READY',
  ]
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n >= steps.length) {
      const t = setTimeout(onDone, 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setN(n + 1), 230)
    return () => clearTimeout(t)
  }, [n, steps.length, onDone])

  useEffect(() => {
    window.addEventListener('keydown', onDone)
    return () => window.removeEventListener('keydown', onDone)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-bg"
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      onClick={onDone}
    >
      <div className="w-[min(34rem,90vw)] font-display text-sm tracking-[0.15em]">
        {steps.slice(0, n).map((s) => (
          <p key={s} className="boot-in py-0.5">
            {s}
          </p>
        ))}
        <div className="mt-5 h-1.5 border border-line">
          <div className="h-full bg-fg transition-[width] duration-200" style={{ width: `${(n / steps.length) * 100}%` }} />
        </div>
        <p className="label mt-3">Cliquer ou appuyer sur une touche pour passer</p>
      </div>
    </motion.div>
  )
}
