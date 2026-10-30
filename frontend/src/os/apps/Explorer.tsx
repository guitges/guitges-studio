import { useMemo, useState, type KeyboardEvent } from 'react'
import { experience, site, skills } from '../../data/site'
import { Icon, type IconName } from '../icons'
import { sendIntent } from '../intents'
import { useOS } from '../store'
import { useProjects } from '../useProjects'
import { StatusBar } from '../ui'
import { openNote } from './Notepad'

type Folder = 'desktop' | 'about' | 'projects' | 'skills' | 'experience' | 'contact'

interface Item {
  id: string
  name: string
  icon: IconName
  type: string
  folder?: Folder
  open?: () => void
}

const FOLDERS: { id: Exclude<Folder, 'desktop'>; name: string }[] = [
  { id: 'about', name: 'About Me' },
  { id: 'projects', name: 'Projects' },
  { id: 'skills', name: 'Skills' },
  { id: 'experience', name: 'Experience' },
  { id: 'contact', name: 'Contact' },
]

const ROOT = 'C:\\Users\\Baihaqi\\Desktop'

const pathOf = (f: Folder) => (f === 'desktop' ? ROOT : `${ROOT}\\${FOLDERS.find((x) => x.id === f)!.name}`)

export function Explorer() {
  const os = useOS()
  const { projects } = useProjects()
  const [history, setHistory] = useState<Folder[]>(['desktop'])
  const [at, setAt] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const folder = history[at]

  const go = (f: Folder) => {
    setHistory((h) => [...h.slice(0, at + 1), f])
    setAt(at + 1)
    setSelected(null)
    setQuery('')
  }

  const items = useMemo<Item[]>(() => {
    const url = (name: string, href: string, icon: IconName = 'url'): Item => ({
      id: name,
      name,
      icon,
      type: 'Internet Shortcut',
      open: () => window.open(href, href.startsWith('mailto:') ? '_self' : '_blank', 'noopener,noreferrer'),
    })
    switch (folder) {
      case 'desktop':
        return [
          ...FOLDERS.map((f) => ({ id: f.id, name: f.name, icon: 'folder' as IconName, type: 'File Folder', folder: f.id })),
          ...(site.links.resume
            ? [{ id: 'resume', name: 'Résumé.pdf', icon: 'pdf' as IconName, type: 'PDF Document', open: () => window.open(site.links.resume, '_blank', 'noopener') }]
            : []),
        ]
      case 'about':
        return [
          { id: 'about', name: 'About Baihaqi.exe', icon: 'user', type: 'Application', open: () => os.launch('about') },
          {
            id: 'edu',
            name: 'education.txt',
            icon: 'txt',
            type: 'Text Document',
            open: () =>
              openNote(os, 'education.txt', `${site.education.degree}\n${site.education.school}\n${site.education.years}\nCGPA ${site.education.cgpa}\n`),
          },
          {
            id: 'certs',
            name: 'certifications.txt',
            icon: 'txt',
            type: 'Text Document',
            open: () => openNote(os, 'certifications.txt', [...site.certifications, '', 'Achievements:', ...site.achievements].join('\n') + '\n'),
          },
          { id: 'sys', name: 'This computer.inf', icon: 'info', type: 'System Information', open: () => os.launch('sysinfo') },
        ]
      case 'projects':
        return [
          { id: 'all', name: 'Projects.exe', icon: 'folderOpen', type: 'Application', open: () => os.launch('projects') },
          ...projects.map((p) => ({
            id: p.id,
            name: p.file,
            icon: (p.link && !p.listed ? 'exe' : 'url') as IconName,
            type: `${p.type} project`,
            open: () => os.launch('project', p.id, { title: p.name }),
          })),
        ]
      case 'skills':
        return skills.map((s) => ({
          id: s.tab,
          name: `${s.tab}.cpl`,
          icon: s.icon,
          type: `${s.items.length} components`,
          open: () => {
            sendIntent('skills', s.tab)
            os.launch('skills')
          },
        }))
      case 'experience':
        return [
          ...experience.map((j) => ({
            id: j.id,
            name: `${j.company} — ${j.start}.job`,
            icon: 'briefcase' as IconName,
            type: j.title,
            open: () => {
              sendIntent('experience', j.id)
              os.launch('experience')
            },
          })),
          ...(site.links.resume
            ? [{ id: 'resume', name: 'Résumé.pdf', icon: 'pdf' as IconName, type: 'PDF Document', open: () => window.open(site.links.resume, '_blank', 'noopener') }]
            : []),
        ]
      case 'contact':
        return [
          ...(site.links.email ? [url('Email me.url', `mailto:${site.links.email}`, 'mail')] : []),
          ...(site.links.github ? [url('GitHub.url', site.links.github, 'github')] : []),
          ...(site.links.linkedin ? [url('LinkedIn.url', site.links.linkedin, 'linkedin')] : []),
          ...(site.links.whatsapp ? [url('WhatsApp.url', site.links.whatsapp, 'chat')] : []),
          {
            id: 'gb',
            name: 'Guestbook.htm',
            icon: 'guestbook',
            type: 'HTML Document',
            open: () => {
              sendIntent('browser', 'guestbook')
              os.launch('browser')
            },
          },
        ]
    }
  }, [folder, os, projects])

  const shown = query ? items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())) : items
  const sel = shown.find((i) => i.id === selected)

  const activate = (i: Item) => {
    if (i.folder) go(i.folder)
    else i.open?.()
  }

  const onKey = (e: KeyboardEvent) => {
    if (!shown.length) return
    const i = shown.findIndex((x) => x.id === selected)
    if (e.key === 'Enter' && sel) {
      e.preventDefault()
      activate(sel)
    } else if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault()
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
      const n = i < 0 ? 0 : Math.min(Math.max(i + d, 0), shown.length - 1)
      setSelected(shown[n].id)
      ;(e.currentTarget.querySelectorAll<HTMLElement>('.file')[n] as HTMLElement | undefined)?.focus()
    } else if (e.key === 'Backspace' && folder !== 'desktop') {
      e.preventDefault()
      go('desktop')
    }
  }

  return (
    <div className="app app-explorer">
      <div className="toolbar">
        <button type="button" className="tool" disabled={at === 0} onClick={() => (setAt(at - 1), setSelected(null))}>
          <Icon name="back" size={22} /> <span>Back</span>
        </button>
        <button type="button" className="tool" disabled={at >= history.length - 1} onClick={() => (setAt(at + 1), setSelected(null))} aria-label="Forward">
          <Icon name="forward" size={22} />
        </button>
        <button type="button" className="tool" disabled={folder === 'desktop'} onClick={() => go('desktop')} aria-label="Up one level">
          <Icon name="up" size={22} />
        </button>
        <span className="tool-sep" />
        <button type="button" className={`tool ${searching ? 'pressed' : ''}`} aria-pressed={searching} onClick={() => (setSearching(!searching), setQuery(''))}>
          <Icon name="search" size={22} /> <span>Search</span>
        </button>
      </div>
      <div className="addressbar">
        <span className="addr-label">Address</span>
        <div className="addr-field">
          <Icon name={folder === 'desktop' ? 'desktop' : 'folderOpen'} size={16} />
          <span className="addr-text">{pathOf(folder)}</span>
        </div>
      </div>

      <div className="explorer-main">
        <aside className="taskpane" aria-label="Tasks and places">
          {searching && (
            <div className="tp-box">
              <h3 className="tp-head">Search this folder</h3>
              <div className="tp-body">
                <label className="field-label" htmlFor="ex-search">
                  All or part of the file name:
                </label>
                <input id="ex-search" className="field" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
              </div>
            </div>
          )}
          <div className="tp-box">
            <h3 className="tp-head">System Tasks</h3>
            <div className="tp-body">
              <button type="button" className="tp-link" onClick={() => os.launch('sysinfo')}>
                <Icon name="info" size={16} /> View system information
              </button>
              <button type="button" className="tp-link" onClick={() => os.launch('system')}>
                <Icon name="settings" size={16} /> Change a setting
              </button>
              <button type="button" className="tp-link" onClick={() => os.launch('terminal')}>
                <Icon name="terminal" size={16} /> Open Command Prompt
              </button>
            </div>
          </div>
          <div className="tp-box">
            <h3 className="tp-head">Other Places</h3>
            <div className="tp-body">
              {(['desktop', ...FOLDERS.map((f) => f.id)] as Folder[])
                .filter((f) => f !== folder)
                .map((f) => (
                  <button key={f} type="button" className="tp-link" onClick={() => go(f)}>
                    <Icon name={f === 'desktop' ? 'desktop' : 'folder'} size={16} /> {f === 'desktop' ? 'Desktop' : FOLDERS.find((x) => x.id === f)!.name}
                  </button>
                ))}
            </div>
          </div>
          <div className="tp-box">
            <h3 className="tp-head">Details</h3>
            <div className="tp-body tp-details">
              <strong>{sel ? sel.name : folder === 'desktop' ? 'Desktop' : FOLDERS.find((x) => x.id === folder)!.name}</strong>
              <span>{sel ? sel.type : 'File Folder'}</span>
            </div>
          </div>
        </aside>

        <div className="filearea" role="listbox" aria-label={pathOf(folder)} onKeyDown={onKey} onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          {shown.map((i, n) => (
            <div
              key={i.id}
              role="option"
              aria-selected={selected === i.id}
              tabIndex={selected === i.id || (!sel && n === 0) ? 0 : -1}
              className="file tile"
              onClick={() => (os.compact ? activate(i) : setSelected(i.id))}
              onDoubleClick={() => activate(i)}
              onFocus={() => setSelected(i.id)}
            >
              <Icon name={i.icon} size={40} />
              <span className="file-text">
                <span className="file-name">{i.name}</span>
                <span className="file-type">{i.type}</span>
              </span>
            </div>
          ))}
          {!shown.length && <p className="empty-note">Search is complete. There are no results to display.</p>}
        </div>
      </div>
      <StatusBar>
        <span>
          {shown.length} object{shown.length === 1 ? '' : 's'}
        </span>
        <span className="status-right">
          <Icon name="computer" size={16} /> My Computer
        </span>
      </StatusBar>
    </div>
  )
}
