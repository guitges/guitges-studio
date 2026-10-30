import { useEffect, useRef, useState } from 'react'
import { notes } from '../../data/site'
import { useOS, useWin } from '../store'
import { MenuBar, MessageBox, StatusBar, type MessageSpec } from '../ui'

// Text handed to a note before its window opens (e.g. education.txt from My Computer)
const seeded = new Map<string, string>()

export function openNote(os: ReturnType<typeof useOS>, name: string, text: string) {
  seeded.set(name, text)
  os.launch('notepad', name, { title: `${name} - Notepad` })
}

function initial(name?: string) {
  if (!name) return ''
  return seeded.get(name) ?? notes.find((n) => n.name === name)?.text ?? ''
}

export function Notepad() {
  const os = useOS()
  const win = useWin()
  const [name, setName] = useState(win.arg ?? '')
  const [saved, setSaved] = useState(() => initial(win.arg))
  const [text, setText] = useState(saved)
  const [wrap, setWrap] = useState(true)
  const [msg, setMsg] = useState<MessageSpec | null>(null)
  const area = useRef<HTMLTextAreaElement>(null)
  const dirty = text !== saved
  const label = name || 'Untitled'

  useEffect(() => {
    os.setTitle(win.id, `${dirty ? '*' : ''}${label} - Notepad`)
  }, [dirty, label, os, win.id])

  useEffect(() => {
    area.current?.focus()
  }, [])

  const download = () => {
    const file = name ? (name.endsWith('.txt') ? name : `${name}.txt`) : 'untitled.txt'
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = file
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setSaved(text)
    if (!name) setName(file)
  }

  /** Ask before throwing away changes; `then` runs once it's safe */
  const confirmDiscard = (then: () => void) => {
    if (!dirty) return then()
    setMsg({
      title: 'Notepad',
      icon: 'warning',
      text: `Do you want to save changes to ${label}?`,
      buttons: [
        {
          label: 'Save',
          primary: true,
          onClick: () => {
            download()
            setMsg(null)
            then()
          },
        },
        {
          label: "Don't Save",
          onClick: () => {
            setMsg(null)
            then()
          },
        },
        { label: 'Cancel', onClick: () => setMsg(null) },
      ],
      onCancel: () => setMsg(null),
    })
  }

  // Closing the window from its title bar asks first too
  const guard = useRef<() => boolean>(() => true)
  guard.current = () => {
    if (!dirty) return true
    confirmDiscard(() => os.close(win.id, true))
    return false
  }
  useEffect(() => {
    os.setCloseGuard(win.id, () => guard.current())
    return () => os.setCloseGuard(win.id, null)
  }, [os, win.id])

  const load = (n: string, t: string) =>
    confirmDiscard(() => {
      setName(n)
      setSaved(t)
      setText(t)
      area.current?.focus()
    })

  const insertDate = () => {
    const el = area.current
    const stamp = new Date().toLocaleString()
    if (!el) return setText((t) => t + stamp)
    const { selectionStart: a, selectionEnd: b } = el
    setText(text.slice(0, a) + stamp + text.slice(b))
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = a + stamp.length
    })
  }

  const lines = text.split('\n').length

  return (
    <div className="app notepad">
      <MenuBar
        menus={[
          {
            label: 'File',
            items: [
              { label: 'New', hint: 'Ctrl+Alt+N', onClick: () => load('', '') },
              { separator: true },
              ...notes.map((n) => ({ label: `Open ${n.name}`, onClick: () => load(n.name, n.text) })),
              { separator: true },
              { label: 'Save (download .txt)', hint: 'Ctrl+S', onClick: download },
              { separator: true },
              { label: 'Exit', onClick: () => os.close(win.id) },
            ],
          },
          {
            label: 'Edit',
            items: [
              { label: 'Select All', hint: 'Ctrl+A', onClick: () => area.current?.select() },
              { label: 'Time/Date', hint: 'F5', onClick: insertDate },
            ],
          },
          {
            label: 'Format',
            items: [{ label: 'Word Wrap', checked: wrap, onClick: () => setWrap(!wrap) }],
          },
          {
            label: 'Help',
            items: [
              {
                label: 'About Notepad',
                onClick: () =>
                  setMsg({
                    title: 'About Notepad',
                    icon: 'notepad',
                    text: 'Notepad for Baihaqi.exe. Everything you type stays on your computer. Save downloads a .txt file.',
                    buttons: [{ label: 'OK', primary: true, onClick: () => setMsg(null) }],
                    onCancel: () => setMsg(null),
                  }),
              },
            ],
          },
        ]}
      />
      <textarea
        ref={area}
        className={`notepad-area ${wrap ? '' : 'nowrap'}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        aria-label={`${label} contents`}
        onKeyDown={(e) => {
          if (e.key === 'F5') {
            e.preventDefault()
            insertDate()
          } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            e.preventDefault()
            download()
          } else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
            e.preventDefault()
            load('', '')
          }
        }}
      />
      <StatusBar>
        <span>{dirty ? 'Unsaved changes' : 'Saved'}</span>
        <span className="status-right">
          {text.length} characters · {lines} line{lines === 1 ? '' : 's'}
        </span>
      </StatusBar>
      {msg && <MessageBox spec={msg} />}
    </div>
  )
}
