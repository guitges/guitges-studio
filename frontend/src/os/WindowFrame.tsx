import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { APPS } from './registry'
import { clampPos, deskSize, useOS, WinCtx, type Win } from './store'
import { Icon } from './icons'

/** One desktop window: title bar, controls, body. Dragging and resizing write straight to the DOM
 *  while the pointer moves and commit to the store on release, so nothing else re-renders mid-drag. */
export function WindowFrame({ win, children }: { win: Win; children: ReactNode }) {
  const os = useOS()
  const ref = useRef<HTMLElement>(null)
  const drag = useRef<{ px: number; py: number; x: number; y: number; w: number; h: number; mode: 'move' | 'size' } | null>(null)
  const meta = APPS[win.app]
  const active = os.activeId === win.id
  const compact = os.compact
  const canMax = !meta.fixed && !compact

  // The open animation plays once, on mount
  const [opening, setOpening] = useState(true)

  // Briefly animate geometry when maximising or restoring
  const [animating, setAnimating] = useState(false)
  const firstMax = useRef(true)
  useEffect(() => {
    if (firstMax.current) {
      firstMax.current = false
      return
    }
    setAnimating(true)
    const t = window.setTimeout(() => setAnimating(false), 220)
    return () => window.clearTimeout(t)
  }, [win.max])

  // Minimising flies the window towards its taskbar button
  const [minTarget, setMinTarget] = useState<{ dx: number; dy: number } | null>(null)
  useLayoutEffect(() => {
    if (!win.min) return
    const el = ref.current
    const btn = document.querySelector(`[data-task="${CSS.escape(win.id)}"]`)
    if (!el || !btn) return setMinTarget({ dx: 0, dy: 200 })
    const a = el.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    setMinTarget({ dx: b.left + b.width / 2 - (a.left + a.width / 2), dy: b.top + b.height / 2 - (a.top + a.height / 2) })
  }, [win.min, win.id])

  // Land keyboard focus in a newly opened window, unless the app already focused something inside it
  useEffect(() => {
    const el = ref.current
    if (el && !el.contains(document.activeElement)) el.focus({ preventScroll: true })
  }, [])

  // Bring focus back to the window when it's restored from the taskbar
  useEffect(() => {
    if (!win.min && active && ref.current && !ref.current.contains(document.activeElement)) {
      const tag = document.activeElement?.tagName
      if (!tag || tag === 'BODY') ref.current.focus({ preventScroll: true })
    }
  }, [win.min, active])

  const onDown = (mode: 'move' | 'size') => (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || compact || (mode === 'move' && win.max)) return
    if (mode === 'move' && (e.target as HTMLElement).closest('button')) return
    const el = ref.current
    if (!el) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y, w: el.offsetWidth, h: el.offsetHeight, mode }
    el.classList.add('dragging')
  }

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    const dx = e.clientX - d.px
    const dy = e.clientY - d.py
    if (d.mode === 'move') {
      const p = clampPos(d.x + dx, d.y + dy, d.w)
      el.style.left = `${p.x}px`
      el.style.top = `${p.y}px`
    } else {
      const desk = deskSize()
      const w = Math.round(Math.min(Math.max(d.w + dx, meta.minW ?? 340), desk.w - Math.max(win.x, 0)))
      const h = Math.round(Math.min(Math.max(d.h + dy, meta.minH ?? 240), desk.h - win.y))
      el.style.width = `${w}px`
      el.style.height = `${h}px`
    }
  }

  const onUp = () => {
    const d = drag.current
    const el = ref.current
    drag.current = null
    if (!d || !el) return
    el.classList.remove('dragging')
    if (d.mode === 'move') os.move(win.id, parseInt(el.style.left) || 0, parseInt(el.style.top) || 0)
    else os.resize(win.id, el.offsetWidth, el.offsetHeight)
  }

  const style: CSSProperties = compact
    ? { zIndex: win.z }
    : win.max
      ? { zIndex: win.z }
      : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h }
  if (win.min && minTarget) style.transform = `translate(${minTarget.dx}px, ${minTarget.dy}px) scale(0.12)`

  const cls = [
    'win',
    opening && 'opening',
    active ? 'active' : 'inactive',
    win.max && !compact && 'max',
    compact && 'compact',
    win.min && 'min',
    win.closing && 'closing',
    animating && 'animating',
    meta.fixed && 'fixed',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      ref={ref}
      className={cls}
      style={style}
      aria-label={win.title}
      aria-hidden={win.min || undefined}
      tabIndex={-1}
      onPointerDownCapture={() => os.focus(win.id)}
      onAnimationEnd={(e) => e.target === e.currentTarget && setOpening(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && meta.fixed && !e.defaultPrevented) os.close(win.id)
      }}
    >
      <header
        className="titlebar"
        onPointerDown={onDown('move')}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDoubleClick={(e) => {
          if (canMax && !(e.target as HTMLElement).closest('button')) os.toggleMax(win.id)
        }}
      >
        <Icon name={win.icon} size={16} className="titlebar-icon" />
        <h2 className="titlebar-text">{win.title}</h2>
        <div className="controls">
          {!meta.fixed && (
            <button type="button" className="ctl ctl-min" aria-label={`Minimise ${win.title}`} title="Minimise" onClick={() => os.minimize(win.id)}>
              <span />
            </button>
          )}
          {canMax && (
            <button
              type="button"
              className={`ctl ${win.max ? 'ctl-restore' : 'ctl-max'}`}
              aria-label={win.max ? `Restore ${win.title}` : `Maximise ${win.title}`}
              title={win.max ? 'Restore' : 'Maximise'}
              onClick={() => os.toggleMax(win.id)}
            >
              <span />
            </button>
          )}
          <button type="button" className="ctl ctl-close" aria-label={`Close ${win.title}`} title="Close" onClick={() => os.close(win.id)}>
            <span />
          </button>
        </div>
      </header>
      <div className="win-body">
        <WinCtx.Provider value={win}>{children}</WinCtx.Provider>
      </div>
      {!meta.fixed && !win.max && !compact && (
        <div className="grip" aria-hidden="true" onPointerDown={onDown('size')} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} />
      )}
    </section>
  )
}
