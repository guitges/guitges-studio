import { useState } from 'react'
import { site } from '../../data/site'
import { Logo } from '../Logo'
import { play, setSoundEnabled } from '../sound'
import { useOS, type Settings, type ThemeId, type WallpaperId } from '../store'
import { useIntent } from '../intents'
import { Tabs } from '../ui'
import { Wallpaper } from '../Wallpaper'

type Tab = 'general' | 'display' | 'appearance' | 'sound' | 'about'

export const WALLPAPERS: { id: WallpaperId; name: string }[] = [
  { id: 'daydream', name: 'Daydream' },
  { id: 'meadow', name: 'Meadow' },
  { id: 'dusk', name: 'Aero Dusk' },
  { id: 'classic', name: 'Classic Teal' },
]

export const THEMES: { id: ThemeId; name: string; note: string }[] = [
  { id: 'xp', name: 'Classic XP Blue', note: 'The default. Bright blue title bars and a green Start button.' },
  { id: 'silver', name: 'Silver Millennium', note: 'Brushed silver, for the serious professional.' },
  { id: 'dream', name: 'Dreamy Sky', note: 'Aqua and lilac, like a screensaver you forgot about.' },
]

export function SystemProperties() {
  const os = useOS()
  const [tab, setTab] = useState<Tab>('general')
  useIntent('system', (t) => setTab(t as Tab))
  const [draft, setDraft] = useState<Settings>(os.settings)
  const changed = (Object.keys(draft) as (keyof Settings)[]).some((k) => draft[k] !== os.settings[k])
  const set = (patch: Partial<Settings>) => setDraft((d) => ({ ...d, ...patch }))

  const apply = () => os.updateSettings(draft)

  return (
    <div className="app app-dialog">
      <Tabs
        label="System Properties"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'display', label: 'Display' },
          { id: 'appearance', label: 'Appearance' },
          { id: 'sound', label: 'Sound' },
          { id: 'about', label: 'About' },
        ]}
      >
        {tab === 'general' && (
          <div className="sp-general">
            <Logo size={72} />
            <dl className="props">
              <dt>System</dt>
              <dd>
                {site.osName} Desktop Environment
                <br />
                Version {site.version}
              </dd>
              <dt>Computer name</dt>
              <dd>{site.computerName}</dd>
              <dt>Registered to</dt>
              <dd>
                {site.name}
                <br />
                {site.role}
              </dd>
              <dt>Architecture</dt>
              <dd>Web (React · TypeScript)</dd>
              <dt>Display</dt>
              <dd>
                {window.innerWidth} × {window.innerHeight}, millions of colours
              </dd>
            </dl>
          </div>
        )}

        {tab === 'display' && (
          <div>
            <div className="monitor" aria-hidden="true">
              <div className="monitor-screen">
                <Wallpaper id={draft.wallpaper} mini />
              </div>
              <div className="monitor-stand" />
            </div>
            <fieldset className="group">
              <legend>Wallpaper</legend>
              <div className="listbox" role="radiogroup" aria-label="Wallpaper">
                {WALLPAPERS.map((w) => (
                  <label key={w.id} className={`listbox-item ${draft.wallpaper === w.id ? 'on' : ''}`}>
                    <input type="radio" name="wallpaper" checked={draft.wallpaper === w.id} onChange={() => set({ wallpaper: w.id })} />
                    {w.name}
                  </label>
                ))}
              </div>
              <label className="check">
                <input type="checkbox" checked={draft.clouds} onChange={(e) => set({ clouds: e.target.checked })} /> Let the clouds drift
              </label>
            </fieldset>
          </div>
        )}

        {tab === 'appearance' && (
          <div>
            <div className={`theme-preview os-theme-${draft.theme}`} aria-hidden="true">
              <div className="win active fixed tp-win">
                <header className="titlebar">
                  <span className="titlebar-text">Active Window</span>
                  <div className="controls">
                    <span className="ctl ctl-min">
                      <span />
                    </span>
                    <span className="ctl ctl-close">
                      <span />
                    </span>
                  </div>
                </header>
                <div className="tpv-body">
                  <span className="btn">OK</span>
                </div>
              </div>
            </div>
            <fieldset className="group">
              <legend>Windows and buttons</legend>
              {THEMES.map((t) => (
                <label key={t.id} className="radio">
                  <input type="radio" name="theme" checked={draft.theme === t.id} onChange={() => set({ theme: t.id })} />
                  <span>
                    <strong>{t.name}</strong>
                    <br />
                    <span className="muted">{t.note}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <fieldset className="group">
              <legend>Desktop icons</legend>
              <label className="radio">
                <input type="radio" name="icons" checked={draft.iconSize === 'large'} onChange={() => set({ iconSize: 'large' })} /> Large icons
              </label>
              <label className="radio">
                <input type="radio" name="icons" checked={draft.iconSize === 'small'} onChange={() => set({ iconSize: 'small' })} /> Small icons
              </label>
            </fieldset>
          </div>
        )}

        {tab === 'sound' && (
          <div>
            <fieldset className="group">
              <legend>Interface sounds</legend>
              <label className="check">
                <input type="checkbox" checked={draft.sound} onChange={(e) => set({ sound: e.target.checked })} /> Play gentle sounds when windows open and close
              </label>
              <p className="muted small">
                Off by default, and never on when you arrive. Sounds are synthesised in your browser; there is no music and nothing autoplays.
              </p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setSoundEnabled(true)
                  play('ding')
                  setSoundEnabled(os.settings.sound)
                }}
              >
                ▶ Test sound
              </button>
            </fieldset>
          </div>
        )}

        {tab === 'about' && (
          <div className="sp-about">
            <p>
              <strong>{site.osName}</strong> is the portfolio of {site.name}, built as a small, slightly impossible desktop from 2003.
            </p>
            <p>Every window, button and scrollbar here is hand-made HTML and CSS. No screenshots of real operating systems were used, and it is not affiliated with any of them.</p>
            <p>
              Source:{' '}
              <a className="link" href={site.links.source} target="_blank" rel="noopener noreferrer">
                {site.links.source.replace('https://', '')}
              </a>
            </p>
          </div>
        )}
      </Tabs>
      <div className="dialog-foot">
        <button
          type="button"
          className="btn btn-default"
          onClick={() => {
            apply()
            os.close('system')
          }}
        >
          OK
        </button>
        <button type="button" className="btn" onClick={() => os.close('system')}>
          Cancel
        </button>
        <button type="button" className="btn" disabled={!changed} onClick={apply}>
          Apply
        </button>
      </div>
    </div>
  )
}
