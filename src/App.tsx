import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Backdrop } from './components/Backdrop'
import { GlyphIcon, TabIcon } from './components/icons'
import { PodProvider, usePod } from './components/Pod'
import { Row, UiContext, modalOpen } from './components/ui'
import { translator, type Lang } from './data/lang'
import { PROFILES, type TabId } from './data/profile'
import { STRINGS } from './data/strings'
import { Terminal } from './hack/Terminal'
import { Home } from './home/Home'
import { useAmbient } from './hooks/useAmbient'
import { useBlip, usePersistentFlag } from './hooks/useSettings'
import { LangContext, initialLang, useLang } from './i18n'
import { DetailLayer, MacroWindow, type Phase } from './menu/Breach'
import { detailTitle, renderDetail } from './menu/details'
import { NO_ACTIONS, TAB_IDS, categoriesFor, locate, tabDef, type Actions } from './menu/tabs'

type Pos = { c: number; i: number }

const readHash = (): TabId => {
  const h = window.location.hash.slice(1) as TabId
  return TAB_IDS.includes(h) ? h : 'home'
}
// Deep links: ?open=<id> shows a dossier (?hack=<id> is kept as an alias),
// ?skipboot skips the intro, ?lang=en|fr forces the language.
const params = new URLSearchParams(window.location.search)
const deepId = params.get('open') ?? params.get('hack')
const deep = deepId ? locate(deepId) : null
const deepOpen = !!deep && !!categoriesFor(deep.tab, PROFILES.fr, translator('fr'), NO_ACTIONS)[deep.c].entries[deep.i].detail

/** Language + settings that must exist above the Pod. */
export default function App() {
  const [lang, setLangState] = useState<Lang>(() => {
    const forced = params.get('lang')
    return forced === 'fr' || forced === 'en' ? forced : initialLang()
  })
  const [podAwake, setPodAwake] = usePersistentFlag('nier.pod', true)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('nier.lang', l)
    } catch {
      /* storage unavailable */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, P: PROFILES[lang], S: STRINGS[lang], t: translator(lang) }), [lang, setLang])

  return (
    <LangContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <PodProvider awake={podAwake} setAwake={setPodAwake}>
          <Menu podAwake={podAwake} setPodAwake={setPodAwake} />
        </PodProvider>
      </MotionConfig>
    </LangContext.Provider>
  )
}

function Menu({ podAwake, setPodAwake }: { podAwake: boolean; setPodAwake: (v: boolean) => void }) {
  const { lang, setLang, P, S, t } = useLang()
  const { say } = usePod()
  const [tab, setTab] = useState<TabId>(() => deep?.tab ?? readHash())
  // cursor per tab: category + entry; a deep-linked id pre-selects its entry
  const [pos, setPos] = useState<Partial<Record<TabId, Pos>>>(() => (deep ? { [deep.tab]: { c: deep.c, i: deep.i } } : {}))
  // which column the arrows drive, as in the game's two-level menus
  const [focus, setFocus] = useState<'cat' | 'list'>('list')
  const [breach, setBreach] = useState<{ id: string; phase: Phase } | null>(() => (deepOpen && deepId ? { id: deepId, phase: 'open' } : null))
  const [terminal, setTerminal] = useState<'closed' | 'open' | 'min'>('closed')
  const [desc, setDesc] = useState(() => tabDef(lang, deep?.tab ?? readHash()).desc)
  const [crt, setCrt] = usePersistentFlag('nier.crt', true)
  const [sound, setSound] = usePersistentFlag('nier.sound', false)
  // never persisted: browsers only allow audio to start from a click
  const [ambient, setAmbientState] = useState(false)
  const [booting, setBooting] = useState(() => {
    try {
      return !params.has('skipboot') && sessionStorage.getItem('nier.booted') !== '1'
    } catch {
      return true
    }
  })
  const blip = useBlip(sound)
  useAmbient(ambient)
  const ui = useMemo(() => ({ blip, setDesc }), [blip])
  const tabsRef = useRef<HTMLElement>(null)

  const setAmbient = useCallback(
    (v: boolean) => {
      setAmbientState(v)
      say(v ? S.pod.ambientOn : S.pod.ambientOff)
    },
    [say, S],
  )
  const switchLang = useCallback(
    (l: Lang) => {
      setLang(l)
      setDesc(tabDef(l, tab).desc)
      say(STRINGS[l].pod.lang)
    },
    [setLang, say, tab],
  )

  const go = useCallback(
    (id: TabId) => {
      setTab(id)
      setFocus('list')
      setDesc(tabDef(lang, id).desc)
      say(tabDef(lang, id).pod)
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`)
      window.scrollTo({ top: 0 })
    },
    [lang, say],
  )

  const tabIdx = TAB_IDS.indexOf(tab)
  const def = S.tabs[tabIdx]
  const openTerminal = useCallback(() => setTerminal('open'), [])
  const actions: Actions = { crt, setCrt, sound, setSound, ambient, setAmbient, podAwake, setPodAwake, lang, setLang: switchLang, openTerminal, go }
  const cats = categoriesFor(tab, P, t, actions)
  const isHome = cats.length === 0
  const c = isHome ? 0 : Math.min(pos[tab]?.c ?? 0, cats.length - 1)
  const cat = cats[c]
  const cur = cat ? Math.min(pos[tab]?.i ?? 0, cat.entries.length - 1) : 0
  const entry = cat?.entries[cur]
  const setCat = useCallback((n: number) => setPos((p) => ({ ...p, [tab]: { c: n, i: 0 } })), [tab])
  const setCur = useCallback((n: number) => setPos((p) => ({ ...p, [tab]: { c, i: n } })), [tab, c])

  // Pod comments on the selected entry when it has something to say
  const entryPod = entry?.pod
  useEffect(() => say(entryPod), [entryPod, say])

  // keep the active tab visible in the scrollable tab bar (mobile)
  useEffect(() => {
    tabsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [tab])

  // Confirm = open the dossier when there is one, else the entry's own action.
  const confirm = (i: number) => {
    const e = cat?.entries[i]
    if (!e) return
    if (e.detail) {
      setBreach({ id: e.id, phase: 'breach' })
      say(S.pod.breach)
    } else e.onConfirm?.()
  }

  // Q/E or 1–7 switch tabs, ←/→ switch column, ↑/↓ move, A confirm, B back, ² terminal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea') || e.metaKey || e.ctrlKey || e.altKey || booting) return
      if (e.key === '`' || e.key === '²') {
        setTerminal((x) => (x === 'open' ? 'min' : 'open'))
        return
      }
      if (modalOpen()) return
      const k = e.key.toLowerCase()
      const n = Number(e.key)
      if (k === 'q' || k === 'e' || (n >= 1 && n <= TAB_IDS.length)) {
        go(n >= 1 ? TAB_IDS[n - 1] : TAB_IDS[(tabIdx + (k === 'e' ? 1 : -1) + TAB_IDS.length) % TAB_IDS.length])
        blip('move')
      } else if (isHome) {
        return
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const d = e.key === 'ArrowDown' ? 1 : -1
        if (focus === 'cat') setCat((c + d + cats.length) % cats.length)
        else setCur((cur + d + cat.entries.length) % cat.entries.length)
        blip('move')
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setFocus(e.key === 'ArrowRight' ? 'list' : 'cat')
        blip('move')
      } else if (k === 'a' || e.key === 'Enter') {
        if (e.key === 'Enter' && (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) return // native click handles it
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

  // From a dossier's proof list or the terminal: show that entry.
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
  const hints: [string, string][] =
    phase === 'breach'
      ? [['…', t('Déchiffrement', 'Decrypting')]]
      : phase === 'open'
        ? [
            ['▲▼', t('Défiler', 'Scroll')],
            ['B', t('Fermer', 'Close')],
          ]
        : isHome
          ? [
              ['Q E', t('Onglet', 'Tab')],
              ['1–7', t('Accès direct', 'Jump')],
              [lang === 'fr' ? '²' : '`', 'Terminal'],
            ]
          : [
              ['Q E', t('Onglet', 'Tab')],
              ['◄►', t('Colonne', 'Column')],
              ['▲▼', t('Sélection', 'Select')],
              ['A', focus === 'cat' ? t('Entrer', 'Enter') : entry?.detail ? t('Dossier', 'File') : t('Confirmer', 'Confirm')],
              [lang === 'fr' ? '²' : '`', 'Terminal'],
            ]

  return (
    <UiContext.Provider value={ui}>
      <AnimatePresence>{booting && <Boot onDone={endBoot} />}</AnimatePresence>
      <Backdrop />
      {crt && <div className="crt" aria-hidden />}

      <LayoutGroup>
        <div className="flex min-h-dvh flex-col">
          {/* ---- top: tab bar + dotted rule + title ---- */}
          <header className="pt-4 sm:pt-5">
            <nav ref={tabsRef} aria-label={t('Onglets', 'Tabs')} className="tabbar px-4 sm:pl-[4.5vw] sm:pr-[3vw]">
              {S.tabs.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-current={x.id === tab}
                  onMouseEnter={() => setDesc(x.desc)}
                  onClick={() => {
                    blip('select')
                    go(x.id)
                  }}
                  className="tab"
                >
                  <span className="pod" aria-hidden />
                  <TabIcon id={x.id} />
                  {x.label}
                </button>
              ))}
            </nav>
            <div className="dot-rule mt-[0.45rem]" aria-hidden />
            <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-3 px-4 sm:px-[3vw]">
              <h1 key={`${tab}-${lang}`} className="soft-in page-title">
                {def.label}
                <span className="page-sub">-{def.sub}</span>
              </h1>
              <QuickBar lang={lang} setLang={switchLang} ambient={ambient} setAmbient={setAmbient} />
            </div>
          </header>

          {isHome ? (
            <main className="w-full flex-1 px-4 pt-6 pb-8 sm:px-[3vw] xl:pl-[4.5vw]">
              <Home go={go} />
            </main>
          ) : (
            /* ---- categories | list | fiche ---- */
            <main className="grid w-full flex-1 grid-cols-1 content-start gap-5 px-4 pt-6 pb-6 sm:px-[3vw] md:grid-cols-[minmax(15rem,34%)_minmax(0,1fr)] xl:grid-cols-[minmax(12rem,17%)_minmax(15rem,24%)_minmax(0,1fr)] xl:grid-rows-[1fr] xl:content-stretch xl:gap-[2.6vw] xl:pl-[4.5vw]">
              {/* categories: vertical panel on large screens, strip below */}
              <div key={`${tab}-cats`} className="soft-in panel max-xl:hidden" data-focus={focus === 'cat'}>
                <span className="rail" aria-hidden />
                <p className="panel-head">{def.sub}</p>
                <div className="panel-rule mb-2" aria-hidden />
                <div role="listbox" aria-label={def.label} className="space-y-1 pr-5 pl-2">
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
              <div role="tablist" aria-label={def.label} className="subtabs flex md:col-span-2 xl:hidden">
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

              <div key={`${tab}-${c}`} className="soft-in panel self-start pb-3 xl:self-stretch" data-focus={focus === 'list'}>
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
                    onBreach={() => confirm(cur)}
                    onOpened={onOpened}
                  >
                    {entry.macro}
                  </MacroWindow>
                )}
              </div>
            </main>
          )}

          {/* ---- bottom help bar + dotted rule ---- */}
          <footer className="sticky bottom-0 z-20 bg-bg/90 pt-2 pb-3 backdrop-blur-[2px]">
            <div className="helpbar mx-4 flex-wrap sm:mx-[3vw]">
              <p key={desc} className="soft-in mr-auto py-1 text-[0.95rem]">
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

        <DetailLayer id={breach?.phase === 'open' ? breach.id : null} title={breach ? detailTitle(P, breach.id) : ''} onClose={() => setBreach(null)}>
          {breach && renderDetail(P, t, breach.id, (to, id) => jump(to, id))}
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
              className="fixed bottom-28 left-4 z-40 border border-line bg-bg px-3 py-2 font-mono text-xs tracking-[0.2em] text-accent hover:bg-sel hover:text-on-sel sm:left-10"
            >
              &gt; TERMINAL_
            </button>
          )}
        </div>
      )}
    </UiContext.Provider>
  )
}

/** Language switch and ambient sound, always at hand next to the title. */
function QuickBar({ lang, setLang, ambient, setAmbient }: { lang: Lang; setLang: (l: Lang) => void; ambient: boolean; setAmbient: (v: boolean) => void }) {
  const { t } = useLang()
  return (
    <div className="mb-1 ml-auto flex items-center gap-2">
      <button
        type="button"
        className="quick"
        aria-pressed={ambient}
        onClick={() => setAmbient(!ambient)}
        title={t('Ambiance sonore', 'Ambient sound')}
      >
        <span className={`eq ${ambient ? 'on' : ''}`} aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
        {t('AMBIANCE', 'AMBIENCE')}
      </button>
      <div className="quick p-0!" role="radiogroup" aria-label={t('Langue', 'Language')}>
        {(['fr', 'en'] as const).map((l) => (
          <button key={l} type="button" role="radio" aria-checked={lang === l} onClick={() => setLang(l)} className="quick-seg">
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Short boot sequence, once per session. Any key or click skips it. */
function Boot({ onDone }: { onDone: () => void }) {
  const { P, t } = useLang()
  const steps = ['YoRHa SYSTEM BOOT', t('MÉMOIRE ……… OK', 'MEMORY ……… OK'), `UNIT DATA: ${P.identity.name.toUpperCase()}`, t('MENU ……… PRÊT', 'MENU ……… READY')]
  const [n, setN] = useState(0)

  useEffect(() => {
    const id = setTimeout(n >= steps.length ? onDone : () => setN(n + 1), n >= steps.length ? 350 : 260)
    return () => clearTimeout(id)
  }, [n, steps.length, onDone])

  useEffect(() => {
    window.addEventListener('keydown', onDone)
    return () => window.removeEventListener('keydown', onDone)
  }, [onDone])

  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-bg" exit={{ opacity: 0, transition: { duration: 0.6 } }} onClick={onDone}>
      <div className="w-[min(30rem,88vw)] tracking-[0.12em]">
        {steps.slice(0, n).map((s) => (
          <p key={s} className="soft-in py-0.5">
            {s}
          </p>
        ))}
        <div className="mt-5 h-2 bg-item">
          <div className="h-full bg-sel transition-[width] duration-200" style={{ width: `${(n / steps.length) * 100}%` }} />
        </div>
        <div className="dot-rule mt-4" aria-hidden />
        <p className="label mt-2">{t('Cliquer ou appuyer sur une touche pour passer', 'Click or press any key to skip')}</p>
      </div>
    </motion.div>
  )
}
