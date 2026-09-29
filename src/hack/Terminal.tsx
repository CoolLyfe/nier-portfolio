import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { projects, type TabId } from '../data/profile'
import { TABS } from '../menu/tabs'
import { cvJson, cvMarkdown, download } from './cv'
import { FILES, findFile } from './files'

type Tone = 'out' | 'cmd' | 'ok' | 'err' | 'warn' | 'sys'
interface Line {
  id: number
  text: string
  tone: Tone
}

const TONE: Record<Tone, string> = {
  out: 'text-fg',
  cmd: 'text-beige',
  ok: 'text-[#ff6a2b]',
  err: 'text-[#ff2e3f]',
  warn: 'text-[#ffb13b]',
  sys: 'text-dim',
}

const COMMANDS = ['help', 'ls', 'cat', 'crack', 'download', 'open', 'whoami', 'clear', 'history', 'exit']
const PROMPT = 'root@yorha:~$'
const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()

let nextId = 0
const mk = (text: string, tone: Tone = 'out'): Line => ({ id: nextId++, text, tone })

/**
 * HACKING MODE terminal. Commands: ls, cat, crack (mini-challenge:
 * retype an access key), download cv, open, etc.
 */
export function Terminal({
  visible,
  onExit,
  onMinimize,
  onNavigate,
}: {
  visible: boolean
  onExit: () => void
  onMinimize: () => void
  onNavigate: (tab: TabId, openId?: string) => void
}) {
  const [lines, setLines] = useState<Line[]>(() => [
    mk('YORHA_OS v11.4 — OVERRIDE ACCEPTED', 'ok'),
    mk('Connexion établie avec l’unité LEYMONIE. Accès root temporaire.', 'sys'),
    mk('Tapez `help` pour la liste des commandes.', 'sys'),
    mk(''),
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const [cracked, setCracked] = useState<Set<string>>(new Set())
  const [challenge, setChallenge] = useState<{ path: string; key: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const print = (...ls: Line[]) => setLines((prev) => [...prev, ...ls])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])
  useEffect(() => {
    if (visible) inputRef.current?.focus()
  }, [busy, visible])

  /* Animated decryption: scrolling hex + progress bar, then contents. */
  const runCrack = (path: string) => {
    setBusy(true)
    const f = FILES.find((x) => x.path === path)!
    const progressId = nextId++
    let step = 0
    const timer = setInterval(() => {
      step++
      const bar = '#'.repeat(step) + '-'.repeat(20 - step)
      setLines((prev) => [
        ...prev.filter((l) => l.id !== progressId),
        { id: progressId, text: `DECRYPT [${bar}] ${String(step * 5).padStart(3)}%  0x${hex(8)} ${hex(8)}`, tone: 'warn' },
      ])
      if (step >= 20) {
        clearInterval(timer)
        const next = new Set(cracked).add(path)
        setCracked(next)
        const total = FILES.filter((x) => x.encrypted).length
        print(mk('ACCÈS ACCORDÉ.', 'ok'), mk(''), ...f.content().map((t) => mk(t)), mk(''), mk(`Archives déchiffrées : ${next.size}/${total}`, 'sys'))
        setBusy(false)
      }
    }, 55)
  }

  const exec = (raw: string) => {
    const cmdLine = raw.trim()
    print(mk(`${PROMPT} ${cmdLine}`, 'cmd'))
    if (!cmdLine) return

    // pending crack challenge: the next input must be the access key
    if (challenge) {
      const { path, key } = challenge
      setChallenge(null)
      if (cmdLine.toUpperCase() === key) runCrack(path)
      else print(mk('CLÉ INVALIDE. Contre-mesure déclenchée — réessayez `crack`.', 'err'))
      return
    }

    setHistory((h) => [cmdLine, ...h].slice(0, 50))
    const [cmd, ...args] = cmdLine.split(/\s+/)
    const arg = args.join(' ')
    const low = cmdLine.toLowerCase()

    // easter eggs
    if (low === 'glory to mankind') return print(mk('Glory to mankind.', 'ok'))
    if (low === '2b' || low === '9s' || low === 'a2') return print(mk('Unité non trouvée sur ce réseau. Seule l’unité LEYMONIE est en ligne.', 'warn'))
    if (cmd === 'sudo') return print(mk('Vous êtes déjà root. Un peu de confiance, voyons.', 'warn'))
    if (low.startsWith('rm ')) return print(mk('Suppression refusée : les données de l’unité sont protégées par la Bunker.', 'err'))

    switch (cmd) {
      case 'help':
        return print(
          mk('COMMANDES DISPONIBLES', 'sys'),
          mk('  ls [-a]              lister les fichiers (-a : fichiers cachés)'),
          mk('  cat <fichier>        afficher un fichier'),
          mk('  crack <fichier>      déchiffrer une archive .enc'),
          mk('  download cv [--json] exporter le CV structuré'),
          mk('  open <onglet|projet> ouvrir dans l’interface (map, intel, system, myst…)'),
          mk('  whoami | history | clear | exit'),
        )
      case 'ls': {
        const all = args.includes('-a')
        const shown = FILES.filter((f) => all || !f.hidden)
        print(
          ...shown.map((f) => {
            const lock = f.encrypted ? (cracked.has(f.path) ? '  [DÉCHIFFRÉ]' : '  [CHIFFRÉ]') : ''
            return mk(`  ${f.path}${lock}`, f.encrypted && !cracked.has(f.path) ? 'warn' : 'out')
          }),
          mk('  cv.md', 'out'),
        )
        if (!all) print(mk('Anomalie : des fichiers cachés ont été détectés.', 'sys'))
        return
      }
      case 'cat': {
        if (arg === 'cv.md') return print(...cvMarkdown().split('\n').map((t) => mk(t)))
        const f = findFile(arg)
        if (!f) return print(mk(`cat: ${arg || '?'}: fichier introuvable`, 'err'))
        if (f.encrypted && !cracked.has(f.path))
          return print(mk(`${f.path}: ${hex(24)}${hex(24)}`, 'sys'), mk('Fichier chiffré. Utilisez `crack`.', 'warn'))
        return print(...f.content().map((t) => mk(t)))
      }
      case 'crack': {
        const f = findFile(arg)
        if (!f) return print(mk(`crack: ${arg || '?'}: cible introuvable`, 'err'))
        if (!f.encrypted) return print(mk(`${f.path} n’est pas chiffré. Utilisez \`cat\`.`, 'warn'))
        if (cracked.has(f.path)) return print(mk('Déjà déchiffré.', 'sys'))
        if (f.master) {
          const others = FILES.filter((x) => x.encrypted && !x.master)
          if (!others.every((x) => cracked.has(x.path)))
            return print(mk('CLÉ MAÎTRE REQUISE. Déchiffrez d’abord toutes les autres archives de .blackbox/.', 'err'))
        }
        const key = hex(4)
        setChallenge({ path: f.path, key })
        return print(mk(`Pare-feu détecté sur ${f.path}.`, 'warn'), mk(`Recopiez la clé d’accès pour contourner : ${key}`, 'ok'))
      }
      case 'download': {
        if (args[0] !== 'cv') return print(mk('usage: download cv [--json]', 'err'))
        if (args.includes('--json')) download('Louis_Leymonie_CV.json', cvJson(), 'application/json')
        else download('Louis_Leymonie_CV.md', cvMarkdown(), 'text/markdown')
        return print(mk('Transfert terminé. CV exporté.', 'ok'))
      }
      case 'open': {
        const s = TABS.find((x) => x.id === arg.toLowerCase())
        if (s) {
          print(mk(`Ouverture de ${s.label}…`, 'ok'))
          return onNavigate(s.id)
        }
        const p = projects.find((x) => x.id === arg.toLowerCase() || x.code.toLowerCase() === arg.toLowerCase())
        if (p) {
          print(mk(`Ouverture de l’archive ${p.code}…`, 'ok'))
          return onNavigate('intel', p.id)
        }
        return print(mk(`open: ${arg || '?'}: cible inconnue`, 'err'))
      }
      case 'whoami':
        return print(mk('root — mais le vrai propriétaire de ce système est Louis Leymonie.'))
      case 'history':
        return print(...history.map((h, i) => mk(`  ${String(history.length - i).padStart(3)}  ${h}`)))
      case 'clear':
        return setLines([])
      case 'exit':
        return onExit()
      default:
        return print(mk(`${cmd}: commande inconnue. Tapez \`help\`.`, 'err'))
    }
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (busy) return
      exec(input)
      setInput('')
      setHIdx(-1)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const i = Math.max(-1, Math.min(history.length - 1, hIdx + (e.key === 'ArrowUp' ? 1 : -1)))
      setHIdx(i)
      setInput(i === -1 ? '' : history[i])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const parts = input.split(' ')
      const last = parts.pop() ?? ''
      const pool = parts.length === 0 ? COMMANDS : [...FILES.map((f) => f.path), 'cv', 'cv.md', ...TABS.map((s) => s.id)]
      const hits = pool.filter((p) => p.startsWith(last))
      if (hits.length === 1) setInput([...parts, hits[0]].join(' '))
      else if (hits.length > 1) print(mk(hits.join('   '), 'sys'))
    } else if (e.key === 'Escape') {
      onMinimize()
    }
  }

  return (
    // stays mounted while minimized so the session (history, cracked files) survives
    <motion.div
      data-modal={visible ? '' : undefined}
      hidden={!visible}
      initial={{ opacity: 0, scaleY: 0.02 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.02 }}
      transition={{ type: 'tween', ease: [0.76, 0, 0.18, 1], duration: 0.35 }}
      className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:right-8 sm:bottom-24 sm:w-[min(46rem,calc(100vw-4rem))]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="win">
        <div className="win-edge bevel">
          <div className="win-body">
            <div className="flex items-center gap-3 bg-accent px-4 py-1.5 pl-6 text-bg">
              <span className="font-display text-xs tracking-[0.2em]">■ TERMINAL // ROOT@YORHA</span>
              <button type="button" onClick={onMinimize} className="ml-auto font-display text-xs tracking-[0.2em] hover:underline">
                RÉDUIRE _
              </button>
              <button type="button" onClick={onExit} className="font-display text-xs tracking-[0.2em] hover:underline">
                EXIT ×
              </button>
            </div>
            <div ref={scrollRef} className="h-[50vh] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-[55vh]">
              {lines.map((l) => (
                <pre key={l.id} className={`break-words whitespace-pre-wrap ${TONE[l.tone]}`}>
                  {l.text || ' '}
                </pre>
              ))}
              <div className="flex gap-2">
                <span className="text-beige">{challenge ? 'KEY>' : PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  disabled={busy}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Commande"
                  className="min-w-0 flex-1 bg-transparent text-fg caret-[#ff6a2b] outline-none focus-visible:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
