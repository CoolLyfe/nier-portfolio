import { useCallback, useEffect, useRef, useState } from 'react'

/** Boolean preference persisted in localStorage (fails silently if storage is blocked). */
export function usePersistentFlag(key: string, initial: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? initial : stored === '1'
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, value ? '1' : '0')
    } catch {
      /* storage unavailable: keep in-memory value */
    }
  }, [key, value])

  return [value, setValue] as const
}

/**
 * Tiny synthesized UI blip (no audio files). Muted unless `enabled`.
 * `kind` changes pitch: move = cursor move, select = confirm, back = cancel.
 */
export function useBlip(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  return useCallback(
    (kind: 'move' | 'select' | 'back' = 'move') => {
      if (!enabled) return
      try {
        ctxRef.current ??= new AudioContext()
        const ctx = ctxRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const freq = { move: 1320, select: 880, back: 440 }[kind]
        osc.type = 'square'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.03, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
        osc.connect(gain).connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.07)
      } catch {
        /* Web Audio unsupported */
      }
    },
    [enabled],
  )
}
