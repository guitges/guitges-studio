import { useState, type KeyboardEvent } from 'react'
import { experience, site } from '../../data/site'
import { Icon } from '../icons'
import { useIntent } from '../intents'
import { ext, StatusBar } from '../ui'

export function Experience() {
  const [selected, setSelected] = useState(experience[0].id)
  useIntent('experience', (id) => experience.some((j) => j.id === id) && setSelected(id))
  const job = experience.find((j) => j.id === selected)!

  const onKey = (e: KeyboardEvent<HTMLTableSectionElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const i = experience.findIndex((j) => j.id === selected)
    const n = Math.min(Math.max(i + (e.key === 'ArrowDown' ? 1 : -1), 0), experience.length - 1)
    setSelected(experience[n].id)
    e.currentTarget.querySelectorAll<HTMLElement>('tr')[n]?.focus()
  }

  return (
    <div className="app app-explorer">
      <div className="toolbar">
        {site.links.resume ? (
          <a className="tool" href={site.links.resume} {...ext}>
            <Icon name="pdf" size={22} /> <span>Open résumé (PDF)</span>
          </a>
        ) : (
          <span className="tool muted">No résumé configured</span>
        )}
        {site.links.linkedin && (
          <a className="tool" href={site.links.linkedin} {...ext}>
            <Icon name="linkedin" size={22} /> <span>LinkedIn</span>
          </a>
        )}
      </div>
      <div className="exp-main">
        <div className="exp-list">
          <table className="listview" aria-label="Positions">
            <thead>
              <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Type</th>
                <th>Dates</th>
              </tr>
            </thead>
            <tbody onKeyDown={onKey}>
              {experience.map((j) => (
                <tr
                  key={j.id}
                  className="lv-row"
                  tabIndex={j.id === selected ? 0 : -1}
                  aria-selected={j.id === selected}
                  onClick={() => setSelected(j.id)}
                  onFocus={() => setSelected(j.id)}
                >
                  <td>
                    <span className="lv-name">
                      <Icon name="briefcase" size={16} /> {j.title}
                    </span>
                  </td>
                  <td>{j.company}</td>
                  <td>{j.type}</td>
                  <td className="nowrap">
                    {j.start} – {j.end}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <article className="exp-detail" aria-live="polite">
          <h3 className="pd-title">{job.title}</h3>
          <p className="muted">
            {job.company} · {job.location} · {job.start} – {job.end}
          </p>
          <p>{job.summary}</p>
          <h4 className="sub-head">Responsibilities</h4>
          <ul className="bullets">
            {job.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h4 className="sub-head">Technical context</h4>
          <ul className="chips">
            {job.stack.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </article>
      </div>
      <StatusBar>
        <span>{experience.length} positions</span>
        <span className="status-right">Select a row to see the details</span>
      </StatusBar>
    </div>
  )
}
