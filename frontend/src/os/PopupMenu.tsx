import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Icon, type IconName } from './icons'

export type PItem =
  | { label: string; icon?: IconName; onClick?: () => void; sub?: PItem[]; checked?: boolean; bold?: boolean }
  | { separator: true }

/** A classic floating menu with nested submenus. Arrow keys move, Right/Enter opens, Left/Escape closes. */
export function PopupMenu({
  items,
  x,
  y,
  onClose,
  onBack,
  label,
  className = '',
  flipX,
}: {
  items: PItem[]
  x: number
  y: number
  /** Close the whole menu tree */
  onClose: () => void
  /** Close just this submenu (Left arrow) */
  onBack?: () => void
  label: string
  className?: string
  /** Where this menu's right edge goes if it doesn't fit to the right (a submenu's parent's left edge) */
  flipX?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x, y })
  const [sub, setSub] = useState<{ i: number; x: number; y: number; left: number } | null>(null)
  const hoverTimer = useRef(0)

  // Keep the menu on screen
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = x + r.width > window.innerWidth - 4 ? (flipX ?? x) - r.width : x
    const ny = y + r.height > window.innerHeight - 4 ? Math.max(4, window.innerHeight - r.height - 4) : y
    setPos({ x: Math.max(4, nx), y: ny })
  }, [x, y, flipX])

  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('.menu-item')?.focus()
  }, [])

  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  const openSub = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    setSub({ i, x: r.right - 3, y: r.top - 3, left: r.left + 3 })
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // Only handle keys for this level, not ones bubbling up from a nested submenu
    if ((e.target as HTMLElement).closest('.menu') !== ref.current) return
    const els = [...ref.current!.querySelectorAll<HTMLButtonElement>(':scope > .menu-item')]
    const i = els.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const d = e.key === 'ArrowDown' ? 1 : -1
      els[(i + d + els.length) % els.length]?.focus()
    } else if (e.key === 'ArrowRight') {
      const el = els[i]
      const idx = Number(el?.dataset.index)
      const it = items[idx]
      if (el && it && !('separator' in it) && it.sub) {
        e.preventDefault()
        openSub(idx, el)
      }
    } else if (e.key === 'ArrowLeft' && onBack) {
      e.preventDefault()
      onBack()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (onBack) onBack()
      else onClose()
    } else if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  return (
    <div
      ref={ref}
      className={`menu popup ${className}`}
      role="menu"
      aria-label={label}
      style={{ left: pos.x, top: pos.y }}
      onKeyDown={onKey}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((it, i) =>
        'separator' in it ? (
          <div key={i} className="menu-sep" role="separator" />
        ) : (
          <button
            key={it.label}
            type="button"
            role={it.checked === undefined ? 'menuitem' : 'menuitemradio'}
            aria-checked={it.checked}
            aria-haspopup={it.sub ? 'menu' : undefined}
            aria-expanded={it.sub ? sub?.i === i : undefined}
            data-index={i}
            className={`menu-item ${sub?.i === i ? 'open' : ''} ${it.bold ? 'bold' : ''}`}
            onPointerEnter={(e) => {
              window.clearTimeout(hoverTimer.current)
              const el = e.currentTarget
              if (it.sub) hoverTimer.current = window.setTimeout(() => openSub(i, el), 120)
              else hoverTimer.current = window.setTimeout(() => setSub(null), 200)
            }}
            onClick={(e) => {
              if (it.sub) openSub(i, e.currentTarget)
              else {
                onClose()
                it.onClick?.()
              }
            }}
          >
            <span className="menu-check">{it.checked ? '•' : it.icon ? <Icon name={it.icon} size={16} /> : ''}</span>
            <span className="menu-label">{it.label}</span>
            {it.sub && <span className="menu-arrow" aria-hidden="true">▸</span>}
          </button>
        ),
      )}
      {sub && (() => {
        const it = items[sub.i]
        if ('separator' in it || !it.sub) return null
        return (
          <PopupMenu
            key={sub.i}
            items={it.sub}
            x={sub.x}
            y={sub.y}
            flipX={sub.left}
            label={it.label}
            onClose={onClose}
            onBack={() => {
              setSub(null)
              ref.current?.querySelector<HTMLButtonElement>(`[data-index="${sub.i}"]`)?.focus()
            }}
          />
        )
      })()}
    </div>
  )
}
