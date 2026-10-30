import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { experience, site, skills } from '../../data/site'
import { projects } from '../../data/projects'
import type { AppId } from '../registry'
import { useOS, useWin, type ThemeId } from '../store'
import { sendIntent } from '../intents'
import { play } from '../sound'

// A safe, simulated prompt. Nothing typed here is executed: every command is a case below.

const PROMPT = 'C:\\Users\\Baihaqi>'

const OPENABLE: Record<string, AppId> = {
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  experience: 'experience',
  work: 'experience',
  computer: 'computer',
  explorer: 'computer',
  notepad: 'notepad',
  browser: 'browser',
  ie: 'browser',
  guestbook: 'browser',
  recycle: 'recycle',
  bin: 'recycle',
  system: 'system',
  settings: 'system',
}

const COMMANDS: [string, string][] = [
  ['help', 'Show this list'],
  ['about', 'Who lives here'],
  ['projects', 'List projects (then: project <number>)'],
  ['skills', 'Installed skills, by category'],
  ['experience', 'Work history'],
  ['contact', 'How to reach Baihaqi'],
  ['resume', 'Open the résumé (PDF)'],
  ['open <app>', 'Open a window: about, projects, skills, notepad, guestbook…'],
  ['theme <name>', 'Change the theme: xp, silver, dream'],
  ['whoami', 'Identify the current user'],
  ['date', 'Show the date and time'],
  ['dir', 'List the desktop'],
  ['history', 'Commands you have typed'],
  ['clear', 'Clear the screen (also: cls)'],
  ['exit', 'Close the Command Prompt'],
]

const NAMES = ['help', 'about', 'projects', 'project', 'skills', 'experience', 'contact', 'resume', 'open', 'theme', 'whoami', 'date', 'time', 'dir', 'ls', 'history', 'clear', 'cls', 'exit', 'echo', 'ver', 'cd', 'secret', 'sudo']

interface Line {
  id: number
  input?: string
  out?: ReactNode
}

let seq = 0

export function Terminal() {
  const os = useOS()
  const win = useWin()
  const [lines, setLines] = useState<Line[]>(() => [
    {
      id: seq++,
      out: (
        <>
          {site.osName} [Version {site.version}]
          <br />
          (C) 2003–2026 {site.name}. All rights reserved, most wrongs too.
          <br />
          <br />
          Type <b>help</b> to see what this computer understands.
        </>
      ),
    },
  ])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' })
  }, [lines])

  const btn = (label: string, onClick: () => void) => (
    <button type="button" className="term-link" onClick={onClick}>
      {label}
    </button>
  )

  const run = (raw: string): ReactNode | 'clear' | null => {
    const [cmd = '', ...rest] = raw.trim().split(/\s+/)
    const arg = rest.join(' ')
    const c = cmd.toLowerCase()
    switch (c) {
      case '':
        return null
      case 'help':
      case '?':
        return (
          <table className="term-table">
            <tbody>
              {COMMANDS.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'about':
        return (
          <>
            {site.name} — {site.role}, {site.location}.
            <br />“{site.tagline}”
            <br />
            {btn('[open About Baihaqi]', () => os.launch('about'))}
          </>
        )
      case 'projects':
        return (
          <>
            {projects.map((p, i) => (
              <div key={p.id}>
                {String(i + 1).padStart(2, ' ')}. {btn(p.name, () => os.launch('project', p.id, { title: p.name }))}{' '}
                <span className="term-dim">
                  [{p.type}, {p.status}]
                </span>
              </div>
            ))}
            <br />
            Type <b>project 2</b> (or click a name) to open one.
          </>
        )
      case 'project': {
        const n = Number(arg)
        const p = Number.isInteger(n) ? projects[n - 1] : projects.find((x) => x.id === arg.toLowerCase() || x.name.toLowerCase() === arg.toLowerCase())
        if (!p) return `Project "${arg}" not found. Type "projects" for the list.`
        os.launch('project', p.id, { title: p.name })
        return `Opening ${p.name}…`
      }
      case 'skills':
        return (
          <>
            {skills.map((s) => (
              <div key={s.tab}>
                <b>{s.tab.padEnd(11, ' ')}</b> {s.items.map((i) => i.name).join(', ')}
              </div>
            ))}
            <br />
            {btn('[open Skills and Components]', () => os.launch('skills'))}
          </>
        )
      case 'experience':
      case 'work':
        return (
          <>
            {experience.map((j) => (
              <div key={j.id}>
                {`${j.start} – ${j.end}`.padEnd(20, ' ')}{' '}
                {btn(`${j.title}, ${j.company}`, () => {
                  sendIntent('experience', j.id)
                  os.launch('experience')
                })}
              </div>
            ))}
          </>
        )
      case 'contact':
        return (
          <>
            {site.links.email && (
              <div>
                email     <a className="term-link" href={`mailto:${site.links.email}`}>{site.links.email}</a>
              </div>
            )}
            {site.links.github && (
              <div>
                github    <a className="term-link" href={site.links.github} target="_blank" rel="noopener noreferrer">{site.links.github.replace('https://', '')}</a>
              </div>
            )}
            {site.links.linkedin && (
              <div>
                linkedin  <a className="term-link" href={site.links.linkedin} target="_blank" rel="noopener noreferrer">{site.links.linkedin.replace('https://', '')}</a>
              </div>
            )}
          </>
        )
      case 'resume':
        if (!site.links.resume) return 'No résumé is configured on this computer.'
        window.open(site.links.resume, '_blank', 'noopener')
        return 'Opening resume.pdf in a new tab…'
      case 'open':
      case 'start': {
        const app = OPENABLE[arg.toLowerCase()]
        if (!app) return `Cannot find '${arg || '?'}'. Try: ${Object.keys(OPENABLE).slice(0, 8).join(', ')}…`
        if (arg.toLowerCase() === 'guestbook') sendIntent('browser', 'guestbook')
        os.launch(app)
        return `Starting ${arg}…`
      }
      case 'theme': {
        const map: Record<string, ThemeId> = { xp: 'xp', blue: 'xp', silver: 'silver', dream: 'dream', dreamy: 'dream' }
        const t = map[arg.toLowerCase()]
        if (!t) return 'Usage: theme xp | silver | dream'
        os.updateSettings({ theme: t })
        return `Theme changed to ${t}. Lovely.`
      }
      case 'whoami':
        return `${site.osName.toLowerCase()} — software developer, professional tab hoarder.`
      case 'date':
      case 'time':
        return new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'medium' })
      case 'dir':
      case 'ls':
        return (
          <>
            {' '}Directory of C:\Users\Baihaqi\Desktop
            <br />
            <br />
            {['About Me', 'Projects', 'Skills', 'Experience', 'Contact'].map((d) => (
              <div key={d}>{`<DIR>          ${d}`}</div>
            ))}
            {site.links.resume && <div>{'     1,265,356 Résumé.pdf'}</div>}
            <div>{'             1 curious developer'}</div>
          </>
        )
      case 'cd':
        return 'You are already exactly where you need to be.'
      case 'history':
        return hist.length ? hist.map((h, i) => <div key={i}>{`${String(i + 1).padStart(3, ' ')}  ${h}`}</div>) : 'No history yet. Make some.'
      case 'echo':
        return arg || 'ECHO is on.'
      case 'ver':
        return `${site.osName} [Version ${site.version}]`
      case 'clear':
      case 'cls':
        return 'clear'
      case 'exit':
        os.close(win.id)
        return null
      case 'secret':
        play('ding')
        return (
          <span className="term-secret">
            ✦ You found the secret. ✦
            <br />
            Here it is: the clouds on this desktop are just CSS radial gradients, blurred and moving very slowly.
            <br />
            Want to say hi for real? {site.links.email || 'See Contact in the Start menu.'}
          </span>
        )
      case 'sudo':
        return 'visitor is not in the sudoers file. This incident will be reported to the clouds.'
      case 'rm':
        return arg.includes('-rf') ? 'Nice try. The Recycle Bin is the only thing that gets emptied around here.' : 'Access is denied.'
      case 'hello':
      case 'hi':
        return 'Hello! :)'
      case 'coffee':
        return 'Error 418: I’m a teapot.'
      default:
        return `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`
    }
  }

  const submit = () => {
    const raw = input
    setInput('')
    setHi(-1)
    if (raw.trim()) setHist((h) => [...h, raw.trim()])
    const out = run(raw)
    if (out === 'clear') return setLines([])
    setLines((l) => [...l, { id: seq++, input: raw, out: out ?? undefined }])
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!hist.length) return
      e.preventDefault()
      const n = e.key === 'ArrowUp' ? (hi < 0 ? hist.length - 1 : Math.max(0, hi - 1)) : hi < 0 ? -1 : hi + 1
      if (n >= hist.length || n < 0) {
        setHi(-1)
        setInput('')
      } else {
        setHi(n)
        setInput(hist[n])
      }
    } else if (e.key === 'Tab') {
      const [first, ...more] = input.split(' ')
      if (more.length || !first) return
      const match = NAMES.filter((c) => c.startsWith(first.toLowerCase()))
      if (match.length) {
        e.preventDefault()
        if (match.length === 1) setInput(match[0] + ' ')
        else setLines((l) => [...l, { id: seq++, input, out: match.join('  ') }])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="app terminal"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus()
      }}
    >
      <div className="term-scroll" role="log" aria-live="polite" aria-label="Command output">
        {lines.map((l) => (
          <div key={l.id} className="term-block">
            {l.input !== undefined && (
              <div>
                {PROMPT}
                {l.input}
              </div>
            )}
            {l.out !== undefined && <div className="term-out">{l.out}</div>}
          </div>
        ))}
        <div className="term-line" ref={bottom}>
          <label htmlFor={`${win.id}-in`}>{PROMPT}</label>
          <input
            id={`${win.id}-in`}
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Command"
          />
        </div>
      </div>
    </div>
  )
}
