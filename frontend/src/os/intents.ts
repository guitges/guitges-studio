// Tiny message passing between apps: "open Skills on the Cloud tab", "show this job".
// An intent sent before the target window mounts is kept until it does.
import { useEffect, useRef } from 'react'
import type { AppId } from './registry'

const pending = new Map<AppId, string>()
const EVENT = 'os:intent'

export function sendIntent(app: AppId, value: string) {
  pending.set(app, value)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { app } }))
}

export function useIntent(app: AppId, onValue: (value: string) => void) {
  const cb = useRef(onValue)
  cb.current = onValue
  useEffect(() => {
    const take = () => {
      const v = pending.get(app)
      if (v === undefined) return
      pending.delete(app)
      cb.current(v)
    }
    take()
    const on = (e: Event) => {
      if ((e as CustomEvent<{ app: AppId }>).detail.app === app) take()
    }
    window.addEventListener(EVENT, on)
    return () => window.removeEventListener(EVENT, on)
  }, [app])
}
