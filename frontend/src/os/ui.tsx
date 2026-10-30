// Small classic controls shared by the apps: tabs, a menu bar, in-window message boxes.
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Icon, type IconName } from './icons'

// ---------- tabs ----------

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  children,
}: {
  tabs: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  label: string
  children: ReactNode
}) {
  const uid = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + tabs.length) % tabs.length
    onChange(tabs[n].id)
    refs.current[n]?.focus()
  }
  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            role="tab"
            type="button"
            id={`${uid}-${t.id}`}
            aria-selected={t.id === value}
            aria-controls={`${uid}-panel`}
            tabIndex={t.id === value ? 0 : -1}
            className="tab"
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${value}`} className="tabpanel">
        {children}
      </div>
    </div>
  )
}

// ---------- menu bar ----------

export type MenuItem =
  | { label: string; onClick: () => void; checked?: boolean; disabled?: boolean; hint?: string }
  | { separator: true }

export function MenuBar({ menus }: { menus: { label: string; items: MenuItem[] }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open === null) return
    const onDown = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setOpen(null)
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => {
    if (open === null) return
    bar.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"] [role="menuitem"]:not(:disabled)`)?.focus()
  }, [open])

  const onMenuKey = (e: KeyboardEvent) => {
    const items = [...(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const d = e.key === 'ArrowDown' ? 1 : -1
      items[(i + d + items.length) % items.length]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      const n = open
      setOpen(null)
      bar.current?.querySelectorAll<HTMLButtonElement>('.menubar-btn')[n ?? 0]?.focus()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setOpen((o) => ((o ?? 0) + (e.key === 'ArrowRight' ? 1 : -1) + menus.length) % menus.length)
    }
  }

  return (
    <div className="menubar" ref={bar} role="menubar">
      {menus.map((m, i) => (
        <div key={m.label} className="menubar-item" data-menu={i}>
          <button
            type="button"
            className="menubar-btn"
            aria-haspopup="menu"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            onPointerEnter={() => open !== null && setOpen(i)}
          >
            {m.label}
          </button>
          {open === i && (
            <div className="menu dropdown" role="menu" aria-label={m.label} onKeyDown={onMenuKey}>
              {m.items.map((it, j) =>
                'separator' in it ? (
                  <div key={j} className="menu-sep" role="separator" />
                ) : (
                  <button
                    key={it.label}
                    type="button"
                    role={it.checked === undefined ? 'menuitem' : 'menuitemcheckbox'}
                    aria-checked={it.checked}
                    className="menu-item"
                    disabled={it.disabled}
                    onClick={() => {
                      setOpen(null)
                      it.onClick()
                    }}
                  >
                    <span className="menu-check">{it.checked ? '✓' : ''}</span>
                    <span className="menu-label">{it.label}</span>
                    {it.hint && <span className="menu-hint">{it.hint}</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ---------- message box (modal inside one window) ----------

export interface MessageSpec {
  title: string
  text: ReactNode
  icon?: IconName
  buttons: { label: string; onClick: () => void; primary?: boolean }[]
  /** Escape / the close button */
  onCancel: () => void
}

export function MessageBox({ spec }: { spec: MessageSpec }) {
  const first = useRef<HTMLButtonElement>(null)
  const uid = useId()
  useEffect(() => {
    first.current?.focus()
  }, [])
  return (
    <div
      className="msg-veil"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          spec.onCancel()
        }
      }}
    >
      <div className="msg win active fixed" role="alertdialog" aria-modal="true" aria-labelledby={`${uid}-t`} aria-describedby={`${uid}-d`}>
        <header className="titlebar">
          <h2 className="titlebar-text" id={`${uid}-t`}>
            {spec.title}
          </h2>
          <div className="controls">
            <button type="button" className="ctl ctl-close" aria-label="Close" onClick={spec.onCancel}>
              <span />
            </button>
          </div>
        </header>
        <div className="msg-body">
          {spec.icon && <Icon name={spec.icon} size={32} />}
          <div id={`${uid}-d`} className="msg-text">
            {spec.text}
          </div>
        </div>
        <div className="msg-buttons">
          {spec.buttons.map((b, i) => (
            <button key={b.label} ref={i === 0 ? first : undefined} type="button" className={`btn ${b.primary ? 'btn-default' : ''}`} onClick={b.onClick}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Open a link in a new tab, safely */
export const ext = { target: '_blank', rel: 'noopener noreferrer' } as const

export function StatusBar({ children }: { children: ReactNode }) {
  return <div className="statusbar">{children}</div>
}
