// The window manager and the rest of the desktop's shared state, in one place, so the taskbar,
// desktop icons, Start menu and window controls can never disagree with each other.
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { APPS, windowId, type AppId } from './registry'
import type { IconName } from './icons'
import { play, setSoundEnabled } from './sound'

// ---------- geometry ----------

export const COMPACT_BELOW = 640

export function isCompact() {
  return window.innerWidth < COMPACT_BELOW
}

export function taskbarHeight() {
  return isCompact() ? 44 : 34
}

/** The usable desktop area: the viewport minus the taskbar */
export function deskSize() {
  return { w: window.innerWidth, h: window.innerHeight - taskbarHeight() }
}

/** Keep enough of a window on screen to grab it again */
export function clampPos(x: number, y: number, w: number) {
  const d = deskSize()
  return {
    x: Math.round(Math.min(Math.max(x, 80 - w), d.w - 80)),
    y: Math.round(Math.min(Math.max(y, 0), d.h - 28)),
  }
}

// ---------- windows ----------

export interface Win {
  id: string
  app: AppId
  arg?: string
  title: string
  icon: IconName
  x: number
  y: number
  w: number
  h: number
  z: number
  min: boolean
  max: boolean
  closing: boolean
}

type Action =
  | { t: 'open'; win: Omit<Win, 'z' | 'min' | 'max' | 'closing'> }
  | { t: 'focus'; id: string }
  | { t: 'closing'; id: string }
  | { t: 'remove'; id: string }
  | { t: 'min'; id: string }
  | { t: 'max'; id: string }
  | { t: 'move'; id: string; x: number; y: number }
  | { t: 'resize'; id: string; w: number; h: number }
  | { t: 'title'; id: string; title: string }
  | { t: 'closeAll' }

interface WinState {
  wins: Win[]
  top: number
}

function reduce(s: WinState, a: Action): WinState {
  const map = (id: string, f: (w: Win) => Win) => ({ ...s, wins: s.wins.map((w) => (w.id === id ? f(w) : w)) })
  switch (a.t) {
    case 'open': {
      const top = s.top + 1
      const existing = s.wins.find((w) => w.id === a.win.id)
      if (existing) return { top, wins: s.wins.map((w) => (w.id === a.win.id ? { ...w, min: false, closing: false, z: top } : w)) }
      return { top, wins: [...s.wins, { ...a.win, z: top, min: false, max: false, closing: false }] }
    }
    case 'focus': {
      const w = s.wins.find((x) => x.id === a.id)
      if (!w || (w.z === s.top && !w.min)) return s
      const top = s.top + 1
      return { top, wins: s.wins.map((x) => (x.id === a.id ? { ...x, z: top, min: false } : x)) }
    }
    case 'closing':
      return map(a.id, (w) => ({ ...w, closing: true }))
    case 'remove':
      return { ...s, wins: s.wins.filter((w) => w.id !== a.id) }
    case 'min':
      return map(a.id, (w) => ({ ...w, min: true }))
    case 'max':
      return map(a.id, (w) => ({ ...w, max: !w.max }))
    case 'move':
      return map(a.id, (w) => ({ ...w, x: a.x, y: a.y }))
    case 'resize':
      return map(a.id, (w) => ({ ...w, w: a.w, h: a.h }))
    case 'title': {
      const w = s.wins.find((x) => x.id === a.id)
      if (!w || w.title === a.title) return s
      return map(a.id, (x) => ({ ...x, title: a.title }))
    }
    case 'closeAll':
      return { ...s, wins: [] }
  }
}

// ---------- settings ----------

export type ThemeId = 'xp' | 'silver' | 'dream'
export type WallpaperId = 'daydream' | 'meadow' | 'dusk' | 'classic'

export interface Settings {
  theme: ThemeId
  wallpaper: WallpaperId
  sound: boolean
  clouds: boolean
  iconSize: 'large' | 'small'
  sortBy: 'default' | 'name' | 'type'
}

const SETTINGS_KEY = 'baihaqi.os.settings'
const WELCOME_KEY = 'baihaqi.os.welcomed'
const DEFAULTS: Settings = { theme: 'xp', wallpaper: 'daydream', sound: false, clouds: true, iconSize: 'large', sortBy: 'default' }

function loadSettings(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') as Partial<Settings>
    const s = { ...DEFAULTS, ...raw }
    // Never come back with sound on: it must be turned on by a click in this visit
    return { ...s, sound: false }
  } catch {
    return DEFAULTS
  }
}

function session(key: string, value?: string) {
  try {
    if (value === undefined) return sessionStorage.getItem(key)
    sessionStorage.setItem(key, value)
  } catch {
    /* private mode: fine, just forget */
  }
  return null
}

// ---------- the context ----------

export type Screen = 'welcome' | 'desktop' | 'shutdown'

export interface Balloon {
  title: string
  text: string
  icon?: IconName
}

interface ContextMenuState {
  x: number
  y: number
}

/** Returns false to keep the window open (e.g. Notepad asking to save first) */
type CloseGuard = () => boolean

interface OS {
  wins: Win[]
  activeId: string | null
  launch: (app: AppId, arg?: string, opts?: { title?: string; icon?: IconName }) => void
  focus: (id: string) => void
  close: (id: string, force?: boolean) => void
  minimize: (id: string) => void
  toggleMax: (id: string) => void
  move: (id: string, x: number, y: number) => void
  resize: (id: string, w: number, h: number) => void
  setTitle: (id: string, title: string) => void
  setCloseGuard: (id: string, guard: CloseGuard | null) => void
  /** Taskbar click: focus, or minimise if it's already in front */
  taskClick: (id: string) => void

  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void

  screen: Screen
  enterDesktop: () => void
  logOff: () => void
  shutDown: () => void
  /** Show the welcome dialog again without closing anything */
  showWelcome: () => void

  startOpen: boolean
  setStartOpen: (v: boolean | ((v: boolean) => boolean)) => void
  menu: ContextMenuState | null
  setMenu: (m: ContextMenuState | null) => void
  flash: number
  refresh: () => void
  balloon: Balloon | null
  notify: (b: Balloon | null) => void
  compact: boolean
}

const Ctx = createContext<OS | null>(null)

export function useOS() {
  const os = useContext(Ctx)
  if (!os) throw new Error('useOS outside OSProvider')
  return os
}

/** The window a component is rendered inside */
export const WinCtx = createContext<Win | null>(null)
export function useWin() {
  const w = useContext(WinCtx)
  if (!w) throw new Error('useWin outside a window')
  return w
}

function useCompact() {
  const [compact, setCompact] = useState(isCompact)
  useEffect(() => {
    const onResize = () => setCompact(isCompact())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return compact
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, { wins: [], top: 0 })
  const stateRef = useRef(state)
  stateRef.current = state
  const guards = useRef(new Map<string, CloseGuard>())

  const [settings, setSettings] = useState(loadSettings)
  const [screen, setScreen] = useState<Screen>(() => (session(WELCOME_KEY) ? 'desktop' : 'welcome'))
  const [startOpen, setStartOpen] = useState(false)
  const [menu, setMenu] = useState<ContextMenuState | null>(null)
  const [flash, setFlash] = useState(0)
  const [balloon, setBalloon] = useState<Balloon | null>(null)
  const compact = useCompact()

  useEffect(() => {
    setSoundEnabled(settings.sound)
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    } catch {
      /* storage blocked: settings just won't persist */
    }
  }, [settings])

  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), [])

  const launch = useCallback<OS['launch']>((app, arg, opts) => {
    const meta = APPS[app]
    const id = windowId(app, arg)
    const open = stateRef.current.wins.filter((w) => !w.closing)
    if (!open.some((w) => w.id === id)) play('open')
    const d = deskSize()
    const w = Math.min(meta.w, d.w - 16)
    const h = Math.min(meta.h, d.h - 16)
    // Cascade new windows from a point that depends on how many are open, so they never stack exactly
    const n = open.length % 7
    const baseX = Math.max(8, Math.round((d.w - w) / 2) - 90)
    const baseY = Math.max(8, Math.round((d.h - h) / 2) - 70)
    const pos = clampPos(baseX + n * 28, baseY + n * 24, w)
    dispatch({
      t: 'open',
      win: { id, app, arg, title: opts?.title ?? meta.title, icon: opts?.icon ?? meta.icon, x: pos.x, y: Math.min(pos.y, Math.max(0, d.h - h)), w, h },
    })
    setStartOpen(false)
    setMenu(null)
  }, [])

  const close = useCallback((id: string, force = false) => {
    const guard = guards.current.get(id)
    if (!force && guard && !guard()) return
    guards.current.delete(id)
    play('close')
    dispatch({ t: 'closing', id })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => dispatch({ t: 'remove', id }), reduced ? 0 : 140)
  }, [])

  const activeId = useMemo(() => {
    let best: Win | null = null
    for (const w of state.wins) if (!w.min && !w.closing && (!best || w.z > best.z)) best = w
    return best?.id ?? null
  }, [state.wins])

  const taskClick = useCallback(
    (id: string) => {
      const w = stateRef.current.wins.find((x) => x.id === id)
      if (!w) return
      if (id === activeId && !w.min) dispatch({ t: 'min', id })
      else dispatch({ t: 'focus', id })
    },
    [activeId],
  )

  const enterDesktop = useCallback(() => {
    session(WELCOME_KEY, '1')
    setScreen('desktop')
    play('startup')
  }, [])

  const logOff = useCallback(() => {
    dispatch({ t: 'closeAll' })
    guards.current.clear()
    setStartOpen(false)
    setScreen('welcome')
  }, [])

  const shutDown = useCallback(() => {
    play('shutdown')
    dispatch({ t: 'closeAll' })
    guards.current.clear()
    setStartOpen(false)
    setScreen('shutdown')
  }, [])

  const showWelcome = useCallback(() => {
    setStartOpen(false)
    setMenu(null)
    setScreen('welcome')
  }, [])

  const refresh = useCallback(() => {
    setMenu(null)
    setFlash((f) => f + 1)
  }, [])

  const focus = useCallback((id: string) => dispatch({ t: 'focus', id }), [])
  const minimize = useCallback((id: string) => dispatch({ t: 'min', id }), [])
  const toggleMax = useCallback((id: string) => dispatch({ t: 'max', id }), [])
  const move = useCallback((id: string, x: number, y: number) => dispatch({ t: 'move', id, x, y }), [])
  const resize = useCallback((id: string, w: number, h: number) => dispatch({ t: 'resize', id, w, h }), [])
  const setTitle = useCallback((id: string, title: string) => dispatch({ t: 'title', id, title }), [])
  const setCloseGuard = useCallback((id: string, g: CloseGuard | null) => {
    if (g) guards.current.set(id, g)
    else guards.current.delete(id)
  }, [])

  const os = useMemo<OS>(
    () => ({
      wins: state.wins,
      activeId,
      launch,
      focus,
      close,
      minimize,
      toggleMax,
      move,
      resize,
      setTitle,
      setCloseGuard,
      taskClick,
      settings,
      updateSettings,
      screen,
      enterDesktop,
      logOff,
      shutDown,
      showWelcome,
      startOpen,
      setStartOpen,
      menu,
      setMenu,
      flash,
      refresh,
      balloon,
      notify: setBalloon,
      compact,
    }),
    [state.wins, activeId, launch, focus, close, minimize, toggleMax, move, resize, setTitle, setCloseGuard, taskClick, settings, updateSettings, screen, enterDesktop, logOff, shutDown, showWelcome, startOpen, menu, flash, refresh, balloon, compact],
  )

  return <Ctx.Provider value={os}>{children}</Ctx.Provider>
}
