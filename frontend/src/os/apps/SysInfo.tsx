import { useEffect, useState } from 'react'
import { site } from '../../data/site'
import { Logo } from '../Logo'
import { useOS } from '../store'

// A clearly fake uptime: this computer has supposedly been running since a 2003 install
const INSTALLED = new Date(2003, 9, 25, 9, 41).getTime()

export function useUptime() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const s = Math.floor((now - INSTALLED) / 1000)
  const days = Math.floor(s / 86400)
  const years = Math.floor(days / 365.25)
  const rest = Math.floor(days - years * 365.25)
  const hh = String(Math.floor((s % 86400) / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${years} years, ${rest} days, ${hh}:${mm}:${ss} (never rebooted, never will)`
}

export function SysInfo() {
  const os = useOS()
  const uptime = useUptime()
  return (
    <div className="app app-dialog sysinfo">
      <div className="sysinfo-top">
        <Logo size={56} />
        <div>
          <p className="sysinfo-os">
            {site.osName} <span>Desktop Environment</span>
          </p>
          <p>Version {site.version} (Build 2026.10)</p>
        </div>
      </div>
      <hr className="etched" />
      <dl className="props">
        <dt>Computer name</dt>
        <dd>{site.computerName}</dd>
        <dt>Registered to</dt>
        <dd>You, the visitor</dd>
        <dt>Processor</dt>
        <dd>1 × curious developer @ 3.76 GHz</dd>
        <dt>Memory</dt>
        <dd>Enough to remember your name (not stored)</dd>
        <dt>Architecture</dt>
        <dd>Web</dd>
        <dt>Uptime</dt>
        <dd>{uptime}</dd>
      </dl>
      <p className="small muted">This product is a portfolio, not an operating system. No real files were harmed.</p>
      <div className="dialog-foot">
        <button type="button" className="btn btn-default" onClick={() => os.close('sysinfo')} autoFocus>
          OK
        </button>
      </div>
    </div>
  )
}
