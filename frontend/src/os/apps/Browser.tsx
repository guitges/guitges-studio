import { useEffect, useRef, useState, type FormEvent } from 'react'
import { site } from '../../data/site'
import { projects } from '../../data/projects'
import { Icon } from '../icons'
import { useIntent } from '../intents'
import { play } from '../sound'
import { useOS } from '../store'
import { ext, StatusBar } from '../ui'

type Page = 'home' | 'contact' | 'guestbook' | 'error'

const HOST = 'http://www.baihaqi.exe/'
const PAGES: Record<Exclude<Page, 'error'>, string> = { home: 'index.htm', contact: 'contact.htm', guestbook: 'guestbook.htm' }

function parse(input: string): Page {
  const s = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')
  if (s === 'baihaqi.exe' || s === 'baihaqi.exe/' || s.endsWith('index.htm') || s === '' || s === 'home') return 'home'
  if (s.includes('contact')) return 'contact'
  if (s.includes('guestbook')) return 'guestbook'
  return 'error'
}

export function Browser() {
  const [hist, setHist] = useState<{ page: Page; url: string }[]>([{ page: 'home', url: HOST + PAGES.home }])
  const [at, setAt] = useState(0)
  const [address, setAddress] = useState(HOST + PAGES.home)
  const [loading, setLoading] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const cur = hist[at]

  const load = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 350)
  }

  const nav = (page: Page, url = page === 'error' ? address : HOST + PAGES[page]) => {
    setHist((h) => [...h.slice(0, at + 1), { page, url }])
    setAt(at + 1)
    setAddress(url)
    load()
  }

  useIntent('browser', (p) => (p === 'guestbook' || p === 'contact' || p === 'home') && nav(p))

  useEffect(() => {
    scroller.current?.scrollTo(0, 0)
  }, [at])

  const step = (d: number) => {
    const n = at + d
    setAt(n)
    setAddress(hist[n].url)
    load()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const page = parse(address)
    nav(page, page === 'error' ? address : HOST + PAGES[page])
  }

  return (
    <div className="app app-browser">
      <div className="toolbar">
        <button type="button" className="tool" disabled={at === 0} onClick={() => step(-1)}>
          <Icon name="back" size={22} /> <span>Back</span>
        </button>
        <button type="button" className="tool" disabled={at >= hist.length - 1} onClick={() => step(1)} aria-label="Forward">
          <Icon name="forward" size={22} />
        </button>
        <button type="button" className="tool" onClick={load} aria-label="Refresh">
          <span className="tool-glyph" aria-hidden="true">
            ⟳
          </span>
        </button>
        <button type="button" className="tool" onClick={() => nav('home')}>
          <span className="tool-glyph" aria-hidden="true">
            ⌂
          </span>
          <span>Home</span>
        </button>
      </div>
      <form className="addressbar" onSubmit={submit}>
        <label className="addr-label" htmlFor="ie-address">
          Address
        </label>
        <div className="addr-field">
          <Icon name="url" size={16} />
          <input id="ie-address" className="addr-input" value={address} onChange={(e) => setAddress(e.target.value)} spellCheck={false} autoComplete="off" />
        </div>
        <button type="submit" className="btn btn-go">
          Go
        </button>
      </form>
      <div className="ie-view" ref={scroller}>
        {loading && <div className="ie-loading" aria-hidden="true" />}
        {cur.page === 'home' && <Home nav={nav} />}
        {cur.page === 'contact' && <Contact />}
        {cur.page === 'guestbook' && <Guestbook />}
        {cur.page === 'error' && <NotFound url={cur.url} />}
      </div>
      <StatusBar>
        <span>{loading ? 'Opening page…' : 'Done'}</span>
        <span className="status-right">
          <Icon name="browser" size={16} /> Internet
        </span>
      </StatusBar>
    </div>
  )
}

function visits() {
  try {
    const n = Number(localStorage.getItem('baihaqi.os.visits') || '0') + 1
    localStorage.setItem('baihaqi.os.visits', String(n))
    return n
  } catch {
    return 1
  }
}

let visitCount: number | null = null

function Home({ nav }: { nav: (p: Page) => void }) {
  const os = useOS()
  visitCount ??= visits()
  const real = projects.filter((p) => p.link && p.id !== 'guitges')
  return (
    <div className="web web-home">
      <div className="web-banner">
        <h3>Welcome to my homepage!</h3>
        <p>
          {site.name} · {site.role} · Malaysia
        </p>
      </div>
      <p className="web-marquee" aria-hidden="true">
        <span>★ now with 100% more clouds ★ best viewed in any browser made after 2003 ★ thanks for stopping by ★</span>
      </p>
      <div className="web-cols">
        <nav className="web-nav" aria-label="Homepage">
          <p className="web-nav-head">Navigation</p>
          <button type="button" className="link" onClick={() => os.launch('about')}>
            » About me
          </button>
          <button type="button" className="link" onClick={() => os.launch('projects')}>
            » My projects
          </button>
          <button type="button" className="link" onClick={() => nav('guestbook')}>
            » Sign my guestbook <span className="web-new">NEW!</span>
          </button>
          <button type="button" className="link" onClick={() => nav('contact')}>
            » Contact me
          </button>
        </nav>
        <div className="web-main">
          <p>
            Hi! You’ve found the homepage of a developer who builds web apps, backend APIs and, apparently, entire pretend
            operating systems. Have a look around, click everything, and please sign the guestbook before you go.
          </p>
          <p className="web-h">Elsewhere on the World Wide Web</p>
          <ul className="bullets">
            {real.map((p) => (
              <li key={p.id}>
                <a href={p.link!.href} {...ext} className="link">
                  {p.name}
                </a>{' '}
                <span className="muted">— {p.type.toLowerCase()} project</span>
              </li>
            ))}
            {site.links.github && (
              <li>
                <a href={site.links.github} {...ext} className="link">
                  GitHub
                </a>{' '}
                <span className="muted">— code and experiments</span>
              </li>
            )}
          </ul>
          <p className="web-counter">
            You have visited this page <span className="odometer">{String(visitCount).padStart(6, '0')}</span> time{visitCount === 1 ? '' : 's'}{' '}
            <span className="muted">(counted in your browser only)</span>
          </p>
        </div>
      </div>
      <p className="web-foot">Made with Notepad and love. © 2003–2026. This page is under construction, forever.</p>
    </div>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.links.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="web">
      <h3 className="web-title">Contact me</h3>
      <p>The quickest way to reach me is email. Links below open your own email app or the site in a new tab; this page doesn’t send anything itself.</p>
      <table className="web-table">
        <tbody>
          {site.links.email && (
            <tr>
              <th>
                <Icon name="mail" size={16} /> Email
              </th>
              <td>
                <a className="link" href={`mailto:${site.links.email}`}>
                  {site.links.email}
                </a>{' '}
                <button type="button" className="btn btn-small" onClick={copy}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </td>
            </tr>
          )}
          {site.links.linkedin && (
            <tr>
              <th>
                <Icon name="linkedin" size={16} /> LinkedIn
              </th>
              <td>
                <a className="link" href={site.links.linkedin} {...ext}>
                  {site.links.linkedin.replace(/^https?:\/\//, '')}
                </a>
              </td>
            </tr>
          )}
          {site.links.github && (
            <tr>
              <th>
                <Icon name="github" size={16} /> GitHub
              </th>
              <td>
                <a className="link" href={site.links.github} {...ext}>
                  {site.links.github.replace(/^https?:\/\//, '')}
                </a>
              </td>
            </tr>
          )}
          {site.links.whatsapp && (
            <tr>
              <th>
                <Icon name="chat" size={16} /> WhatsApp
              </th>
              <td>
                <a className="link" href={site.links.whatsapp} {...ext}>
                  Send a message
                </a>
              </td>
            </tr>
          )}
          {site.links.resume && (
            <tr>
              <th>
                <Icon name="pdf" size={16} /> Résumé
              </th>
              <td>
                <a className="link" href={site.links.resume} {...ext}>
                  resume.pdf
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="muted small">Based in {site.location}. Open to interesting work.</p>
    </div>
  )
}

interface Entry {
  id: string
  name: string
  message: string
  at: number
}

const GB_KEY = 'baihaqi.os.guestbook'

function readEntries(): Entry[] {
  try {
    const v = JSON.parse(localStorage.getItem(GB_KEY) || '[]')
    return Array.isArray(v) ? v.filter((e) => e && typeof e.name === 'string' && typeof e.message === 'string') : []
  } catch {
    return []
  }
}

function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>(readEntries)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState<boolean | null>(null)

  const persist = (list: Entry[]) => {
    setEntries(list)
    try {
      localStorage.setItem(GB_KEY, JSON.stringify(list))
      return true
    } catch {
      return false
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    const entry = { id: String(Date.now()), name: name.trim().slice(0, 32), message: message.trim().slice(0, 280), at: Date.now() }
    setSaved(persist([entry, ...entries].slice(0, 50)))
    setMessage('')
    play('ding')
  }

  return (
    <div className="web">
      <h3 className="web-title">Guestbook</h3>
      <div className="notice">
        <Icon name="info" size={16} />
        <p>
          This guestbook lives <strong>only in your browser</strong>. Entries are saved on this device and are not sent to
          Baihaqi or anyone else. Want to actually say hi? Use the <em>Contact</em> page.
        </p>
      </div>
      <form className="gb-form" onSubmit={submit}>
        <label className="field-label" htmlFor="gb-name">
          Your name (or a cool alias)
        </label>
        <input id="gb-name" className="field" maxLength={32} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="off" />
        <label className="field-label" htmlFor="gb-msg">
          Message <span className="muted">({280 - message.length} left)</span>
        </label>
        <textarea id="gb-msg" className="field" maxLength={280} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} required />
        <div className="btn-row">
          <button type="submit" className="btn btn-default">
            Sign guestbook
          </button>
          {entries.length > 0 && (
            <button type="button" className="btn" onClick={() => (persist([]), setSaved(null))}>
              Clear my entries
            </button>
          )}
          {saved === false && <span className="small">Couldn’t save: storage is blocked in this browser.</span>}
        </div>
      </form>
      <ol className="gb-list" aria-label="Guestbook entries">
        {entries.map((e) => (
          <li key={e.id} className="gb-entry">
            <p className="gb-meta">
              <strong>{e.name}</strong> wrote on {new Date(e.at).toLocaleString()}:
            </p>
            <p className="gb-msg">{e.message}</p>
          </li>
        ))}
        <li className="gb-entry gb-pinned">
          <p className="gb-meta">
            <strong>baihaqi</strong> (the webmaster) wrote:
          </p>
          <p className="gb-msg">thanks for visiting! the clouds are hand-made. please don’t tell anyone.</p>
        </li>
      </ol>
    </div>
  )
}

function NotFound({ url }: { url: string }) {
  const looksReal = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(url.trim()) && !/baihaqi\.exe/i.test(url)
  const href = /^https?:\/\//.test(url.trim()) ? url.trim() : `https://${url.trim()}`
  return (
    <div className="web web-error">
      <Icon name="warning" size={32} />
      <div>
        <h3 className="web-title">The page cannot be displayed</h3>
        <p>This is a pretend browser: it only knows the pages on www.baihaqi.exe.</p>
        <ul className="bullets">
          <li>Try the home page, contact page or guestbook.</li>
          {looksReal && (
            <li>
              Or open{' '}
              <a href={href} {...ext} className="link">
                {url.trim()}
              </a>{' '}
              in a real browser tab.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
