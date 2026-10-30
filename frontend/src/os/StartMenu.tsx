import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react'
import { site } from '../data/site'
import { projects } from '../data/projects'
import { Icon, type IconName } from './icons'
import { sendIntent } from './intents'
import { PopupMenu, type PItem } from './PopupMenu'
import { useOS } from './store'

interface Entry {
  label: string
  note?: string
  icon: IconName
  onClick: () => void
  sub?: PItem[]
}

export function StartMenu({ onClose, startBtn }: { onClose: () => void; startBtn: RefObject<HTMLButtonElement> }) {
  const os = useOS()
  const ref = useRef<HTMLDivElement>(null)
  const [popup, setPopup] = useState<{ label: string; items: PItem[]; x: number; y: number } | null>(null)

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (ref.current?.contains(t) || startBtn.current?.contains(t) || (t as HTMLElement).closest?.('.menu.popup')) return
      onClose()
    }
    window.addEventListener('pointerdown', onDown)
    ref.current?.querySelector<HTMLButtonElement>('.sm-item')?.focus()
    return () => window.removeEventListener('pointerdown', onDown)
  }, [onClose, startBtn])

  const contact = () => {
    sendIntent('browser', 'contact')
    os.launch('browser')
  }

  const projectItems: PItem[] = projects.map((p) => ({ label: p.name, icon: 'exe', onClick: () => os.launch('project', p.id, { title: p.name }) }))

  const left: Entry[] = [
    { label: 'About Baihaqi', note: 'Who lives on this computer', icon: 'user', onClick: () => os.launch('about') },
    { label: 'Projects', note: 'Things I’ve built', icon: 'folderOpen', onClick: () => os.launch('projects') },
    { label: 'Skills', note: 'Skills and Components', icon: 'skills', onClick: () => os.launch('skills') },
    { label: 'Work History', icon: 'briefcase', onClick: () => os.launch('experience') },
    { label: 'Command Prompt', icon: 'terminal', onClick: () => os.launch('terminal') },
    { label: 'Notepad', icon: 'notepad', onClick: () => os.launch('notepad') },
  ]

  const right: Entry[] = [
    { label: 'My Computer', icon: 'computer', onClick: () => os.launch('computer') },
    { label: 'Recent Projects', icon: 'folder', onClick: () => {}, sub: projectItems },
    { label: 'Contact', icon: 'mail', onClick: contact },
    { label: 'Guestbook', icon: 'guestbook', onClick: () => (sendIntent('browser', 'guestbook'), os.launch('browser')) },
    { label: 'System Properties', icon: 'settings', onClick: () => os.launch('system') },
    { label: 'Recycle Bin', icon: 'recycleFull', onClick: () => os.launch('recycle') },
    { label: 'Welcome screen', icon: 'help', onClick: () => os.showWelcome() },
  ]

  const allPrograms: PItem[] = [
    { label: 'About Baihaqi', icon: 'user', onClick: () => os.launch('about') },
    { label: 'Projects', icon: 'folderOpen', onClick: () => os.launch('projects'), sub: undefined },
    { label: 'Skills and Components', icon: 'skills', onClick: () => os.launch('skills') },
    { label: 'Work History', icon: 'briefcase', onClick: () => os.launch('experience') },
    { separator: true },
    {
      label: 'Accessories',
      icon: 'folder',
      sub: [
        { label: 'Command Prompt', icon: 'terminal', onClick: () => os.launch('terminal') },
        { label: 'Notepad', icon: 'notepad', onClick: () => os.launch('notepad') },
        { label: 'Internet Explorer', icon: 'browser', onClick: () => os.launch('browser') },
        { label: 'System Information', icon: 'info', onClick: () => os.launch('sysinfo') },
      ],
    },
    { label: 'Games', icon: 'folder', sub: [{ label: 'Bubbles', icon: 'bubbles', onClick: () => os.launch('bubbles') }] },
    { separator: true },
    ...(site.links.resume ? [{ label: 'Résumé.pdf', icon: 'pdf' as IconName, onClick: () => window.open(site.links.resume, '_blank', 'noopener') }] : []),
  ]

  const run = (e: Entry, el: HTMLElement) => {
    if (e.sub) {
      const r = el.getBoundingClientRect()
      setPopup({ label: e.label, items: e.sub, x: r.right - 4, y: r.top })
      return
    }
    onClose()
    e.onClick()
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.menu.popup')) return
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      startBtn.current?.focus()
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const els = [...ref.current!.querySelectorAll<HTMLButtonElement>('.sm-item')]
    const i = els.indexOf(document.activeElement as HTMLButtonElement)
    els[(i + (e.key === 'ArrowDown' ? 1 : -1) + els.length) % els.length]?.focus()
  }

  const item = (e: Entry, big: boolean) => (
    <button key={e.label} type="button" className={`sm-item ${big ? 'big' : ''}`} aria-haspopup={e.sub ? 'menu' : undefined} onClick={(ev) => run(e, ev.currentTarget)}>
      <Icon name={e.icon} size={big ? 30 : 22} />
      <span className="sm-text">
        <span className="sm-label">{e.label}</span>
        {e.note && <span className="sm-note">{e.note}</span>}
      </span>
      {e.sub && <span className="menu-arrow" aria-hidden="true">▸</span>}
    </button>
  )

  return (
    <div className="startmenu" ref={ref} role="dialog" aria-label="Start menu" onKeyDown={onKey}>
      <header className="sm-head">
        <span className="sm-avatar">{site.portrait ? <img src={site.portrait} alt="" width={42} height={42} /> : <Icon name="user" size={40} />}</span>
        <span className="sm-user">
          {site.short}
          <small>{site.role}</small>
        </span>
      </header>
      <div className="sm-cols">
        <div className="sm-left">
          {left.map((e, i) => item(e, i < 2))}
          <div className="sm-sep" />
          <button
            type="button"
            className="sm-item sm-all"
            aria-haspopup="menu"
            onClick={(ev) => {
              const r = ev.currentTarget.getBoundingClientRect()
              setPopup({ label: 'All Programs', items: allPrograms, x: r.right - 4, y: r.top - 120 })
            }}
          >
            <span className="sm-label">All Programs</span>
            <span className="sm-all-arrow" aria-hidden="true">
              ▶
            </span>
          </button>
        </div>
        <div className="sm-right">{right.map((e) => item(e, false))}</div>
      </div>
      <footer className="sm-foot">
        <button type="button" className="sm-item sm-power" onClick={() => os.logOff()}>
          <Icon name="logoff" size={22} /> <span>Log Off</span>
        </button>
        <button type="button" className="sm-item sm-power" onClick={() => os.shutDown()}>
          <Icon name="power" size={22} /> <span>Shut Down</span>
        </button>
      </footer>
      {popup && (
        <PopupMenu
          key={popup.label}
          label={popup.label}
          items={popup.items}
          x={popup.x}
          y={Math.max(4, popup.y)}
          onClose={() => {
            setPopup(null)
            onClose()
          }}
          onBack={() => setPopup(null)}
        />
      )}
    </div>
  )
}
