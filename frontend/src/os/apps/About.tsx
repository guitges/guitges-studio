import { useState } from 'react'
import { about, site } from '../../data/site'
import { Icon } from '../icons'
import { useOS } from '../store'
import { ext, Tabs } from '../ui'
import { useUptime } from './SysInfo'

type Tab = 'about' | 'system' | 'fun'

export function About() {
  const os = useOS()
  const [tab, setTab] = useState<Tab>('about')
  const uptime = useUptime()

  return (
    <div className="app app-dialog">
      <Tabs
        label="About Baihaqi"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'about', label: 'About' },
          { id: 'system', label: 'System Information' },
          { id: 'fun', label: 'Fun Facts' },
        ]}
      >
        {tab === 'about' && (
          <div className="about">
            <div className="about-head">
              <figure className="portrait">
                {site.portrait ? (
                  <img src={site.portrait} alt={`Portrait of ${site.name}`} width={112} height={112} />
                ) : (
                  <Icon name="user" size={96} />
                )}
              </figure>
              <div>
                <h3 className="about-name">{site.name}</h3>
                <p className="about-role">
                  {site.role} · Malaysia
                </p>
                <p className="about-quote">“{site.tagline}”</p>
              </div>
            </div>
            <fieldset className="group">
              <legend>About me</legend>
              {about.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </fieldset>
            <div className="btn-row">
              <button type="button" className="btn btn-default" onClick={() => os.launch('projects')}>
                See my projects
              </button>
              <button type="button" className="btn" onClick={() => os.launch('experience')}>
                Work history
              </button>
              {site.links.resume && (
                <a className="btn" href={site.links.resume} {...ext}>
                  Résumé (PDF)
                </a>
              )}
            </div>
          </div>
        )}

        {tab === 'system' && (
          <div className="sysinfo-tab">
            <fieldset className="group">
              <legend>Registered to</legend>
              <dl className="props">
                <dt>Name</dt>
                <dd>{site.name}</dd>
                <dt>Location</dt>
                <dd>{site.location}</dd>
                <dt>Current role</dt>
                <dd>Associate Consultant — Full-Stack Developer, E-Outsource Asia (Oct 2024 – present)</dd>
                <dt>Also</dt>
                <dd>Freelance full-stack developer, as Guitges</dd>
              </dl>
            </fieldset>
            <fieldset className="group">
              <legend>Education</legend>
              <dl className="props">
                <dt>Degree</dt>
                <dd>{site.education.degree}</dd>
                <dt>University</dt>
                <dd>{site.education.school}</dd>
                <dt>Years</dt>
                <dd>{site.education.years}</dd>
                <dt>CGPA</dt>
                <dd>{site.education.cgpa}</dd>
              </dl>
            </fieldset>
            <fieldset className="group">
              <legend>Certifications &amp; achievements</legend>
              <ul className="bullets">
                {[...site.certifications, ...site.achievements].map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </fieldset>
          </div>
        )}

        {tab === 'fun' && (
          <div>
            <fieldset className="group">
              <legend>Fun facts</legend>
              <ul className="bullets">
                {about.funFacts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </fieldset>
            <fieldset className="group">
              <legend>Diagnostics</legend>
              <dl className="props">
                <dt>Desktop uptime</dt>
                <dd>{uptime}</dd>
                <dt>Coffee level</dt>
                <dd>
                  <span className="progress" aria-label="Coffee level: worryingly specific">
                    <span className="progress-fill" style={{ width: '62%' }} />
                  </span>
                </dd>
                <dt>Status</dt>
                <dd>Probably renaming a variable.</dd>
              </dl>
            </fieldset>
          </div>
        )}
      </Tabs>
      <div className="dialog-foot">
        <button type="button" className="btn" onClick={() => os.close('about')}>
          Close
        </button>
      </div>
    </div>
  )
}
