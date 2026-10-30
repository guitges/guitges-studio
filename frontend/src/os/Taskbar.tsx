import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { Icon } from './icons'
import { Logo } from './Logo'
import { useOS } from './store'
import { StartMenu } from './StartMenu'

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(t)
  }, [])
  return (
    <time className="clock" dateTime={now.toISOString()} title={now.toLocaleDateString(undefined, { dateStyle: 'full' })}>
      {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
    </time>
  )
}

function BalloonTip() {
  const os = useOS()
  const b = os.balloon
  useEffect(() => {
    if (!b) return
    const t = window.setTimeout(() => os.notify(null), 9000)
    return () => window.clearTimeout(t)
  }, [b, os])
  if (!b) return null
  return (
    <div className="balloon" role="status">
      <button type="button" className="balloon-x" aria-label="Dismiss notification" onClick={() => os.notify(null)}>
        ×
      </button>
      <p className="balloon-title">
        <Icon name={b.icon ?? 'info'} size={16} /> {b.title}
      </p>
      <p className="balloon-text">{b.text}</p>
    </div>
  )
}

export function Taskbar() {
  const os = useOS()
  const startBtn = useRef<HTMLButtonElement>(null)
  const tasks = os.wins.filter((w) => !w.closing)
  const allMin = tasks.length > 0 && tasks.every((w) => w.min)

  return (
    <>
      <footer className="taskbar">
        <button
          ref={startBtn}
          type="button"
          className={`start ${os.startOpen ? 'pressed' : ''}`}
          aria-haspopup="menu"
          aria-expanded={os.startOpen}
          aria-label="Start menu"
          onClick={() => os.setStartOpen((v) => !v)}
        >
          <Logo size={20} />
          <span>start</span>
        </button>

        <div className="quick" aria-label="Quick launch">
          <button
            type="button"
            className="qbtn"
            title={allMin ? 'Restore windows' : 'Show desktop'}
            aria-label={allMin ? 'Restore windows' : 'Show desktop'}
            onClick={() => (allMin ? tasks.forEach((w) => os.focus(w.id)) : tasks.forEach((w) => os.minimize(w.id)))}
          >
            <Icon name="desktop" size={18} />
          </button>
          <button type="button" className="qbtn" title="Internet Explorer" aria-label="Open Internet Explorer" onClick={() => os.launch('browser')}>
            <Icon name="browser" size={18} />
          </button>
          <button type="button" className="qbtn" title="Command Prompt" aria-label="Open Command Prompt" onClick={() => os.launch('terminal')}>
            <Icon name="terminal" size={18} />
          </button>
        </div>

        <div className="tasks" role="toolbar" aria-label="Open windows">
          {tasks.map((w) => (
            <button
              key={w.id}
              type="button"
              data-task={w.id}
              className={`task ${os.activeId === w.id ? 'pressed' : ''}`}
              aria-pressed={os.activeId === w.id}
              title={w.title}
              onClick={() => os.taskClick(w.id)}
            >
              <Icon name={w.icon} size={16} />
              <span>{w.title}</span>
            </button>
          ))}
        </div>

        <div className="tray">
          <button
            type="button"
            className="tray-btn"
            aria-pressed={os.settings.sound}
            aria-label={os.settings.sound ? 'Sound on. Turn interface sounds off' : 'Sound off. Turn interface sounds on'}
            title={os.settings.sound ? 'Sounds: on' : 'Sounds: off'}
            onClick={() => os.updateSettings({ sound: !os.settings.sound })}
          >
            <Icon name={os.settings.sound ? 'sound' : 'mute'} size={16} />
          </button>
          <button
            type="button"
            className="tray-btn tray-net"
            aria-label="Network: connected to the internet"
            title="Connected to the World Wide Web"
            onClick={() => os.notify({ title: 'Local Area Connection', text: `${site.computerName} is connected to the internet at a blistering 56 kbps (probably more).`, icon: 'network' })}
          >
            <Icon name="network" size={16} />
          </button>
          <Clock />
        </div>
        <BalloonTip />
      </footer>
      {os.startOpen && <StartMenu onClose={() => os.setStartOpen(false)} startBtn={startBtn} />}
    </>
  )
}
