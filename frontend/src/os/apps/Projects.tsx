import { useMemo, useState, type KeyboardEvent } from 'react'
import type { Project } from '../../data/projects'
import { Icon, type IconName } from '../icons'
import { useOS } from '../store'
import { useProjects } from '../useProjects'
import { StatusBar } from '../ui'

type View = 'tiles' | 'icons' | 'details' | 'thumbs'
type Sort = 'default' | 'name' | 'type'

const ART_ICON: Record<NonNullable<Project['art']>, IconName> = { desktop: 'desktop', chat: 'chat', server: 'server', shield: 'shield' }

export const projectIcon = (p: Project): IconName => (p.art ? ART_ICON[p.art] : p.listed ? 'url' : 'exe')

/** A screenshot when there is one, otherwise a small drawn picture */
export function Thumb({ p, eager }: { p: Project; eager?: boolean }) {
  if (p.image) return <img className="thumb-img" src={p.image.src} alt={p.image.alt} loading={eager ? 'eager' : 'lazy'} />
  return (
    <div className={`thumb-art art-${p.art ?? 'desktop'}`} role="img" aria-label={`Illustration for ${p.name}`}>
      <Icon name={projectIcon(p)} size={56} />
    </div>
  )
}

export function Projects() {
  const os = useOS()
  const { projects, loading } = useProjects()
  const [view, setView] = useState<View>('tiles')
  const [sort, setSort] = useState<Sort>('default')
  const [selected, setSelected] = useState<string | null>(null)

  const list = useMemo(() => {
    const l = [...projects]
    if (sort === 'name') l.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'type') l.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
    return l
  }, [projects, sort])

  const sel = list.find((p) => p.id === selected) ?? null
  const open = (p: Project) => os.launch('project', p.id, { title: p.name, icon: projectIcon(p) })

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = list.findIndex((p) => p.id === selected)
    if (e.key === 'Enter' && sel) {
      e.preventDefault()
      open(sel)
    } else if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault()
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
      const n = i < 0 ? 0 : Math.min(Math.max(i + d, 0), list.length - 1)
      setSelected(list[n].id)
      e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]')[n]?.focus()
    }
  }

  const item = (p: Project, n: number) => ({
    role: 'option',
    'aria-selected': selected === p.id,
    tabIndex: selected === p.id || (!sel && n === 0) ? 0 : -1,
    onClick: () => (os.compact ? open(p) : setSelected(p.id)),
    onDoubleClick: () => open(p),
    onFocus: () => setSelected(p.id),
  })

  return (
    <div className="app app-explorer">
      <div className="toolbar">
        <label className="tool-select">
          <Icon name="views" size={18} />
          <span>View</span>
          <select className="field" value={view} onChange={(e) => setView(e.target.value as View)} aria-label="View">
            <option value="tiles">Tiles</option>
            <option value="thumbs">Thumbnails</option>
            <option value="icons">Icons</option>
            <option value="details">Details</option>
          </select>
        </label>
        <label className="tool-select">
          <span>Arrange by</span>
          <select className="field" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Arrange icons by">
            <option value="default">Favourites first</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
          </select>
        </label>
      </div>
      <div className="addressbar">
        <span className="addr-label">Address</span>
        <div className="addr-field">
          <Icon name="folderOpen" size={16} />
          <span className="addr-text">C:\Users\Baihaqi\Desktop\Projects</span>
        </div>
      </div>

      <div className="explorer-main">
        <aside className="taskpane preview-pane" aria-label="Selected project">
          <div className="tp-box">
            <h3 className="tp-head">{sel ? 'Details' : 'Project Tasks'}</h3>
            <div className="tp-body">
              {sel ? (
                <div className="pv">
                  <div className="pv-thumb">
                    <Thumb p={sel} />
                  </div>
                  <strong>{sel.name}</strong>
                  <span className="muted">
                    {sel.type} · {sel.status}
                    {sel.year ? ` · ${sel.year}` : ''}
                  </span>
                  <p className="pv-sum">{sel.summary}</p>
                  <button type="button" className="btn btn-default" onClick={() => open(sel)}>
                    Open
                  </button>
                </div>
              ) : (
                <p className="muted small">
                  Select a project to see a preview here. Double-click it (or press Enter) to open its full details.
                </p>
              )}
            </div>
          </div>
        </aside>

        <div className={`filearea view-${view}`} role="listbox" aria-label="Projects" onKeyDown={onKey} onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          {view === 'details' ? (
            <table className="listview">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Stack</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p, n) => (
                  <tr {...item(p, n)} key={p.id} className="lv-row">
                    <td>
                      <span className="lv-name">
                        <Icon name={projectIcon(p)} size={16} /> {p.name}
                      </span>
                    </td>
                    <td>{p.type}</td>
                    <td>{p.status}</td>
                    <td className="lv-dim">{(p.stack.length ? p.stack : p.tags ?? []).slice(0, 4).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            list.map((p, n) => (
              <div {...item(p, n)} key={p.id} className={`file ${view === 'tiles' ? 'tile' : view === 'icons' ? 'icon' : 'thumb'}`}>
                {view === 'thumbs' ? (
                  <span className="thumb-frame">
                    <Thumb p={p} />
                  </span>
                ) : (
                  <Icon name={projectIcon(p)} size={view === 'icons' ? 32 : 40} />
                )}
                <span className="file-text">
                  <span className="file-name">{view === 'icons' ? p.file : p.name}</span>
                  {view === 'tiles' && (
                    <span className="file-type">
                      {p.type} · {p.status}
                    </span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <StatusBar>
        <span>
          {list.length} objects{loading ? ' (looking for more…)' : ''}
        </span>
        <span className="status-right">{sel ? sel.stack.slice(0, 3).join(' · ') || sel.role : os.compact ? 'Tap a project to open it' : 'Double-click a project to open it'}</span>
      </StatusBar>
    </div>
  )
}
