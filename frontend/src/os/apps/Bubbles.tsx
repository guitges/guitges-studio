import { useEffect, useRef, useState } from 'react'
import { play } from '../sound'

// The thing in do_not_open.exe: a little bubble screensaver you can pop.

interface Bubble {
  id: number
  x: number
  y: number
  r: number
  vx: number
  vy: number
  hue: number
}

let next = 0
const spawn = (w: number, h: number): Bubble => {
  const r = 18 + Math.random() * 30
  return { id: next++, x: r + Math.random() * Math.max(1, w - 2 * r), y: h + r, r, vx: (Math.random() - 0.5) * 0.6, vy: -(0.35 + Math.random() * 0.8), hue: 180 + Math.random() * 80 }
}

export function Bubbles() {
  const box = useRef<HTMLDivElement>(null)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [popped, setPopped] = useState(0)
  const [pops, setPops] = useState<{ id: number; x: number; y: number }[]>([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    // Start with a few already on screen, so the window is never empty
    const el0 = box.current
    if (el0) setBubbles(Array.from({ length: 7 }, () => ({ ...spawn(el0.clientWidth, el0.clientHeight), y: Math.random() * el0.clientHeight })))
    const tick = (now: number) => {
      const dt = Math.min(48, now - last) / 16
      last = now
      const el = box.current
      if (el) {
        const w = el.clientWidth
        const h = el.clientHeight
        setBubbles((list) => {
          let l = list
            .map((b) => ({ ...b, x: b.x + b.vx * dt * (reduced ? 0.3 : 1), y: b.y + b.vy * dt * (reduced ? 0.3 : 1) }))
            .filter((b) => b.y > -b.r * 2)
          if (l.length < 14 && Math.random() < 0.05) l = [...l, spawn(w, h)]
          return l
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pop = (b: Bubble) => {
    play('pop')
    setBubbles((l) => l.filter((x) => x.id !== b.id))
    setPopped((n) => n + 1)
    setPops((p) => [...p.slice(-6), { id: b.id, x: b.x, y: b.y }])
  }

  return (
    <div className="app bubbles" ref={box}>
      <p className="bubbles-score" aria-live="polite">
        {popped === 0 ? 'Pop the bubbles. That’s it. That’s the program.' : `${popped} popped${popped >= 25 ? ' — you are now legally relaxed.' : ''}`}
      </p>
      {bubbles.map((b) => (
        <button
          key={b.id}
          type="button"
          className="bubble"
          aria-label="Pop bubble"
          tabIndex={-1}
          style={{ left: b.x - b.r, top: b.y - b.r, width: b.r * 2, height: b.r * 2, ['--h' as string]: b.hue }}
          onPointerDown={() => pop(b)}
        />
      ))}
      {pops.map((p) => (
        <span key={p.id} className="bubble-pop" style={{ left: p.x, top: p.y }} aria-hidden="true">
          pop!
        </span>
      ))}
    </div>
  )
}
