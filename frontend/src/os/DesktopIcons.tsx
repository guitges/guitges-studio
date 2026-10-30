import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { site } from '../data/site'
import { Icon, type IconName } from './icons'
import { sendIntent } from './intents'
import { play } from './sound'
import { useOS } from './store'
import { binEmpty } from './apps/RecycleBin'

interface DeskItem {
  id: string
  label: string
  icon: IconName
  type: string
  open: () => void
}

export function DesktopIcons() {
  const os = useOS()
  const [selected, setSelected] = useState<string | null>(null)
  const [empty, setEmpty] = useState(binEmpty)
  const [shake, setShake] = useState(false)
  const clicks = useRef<number[]>([])
  const lastPointer = useRef<string>('mouse')
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const on = () => setEmpty(binEmpty())
    window.addEventListener('os:bin', on)
    return () => window.removeEventListener('os:bin', on)
  }, [])

  const items = useMemo<DeskItem[]>(() => {
    const list: DeskItem[] = [
      { id: 'computer', label: 'My Computer', icon: 'computer', type: 'System', open: () => os.launch('computer') },
      { id: 'about', label: 'About Me', icon: 'user', type: 'Application', open: () => os.launch('about') },
      { id: 'projects', label: 'My Projects', icon: 'folder', type: 'Folder', open: () => os.launch('projects') },
      { id: 'skills', label: 'Skills.exe', icon: 'skills', type: 'Application', open: () => os.launch('skills') },
      { id: 'experience', label: 'Work History', icon: 'briefcase', type: 'Application', open: () => os.launch('experience') },
      {
        id: 'guestbook',
        label: 'Guestbook',
        icon: 'guestbook',
        type: 'Internet',
        open: () => {
          sendIntent('browser', 'guestbook')
          os.launch('browser')
        },
      },
      { id: 'terminal', label: 'Command Prompt', icon: 'terminal', type: 'Application', open: () => os.launch('terminal') },
      { id: 'notepad', label: 'Notepad', icon: 'notepad', type: 'Application', open: () => os.launch('notepad', 'readme.txt', { title: 'readme.txt - Notepad' }) },
    ]
    if (site.links.resume)
      list.push({ id: 'resume', label: 'Résumé.pdf', icon: 'pdf', type: 'Document', open: () => window.open(site.links.resume, '_blank', 'noopener') })
    list.push({ id: 'recycle', label: 'Recycle Bin', icon: empty ? 'recycle' : 'recycleFull', type: 'System', open: () => os.launch('recycle') })

    const { sortBy } = os.settings
    if (sortBy === 'name') list.sort((a, b) => a.label.localeCompare(b.label))
    if (sortBy === 'type') list.sort((a, b) => a.type.localeCompare(b.type) || a.label.localeCompare(b.label))
    return list
  }, [os, empty])

  const touchLike = () => os.compact || lastPointer.current !== 'mouse'

  const onClick = (it: DeskItem) => {
    setSelected(it.id)
    play('click')
    if (it.id === 'recycle') {
      // Easter egg: poke the bin five times in quick succession
      const now = Date.now()
      clicks.current = [...clicks.current.filter((t) => now - t < 1600), now]
      if (clicks.current.length >= 5) {
        clicks.current = []
        setShake(true)
        window.setTimeout(() => setShake(false), 600)
        os.notify({ title: 'Recycle Bin', text: empty ? 'I’m empty. Stop poking me. It tickles.' : 'Okay, okay, I’m full! Have you tried opening me? Carefully.', icon: 'recycleFull' })
        return
      }
    }
    if (touchLike()) it.open()
  }

  // Arrow keys move to the nearest icon in that direction, whatever the grid looks like
  const onKey = (e: KeyboardEvent) => {
    const cur = items.find((i) => i.id === selected)
    if (e.key === 'Enter' && cur) {
      e.preventDefault()
      cur.open()
      return
    }
    const dirs: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }
    const d = dirs[e.key]
    if (!d || !box.current) return
    e.preventDefault()
    const els = [...box.current.querySelectorAll<HTMLElement>('.dicon')]
    const from = els.find((el) => el.dataset.id === selected)
    if (!from) {
      els[0]?.focus()
      return
    }
    const a = from.getBoundingClientRect()
    let best: HTMLElement | null = null
    let bestScore = Infinity
    for (const el of els) {
      if (el === from) continue
      const b = el.getBoundingClientRect()
      const dx = b.left - a.left
      const dy = b.top - a.top
      const along = dx * d[0] + dy * d[1]
      if (along <= 4) continue
      const across = Math.abs(dx * d[1]) + Math.abs(dy * d[0])
      const score = along + across * 3
      if (score < bestScore) {
        bestScore = score
        best = el
      }
    }
    best?.focus()
  }

  return (
    <div
      className="dicons"
      ref={box}
      role="listbox"
      aria-label="Desktop"
      aria-orientation="vertical"
      onKeyDown={onKey}
      onPointerDown={(e: PointerEvent) => {
        lastPointer.current = e.pointerType
      }}
    >
      {items.map((it, n) => (
        <button
          key={it.id}
          type="button"
          role="option"
          aria-selected={selected === it.id}
          data-id={it.id}
          tabIndex={selected === it.id || (!selected && n === 0) ? 0 : -1}
          className={`dicon ${selected === it.id ? 'selected' : ''} ${it.id === 'recycle' && shake ? 'shake' : ''}`}
          onClick={() => onClick(it)}
          onDoubleClick={() => !touchLike() && it.open()}
          onFocus={() => setSelected(it.id)}
          onBlur={(e) => {
            if (!box.current?.contains(e.relatedTarget as Node)) setSelected(null)
          }}
          title={`${it.label} — ${os.compact ? 'tap' : 'double-click'} to open`}
        >
          <Icon name={it.icon} size={os.settings.iconSize === 'small' ? 32 : 44} />
          <span className="dicon-label">{it.label}</span>
        </button>
      ))}
    </div>
  )
}

