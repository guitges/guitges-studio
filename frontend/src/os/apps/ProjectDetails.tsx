import { Icon } from '../icons'
import { useOS, useWin } from '../store'
import { useProjects } from '../useProjects'
import { ext, StatusBar } from '../ui'
import { projectIcon, Thumb } from './Projects'

export function ProjectDetails() {
  const os = useOS()
  const win = useWin()
  const { projects, loading } = useProjects()
  const p = projects.find((x) => x.id === win.arg)

  if (!p) {
    return (
      <div className="app app-dialog">
        <div className="pd-missing">
          <Icon name={loading ? 'info' : 'warning'} size={32} />
          <p>{loading ? 'Opening…' : 'This project could not be found. It may have been moved or deleted.'}</p>
        </div>
      </div>
    )
  }

  const keywords = p.stack.length ? p.stack : p.tags ?? []

  return (
    <div className="app app-doc">
      <div className="doc-scroll">
        <header className="pd-head">
          <Icon name={projectIcon(p)} size={32} />
          <div>
            <h3 className="pd-title">{p.name}</h3>
            <p className="muted">
              {p.type} project · {p.status}
              {p.year ? ` · ${p.year}` : ''}
            </p>
          </div>
        </header>

        <div className="pd-shot">
          <Thumb p={p} eager />
        </div>

        <fieldset className="group">
          <legend>Description</legend>
          <p>{p.summary}</p>
        </fieldset>

        {p.problem && (
          <fieldset className="group">
            <legend>Problem it solves</legend>
            <p>{p.problem}</p>
          </fieldset>
        )}

        {p.details.length > 0 && (
          <fieldset className="group">
            <legend>Implementation</legend>
            <ul className="bullets">
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </fieldset>
        )}

        <fieldset className="group">
          <legend>Properties</legend>
          <dl className="props">
            <dt>Role</dt>
            <dd>{p.role}</dd>
            <dt>Location</dt>
            <dd>
              {p.link ? (
                <a href={p.link.href} {...ext} className="link">
                  {p.link.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                'No public URL'
              )}
            </dd>
            <dt>Source</dt>
            <dd>
              {'href' in p.source ? (
                <a href={p.source.href} {...ext} className="link">
                  {p.source.href.replace(/^https?:\/\//, '')}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                p.source.note
              )}
            </dd>
            {keywords.length > 0 && (
              <>
                <dt>{p.stack.length ? 'Built with' : 'Keywords'}</dt>
                <dd>
                  <ul className="chips" aria-label={p.stack.length ? 'Tech stack' : 'Keywords'}>
                    {keywords.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </fieldset>
      </div>
      <div className="dialog-foot">
        {p.link && (
          <a className="btn btn-default" href={p.link.href} {...ext}>
            {p.id === 'guitges' ? 'Open in a new tab' : 'Visit live project'} ↗
          </a>
        )}
        {'href' in p.source && (
          <a className="btn" href={p.source.href} {...ext}>
            View on GitHub ↗
          </a>
        )}
        <button type="button" className="btn" onClick={() => os.close(win.id)}>
          Close
        </button>
      </div>
      <StatusBar>
        <span>{p.file}</span>
        <span className="status-right">{p.link ? 'Internet' : 'Local'}</span>
      </StatusBar>
    </div>
  )
}
