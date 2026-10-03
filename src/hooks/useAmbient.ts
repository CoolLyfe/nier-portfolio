import { useEffect } from 'react'

/* ------------------------------------------------------------------
   Ambient sound, synthesised live (no audio files): a soft D minor
   drone breathing through a slow filter, and sparse bell notes with a
   long echo, in the spirit of the game's quiet menu themes.
   Off by default; only ever started from a click on the toggle.
   ------------------------------------------------------------------ */

const DRONE = [73.42, 110, 146.83, 220.0] // D2 A2 D3 A3
const BELLS = [587.33, 698.46, 880, 1046.5, 1174.66, 1318.51] // D5 F5 A5 C6 D6 E6
const LEVEL = 0.055

export function useAmbient(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    let ctx: AudioContext
    try {
      ctx = new AudioContext()
    } catch {
      return
    }

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(LEVEL, ctx.currentTime + 4)
    master.connect(ctx.destination)

    // drone: detuned sines and a triangle through a breathing low-pass
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 520
    filter.Q.value = 0.7
    const lfo = ctx.createOscillator()
    const lfoDepth = ctx.createGain()
    lfo.frequency.value = 0.045
    lfoDepth.gain.value = 260
    lfo.connect(lfoDepth).connect(filter.frequency)
    lfo.start()
    filter.connect(master)

    const voices = DRONE.flatMap((f, i) =>
      [-4, 4].map((cents) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = i === 1 ? 'triangle' : 'sine'
        o.frequency.value = f
        o.detune.value = cents
        g.gain.value = [0.5, 0.22, 0.3, 0.12][i]
        o.connect(g).connect(filter)
        o.start()
        return o
      }),
    )

    // bells: a feedback delay gives them a long, soft tail
    const delay = ctx.createDelay(2)
    const feedback = ctx.createGain()
    const wet = ctx.createGain()
    delay.delayTime.value = 0.62
    feedback.gain.value = 0.48
    wet.gain.value = 0.5
    delay.connect(feedback).connect(delay)
    delay.connect(wet).connect(master)

    const bell = () => {
      const now = ctx.currentTime
      const f = BELLS[Math.floor(Math.random() * BELLS.length)]
      for (const [mult, amp] of [
        [1, 0.32],
        [2.01, 0.08],
      ]) {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = f * mult
        g.gain.setValueAtTime(0, now)
        g.gain.linearRampToValueAtTime(amp, now + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2)
        o.connect(g)
        g.connect(master)
        g.connect(delay)
        o.start(now)
        o.stop(now + 3.3)
      }
    }

    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      timer = setTimeout(
        () => {
          if (!document.hidden) bell()
          schedule()
        },
        2600 + Math.random() * 5200,
      )
    }
    schedule()

    return () => {
      clearTimeout(timer)
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 0.8)
      setTimeout(() => {
        voices.forEach((o) => o.stop())
        lfo.stop()
        void ctx.close()
      }, 900)
    }
  }, [enabled])
}
