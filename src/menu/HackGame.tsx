import { useEffect, useRef } from 'react'

/**
 * Canvas hacking mini-game, after NieR: Automata's hacking sequences.
 * A small ship (pointer / touch / arrow keys) auto-fires, auto-aimed, at
 * a striped orange core. Tuned to last a few seconds. The core fires orange orbs back; orbs can be shot down.
 * Getting hit costs time (the core regenerates). Destroying the core
 * calls `onDone`.
 */
export function HackGame({ code, onDone }: { code: string; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const ORANGE = '#ff6a2b'
    const RED = '#c9302c'
    const BONE = '#ece6d6'
    const GRID = 'rgba(255,106,43,0.10)'

    let W = 0
    let H = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width
      H = r.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // diagonal orange/red stripes for the core
    const tile = document.createElement('canvas')
    tile.width = tile.height = 12
    const t = tile.getContext('2d')!
    t.fillStyle = RED
    t.fillRect(0, 0, 12, 12)
    t.strokeStyle = ORANGE
    t.lineWidth = 4
    for (const o of [-12, 0, 12]) {
      t.beginPath()
      t.moveTo(o, 12)
      t.lineTo(o + 12, 0)
      t.stroke()
    }
    const stripes = ctx.createPattern(tile, 'repeat')!

    const MAX_HP = 18
    const ship = { x: W / 2, y: H * 0.82, inv: 0 }
    const target = { x: W / 2, y: H * 0.82, active: false }
    const keys = new Set<string>()
    const core = { x: W / 2, y: H * 0.22, w: 70, h: 44, hp: MAX_HP, hit: 0 }
    let shots: { x: number; y: number; vx: number; vy: number }[] = []
    let orbs: { x: number; y: number; vx: number; vy: number }[] = []
    let sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = []
    let fireT = 0
    let orbT = 1
    let time = 0
    let state: 'play' | 'boom' = 'play'
    let boomT = 0
    let raf = 0
    let last = performance.now()

    const burst = (x: number, y: number, n: number, speed: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const s = speed * (0.3 + Math.random())
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.4 })
      }
    }

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      target.active = true
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        keys.add(e.key)
        target.active = false
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key)
    canvas.addEventListener('pointermove', toLocal)
    canvas.addEventListener('pointerdown', toLocal)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const step = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      time += dt

      /* --- update --- */
      if (target.active) {
        ship.x += (target.x - ship.x) * Math.min(1, dt * 12)
        ship.y += (target.y - ship.y) * Math.min(1, dt * 12)
      } else {
        const sp = 320 * dt
        if (keys.has('ArrowLeft')) ship.x -= sp
        if (keys.has('ArrowRight')) ship.x += sp
        if (keys.has('ArrowUp')) ship.y -= sp
        if (keys.has('ArrowDown')) ship.y += sp
      }
      ship.x = Math.max(12, Math.min(W - 12, ship.x))
      ship.y = Math.max(H * 0.45, Math.min(H - 14, ship.y))
      ship.inv = Math.max(0, ship.inv - dt)
      core.hit = Math.max(0, core.hit - dt)

      if (state === 'play') {
        core.x = W / 2 + Math.sin(time * 1.1) * W * 0.25
        core.y = H * 0.22 + Math.sin(time * 2.1) * 8

        fireT -= dt
        if (fireT <= 0) {
          fireT = 0.08
          // auto-aim at the core
          const a = Math.atan2(core.y - ship.y, core.x - ship.x)
          shots.push({ x: ship.x, y: ship.y - 12, vx: Math.cos(a) * 780, vy: Math.sin(a) * 780 })
        }
        orbT -= dt
        if (orbT <= 0) {
          orbT = 1.1
          for (const a of [-0.4, 0.4]) {
            const dx = ship.x - core.x
            const dy = ship.y - core.y
            const base = Math.atan2(dy, dx) + a
            orbs.push({ x: core.x, y: core.y + core.h / 2, vx: Math.cos(base) * 130, vy: Math.sin(base) * 130 })
          }
        }
      } else {
        boomT += dt
        if (boomT > 0.75) {
          done.current()
          return
        }
      }

      for (const s of shots) {
        s.x += s.vx * dt
        s.y += s.vy * dt
      }
      for (const o of orbs) {
        o.x += o.vx * dt
        o.y += o.vy * dt
      }
      for (const p of sparks) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vx *= 0.94
        p.vy *= 0.94
        p.life -= dt
      }

      /* --- collisions --- */
      if (state === 'play') {
        shots = shots.filter((s) => {
          if (Math.abs(s.x - core.x) < core.w / 2 && Math.abs(s.y - core.y) < core.h / 2) {
            core.hp -= 1
            core.hit = 0.06
            burst(s.x, s.y, 3, 120)
            return false
          }
          const hitOrb = orbs.findIndex((o) => Math.hypot(o.x - s.x, o.y - s.y) < 9)
          if (hitOrb >= 0) {
            burst(orbs[hitOrb].x, orbs[hitOrb].y, 5, 90)
            orbs.splice(hitOrb, 1)
            return false
          }
          return s.y > -10 && s.x > -10 && s.x < W + 10
        })
        orbs = orbs.filter((o) => {
          if (ship.inv <= 0 && Math.hypot(o.x - ship.x, o.y - ship.y) < 10) {
            ship.inv = 1.2
            core.hp = Math.min(MAX_HP, core.hp + 2) // counter-measure: core regenerates
            burst(ship.x, ship.y, 12, 160)
            return false
          }
          return o.x > -20 && o.x < W + 20 && o.y > -20 && o.y < H + 20
        })
        if (core.hp <= 0) {
          state = 'boom'
          burst(core.x, core.y, 70, 340)
          orbs = []
        }
      }
      sparks = sparks.filter((p) => p.life > 0)

      /* --- draw --- */
      ctx.fillStyle = '#0b0a09'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = GRID
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = (time * 20) % 32; x < W; x += 32) {
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, H)
      }
      for (let y = 0; y < H; y += 32) {
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(W, y + 0.5)
      }
      ctx.stroke()
      // scanning line
      const scanY = (time * 90) % H
      ctx.fillStyle = 'rgba(255,106,43,0.08)'
      ctx.fillRect(0, scanY, W, 2)

      if (state === 'play') {
        ctx.fillStyle = core.hit > 0 ? BONE : stripes
        ctx.fillRect(core.x - core.w / 2, core.y - core.h / 2, core.w, core.h)
        ctx.strokeStyle = ORANGE
        ctx.lineWidth = 2
        ctx.strokeRect(core.x - core.w / 2 - 4, core.y - core.h / 2 - 4, core.w + 8, core.h + 8)
      }

      ctx.fillStyle = BONE
      ctx.strokeStyle = BONE
      ctx.lineWidth = 2
      ctx.beginPath()
      for (const s of shots) {
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * 0.01, s.y - s.vy * 0.01)
      }
      ctx.stroke()
      for (const o of orbs) {
        ctx.fillStyle = ORANGE
        ctx.beginPath()
        ctx.arc(o.x, o.y, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,106,43,0.35)'
        ctx.beginPath()
        ctx.arc(o.x, o.y, 8, 0, Math.PI * 2)
        ctx.stroke()
      }
      for (const p of sparks) {
        ctx.fillStyle = p.life > 0.3 ? ORANGE : RED
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3)
      }

      // ship: minimalist triangle, blinking while invulnerable
      if (ship.inv <= 0 || Math.floor(time * 20) % 2 === 0) {
        ctx.fillStyle = BONE
        ctx.beginPath()
        ctx.moveTo(ship.x, ship.y - 11)
        ctx.lineTo(ship.x - 8, ship.y + 7)
        ctx.lineTo(ship.x, ship.y + 3)
        ctx.lineTo(ship.x + 8, ship.y + 7)
        ctx.closePath()
        ctx.fill()
      }

      // HUD
      const pct = Math.round((1 - Math.max(0, core.hp) / MAX_HP) * 100)
      ctx.font = '11px "Share Tech Mono", monospace'
      ctx.fillStyle = ORANGE
      ctx.fillText(`HACKING // TARGET: ${code}`, 12, 18)
      ctx.fillText(`BREACH ${String(pct).padStart(3)}%`, W - 96, 18)
      ctx.strokeStyle = ORANGE
      ctx.strokeRect(12.5, 26.5, W - 25, 5)
      ctx.fillRect(13, 27, (W - 26) * (pct / 100), 4)
      if (state === 'boom') {
        ctx.font = '16px "Share Tech Mono", monospace'
        ctx.fillStyle = BONE
        const msg = 'HACKING COMPLETE'
        ctx.fillText(msg, W / 2 - ctx.measureText(msg).width / 2, H / 2)
      }

      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointermove', toLocal)
      canvas.removeEventListener('pointerdown', toLocal)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [code])

  return <canvas ref={ref} className="block h-full w-full cursor-crosshair touch-none" aria-label="Mini-jeu de hacking" />
}
