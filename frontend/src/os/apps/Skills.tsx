import { useState } from 'react'
import { skills, type SkillLevel } from '../../data/site'
import { Icon } from '../icons'
import { useIntent } from '../intents'
import { useOS } from '../store'
import { Tabs } from '../ui'

const LEVELS: { level: SkillLevel; bars: number; text: string }[] = [
  { level: 'Professional experience', bars: 3, text: 'used in paid, production work' },
  { level: 'Used in projects', bars: 2, text: 'used to build something real' },
  { level: 'Familiar with', bars: 1, text: 'studied, certified or tried' },
]

function Signal({ level }: { level: SkillLevel }) {
  const n = LEVELS.find((l) => l.level === level)!.bars
  return (
    <span className="signal" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'on' : ''} />
      ))}
    </span>
  )
}

export function Skills() {
  const os = useOS()
  const [tab, setTab] = useState(skills[0].tab)
  useIntent('skills', (t) => skills.some((s) => s.tab === t) && setTab(t))
  const group = skills.find((s) => s.tab === tab)!

  return (
    <div className="app app-dialog">
      <Tabs label="Skill categories" value={tab} onChange={setTab} tabs={skills.map((s) => ({ id: s.tab, label: s.tab }))}>
        <div className="skills-head">
          <Icon name={group.icon} size={32} />
          <p>
            <strong>{group.tab}</strong>
            <br />
            <span className="muted">
              {group.items.length} components installed. Levels say where a skill was used, not a score.
            </span>
          </p>
        </div>
        <ul className="components" aria-label={`${group.tab} skills`}>
          {group.items.map((s) => (
            <li key={s.name} className="component">
              <Signal level={s.level} />
              <span className="component-name">{s.name}</span>
              <span className={`level level-${LEVELS.find((l) => l.level === s.level)!.bars}`}>{s.level}</span>
              <span className="component-note">{s.note}</span>
            </li>
          ))}
        </ul>
        <fieldset className="group legend-box">
          <legend>Legend</legend>
          <ul className="legend">
            {LEVELS.map((l) => (
              <li key={l.level}>
                <Signal level={l.level} /> <strong>{l.level}</strong> <span className="muted">— {l.text}</span>
              </li>
            ))}
          </ul>
        </fieldset>
      </Tabs>
      <div className="dialog-foot">
        <button type="button" className="btn" onClick={() => os.launch('projects')}>
          See them in projects
        </button>
        <button type="button" className="btn btn-default" onClick={() => os.close('skills')}>
          OK
        </button>
      </div>
    </div>
  )
}
