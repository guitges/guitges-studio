import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { projects } from '../data/projects'
import { Logo } from './Logo'
import { sendIntent } from './intents'
import { useOS } from './store'

/** The first thing a visitor sees: a small system dialog over the desktop. Never a loading screen. */
export function WelcomeDialog() {
  const os = useOS()
  const btn = useRef<HTMLButtonElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    btn.current?.focus()
  }, [])

  const enterThen = (f?: () => void) => {
    os.enterDesktop()
    if (f) window.setTimeout(f, 60)
  }

  return (
    <div
      className="welcome-veil"
      onKeyDown={(e) => {
        if (e.key === 'Escape') enterThen()
        // Keep Tab inside the dialog
        if (e.key === 'Tab' && ref.current) {
          const f = [...ref.current.querySelectorAll<HTMLElement>('button, a[href]')]
          const i = f.indexOf(document.activeElement as HTMLElement)
          const n = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : i === f.length - 1 ? 0 : i + 1
          e.preventDefault()
          f[n]?.focus()
        }
      }}
    >
      <div ref={ref} className="win active fixed welcome" role="dialog" aria-modal="true" aria-labelledby="welcome-title" aria-describedby="welcome-desc">
        <header className="titlebar">
          <Logo size={16} className="titlebar-icon" />
          <h2 className="titlebar-text" id="welcome-title">
            Welcome to {site.osName}
          </h2>
          <div className="controls">
            <button type="button" className="ctl ctl-close" aria-label="Close and enter the desktop" onClick={() => enterThen()}>
              <span />
            </button>
          </div>
        </header>
        <div className="welcome-body" id="welcome-desc">
          <div className="welcome-hero">
            <Logo size={64} />
            <div>
              <p className="welcome-big">Welcome to {site.osName}</p>
              <p className="welcome-ok">
                <span className="led" aria-hidden="true" /> System ready.
              </p>
            </div>
          </div>
          <p>This computer contains:</p>
          <ul className="welcome-list">
            <li>1 curious developer ({site.name}, {site.role.toLowerCase()})</li>
            <li>{projects.length} projects, and counting</li>
            <li>An unreasonable number of browser tabs</li>
          </ul>
          <p className="welcome-hint">
            {os.compact ? 'Tap an icon to open it.' : 'Double-click an icon to open it.'} Everything is also in the <b>Start</b> menu.
          </p>
          <div className="welcome-quick">
            <span className="muted small">In a hurry?</span>
            <button type="button" className="btn btn-small" onClick={() => enterThen(() => os.launch('projects'))}>
              Projects
            </button>
            <button type="button" className="btn btn-small" onClick={() => enterThen(() => os.launch('experience'))}>
              Experience
            </button>
            {site.links.resume && (
              <a className="btn btn-small" href={site.links.resume} target="_blank" rel="noopener noreferrer">
                Résumé
              </a>
            )}
            <button
              type="button"
              className="btn btn-small"
              onClick={() =>
                enterThen(() => {
                  sendIntent('browser', 'contact')
                  os.launch('browser')
                })
              }
            >
              Contact
            </button>
          </div>
        </div>
        <div className="welcome-foot">
          <button ref={btn} type="button" className="btn btn-default btn-enter" onClick={() => enterThen()}>
            ENTER DESKTOP
          </button>
        </div>
      </div>
    </div>
  )
}

export function ShutdownScreen() {
  const os = useOS()
  const [done, setDone] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 1400)
    return () => window.clearTimeout(t)
  }, [])
  useEffect(() => {
    if (done) btn.current?.focus()
  }, [done])

  return (
    <div className="shutdown" role="dialog" aria-modal="true" aria-label="Shut down">
      {!done ? (
        <div className="sd-saving" aria-live="polite">
          <Logo size={48} />
          <p>Saving your settings…</p>
          <p className="muted-light">Folding the clouds neatly.</p>
        </div>
      ) : (
        <div className="sd-safe">
          <p className="sd-big">It is now safe to close this tab.</p>
          <p className="sd-small">(Or don’t. The clouds will miss you.)</p>
          <button ref={btn} type="button" className="btn btn-default" onClick={os.enterDesktop}>
            Restart
          </button>
        </div>
      )}
    </div>
  )
}
