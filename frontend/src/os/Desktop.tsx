import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { balloons } from '../data/site'
import { APP_COMPONENTS } from './apps'
import { DesktopIcons } from './DesktopIcons'
import { sendIntent } from './intents'
import { PopupMenu, type PItem } from './PopupMenu'
import { ShutdownScreen, WelcomeDialog } from './Screens'
import { OSProvider, taskbarHeight, useOS } from './store'
import { Taskbar } from './Taskbar'
import { Wallpaper } from './Wallpaper'
import { WindowFrame } from './WindowFrame'

function Windows() {
  const os = useOS()
  return (
    <>
      {os.wins.map((w) => {
        const App = APP_COMPONENTS[w.app]
        return (
          <WindowFrame key={w.id} win={w}>
            <App />
          </WindowFrame>
        )
      })}
    </>
  )
}

function DesktopMenu() {
  const os = useOS()
  if (!os.menu) return null
  const s = os.settings
  const items: PItem[] = [
    {
      label: 'View',
      sub: [
        { label: 'Large Icons', checked: s.iconSize === 'large', onClick: () => os.updateSettings({ iconSize: 'large' }) },
        { label: 'Small Icons', checked: s.iconSize === 'small', onClick: () => os.updateSettings({ iconSize: 'small' }) },
      ],
    },
    {
      label: 'Sort Icons',
      sub: [
        { label: 'Name', checked: s.sortBy === 'name', onClick: () => os.updateSettings({ sortBy: 'name' }) },
        { label: 'Type', checked: s.sortBy === 'type', onClick: () => os.updateSettings({ sortBy: 'type' }) },
        { label: 'Original order', checked: s.sortBy === 'default', onClick: () => os.updateSettings({ sortBy: 'default' }) },
      ],
    },
    { label: 'Refresh', onClick: os.refresh },
    { separator: true },
    {
      label: 'New',
      sub: [
        { label: 'Text Document', icon: 'txt', onClick: () => os.launch('notepad') },
        { label: 'Guestbook Entry', icon: 'guestbook', onClick: () => (sendIntent('browser', 'guestbook'), os.launch('browser')) },
      ],
    },
    { separator: true },
    { label: 'Display Properties', icon: 'settings', onClick: () => (sendIntent('system', 'display'), os.launch('system')) },
    { label: 'About this computer', icon: 'info', onClick: () => os.launch('sysinfo') },
  ]
  return <PopupMenu items={items} x={os.menu.x} y={os.menu.y} label="Desktop" onClose={() => os.setMenu(null)} />
}

/** A tiny pixel fish that swims across the sky every so often. It's fine. Fish can fly here. */
function Fish() {
  const [swim, setSwim] = useState<{ id: number; top: number; flip: boolean } | null>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t = 0
    const schedule = (ms: number) => {
      t = window.setTimeout(() => {
        setSwim({ id: Date.now(), top: 18 + Math.random() * 55, flip: Math.random() < 0.5 })
        schedule(50000 + Math.random() * 60000)
      }, ms)
    }
    schedule(14000)
    return () => window.clearTimeout(t)
  }, [])
  if (!swim) return null
  return (
    <div key={swim.id} className={`fish ${swim.flip ? 'flip' : ''}`} style={{ top: `${swim.top}%` }} aria-hidden="true" onAnimationEnd={() => setSwim(null)}>
      <svg width="40" height="24" viewBox="0 0 20 12" shapeRendering="crispEdges">
        <path d="M2 3h2v1h1v1h1v2H5v1H4v1H2z" fill="#f59a23" />
        <path d="M7 2h6v1h2v1h2v1h1v2h-1v1h-2v1h-2v1H7V9H6V3h1z" fill="#ffb347" />
        <path d="M9 3h2v1h-2zM8 8h3v1H8z" fill="#ffd38a" />
        <path d="M15 5h1v1h-1z" fill="#1a1a1a" />
        <path d="M10 4h1v4h-1z" fill="#f08a1c" />
      </svg>
    </div>
  )
}

function useBalloons() {
  const os = useOS()
  const { notify, compact, screen } = os
  useEffect(() => {
    if (screen !== 'desktop') return
    let shown = 0
    const timers: number[] = []
    let firstHint = false
    try {
      firstHint = !sessionStorage.getItem('baihaqi.os.hinted')
      sessionStorage.setItem('baihaqi.os.hinted', '1')
    } catch {
      firstHint = true
    }
    if (firstHint)
      timers.push(
        window.setTimeout(
          () => notify({ title: 'Welcome!', text: compact ? 'Tap an icon to open it. Everything is also in the Start menu.' : 'Double-click an icon to open it. Everything is also in the Start menu.', icon: 'info' }),
          1200,
        ),
      )
    const order = [...balloons].sort(() => Math.random() - 0.5)
    const tick = () => {
      if (shown >= 3) return
      notify(order[shown++ % order.length])
      timers.push(window.setTimeout(tick, 120000 + Math.random() * 90000))
    }
    timers.push(window.setTimeout(tick, 75000 + Math.random() * 30000))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [notify, compact, screen])
}

function Shell() {
  const os = useOS()
  const long = useRef({ t: 0, x: 0, y: 0 })
  useBalloons()

  // Escape closes menus first
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (os.menu) os.setMenu(null)
      else if (os.startOpen) os.setStartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [os])

  // A click anywhere else closes the desktop menu
  useEffect(() => {
    if (!os.menu) return
    const onDown = (e: globalThis.PointerEvent) => {
      if (!(e.target as HTMLElement).closest('.menu.popup')) os.setMenu(null)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [os])

  const onContext = (e: MouseEvent) => {
    const t = e.target as HTMLElement
    if (t.closest('.win, .taskbar, .startmenu, .menu')) {
      // Leave text fields and links with the browser's own menu; swallow it elsewhere in windows
      if (!t.closest('input, textarea, a')) e.preventDefault()
      return
    }
    e.preventDefault()
    os.setStartOpen(false)
    os.setMenu({ x: e.clientX, y: e.clientY })
  }

  // Long-press on the empty desktop opens the same menu on touch screens
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' || (e.target as HTMLElement).closest('.win, .dicon')) return
    const { clientX: x, clientY: y } = e
    long.current = { x, y, t: window.setTimeout(() => os.setMenu({ x, y }), 550) }
  }
  const cancelLong = () => window.clearTimeout(long.current.t)
  // A finger never holds perfectly still; only a real drag cancels the long-press
  const onMove = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - long.current.x, e.clientY - long.current.y) > 10) cancelLong()
  }

  return (
    <div
      className={`os os-theme-${os.settings.theme} icons-${os.settings.iconSize} ${os.compact ? 'is-compact' : ''}`}
      style={{ ['--taskbar' as string]: `${taskbarHeight()}px` }}
      onContextMenu={onContext}
    >
      <Wallpaper id={os.settings.wallpaper} drift={os.settings.clouds} />
      {os.flash > 0 && <div key={os.flash} className="refresh-flash" aria-hidden="true" />}
      <Fish />
      <main className="desk" aria-label="Baihaqi.exe desktop" onPointerDown={onDown} onPointerUp={cancelLong} onPointerMove={onMove} onPointerCancel={cancelLong}>
        <h1 className="sr-only">Baihaqi.exe — the portfolio of Ahmad Baihaqi, full-stack developer</h1>
        <DesktopIcons key={os.flash} />
        <Windows />
      </main>
      <Taskbar />
      <DesktopMenu />
      {os.screen === 'welcome' && <WelcomeDialog />}
      {os.screen === 'shutdown' && <ShutdownScreen />}
    </div>
  )
}

export default function Desktop() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  )
}
