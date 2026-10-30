import { useState } from 'react'
import { recycled } from '../../data/site'
import { Icon, type IconName } from '../icons'
import { play } from '../sound'
import { useOS } from '../store'
import { MessageBox, StatusBar, type MessageSpec } from '../ui'

const KIND_ICON: Record<(typeof recycled)[number]['kind'], IconName> = { zip: 'zip', txt: 'txt', img: 'img', exe: 'exe', folder: 'folder' }

// Emptied for the rest of the visit; a reload puts the bad ideas back
let emptied = false
export const binEmpty = () => emptied
const binChanged = () => window.dispatchEvent(new Event('os:bin'))

export function RecycleBin() {
  const os = useOS()
  const [items, setItems] = useState(() => (emptied ? [] : recycled))
  const [selected, setSelected] = useState<string | null>(null)
  const [msg, setMsg] = useState<MessageSpec | null>(null)
  const sel = items.find((i) => i.name === selected)

  const open = (name: string) => {
    const it = items.find((i) => i.name === name)
    if (!it) return
    if (it.secret) {
      play('error')
      setMsg({
        title: 'do_not_open.exe',
        icon: 'warning',
        text: 'You were told not to open this. Are you absolutely sure?',
        buttons: [
          {
            label: 'Yes, obviously',
            primary: true,
            onClick: () => {
              setMsg(null)
              os.launch('bubbles')
            },
          },
          { label: 'No', onClick: () => setMsg(null) },
        ],
        onCancel: () => setMsg(null),
      })
      return
    }
    play('ding')
    setMsg({ title: it.name, icon: KIND_ICON[it.kind], text: it.joke, buttons: [{ label: 'OK', primary: true, onClick: () => setMsg(null) }], onCancel: () => setMsg(null) })
  }

  const empty = () =>
    setMsg({
      title: 'Confirm Multiple File Delete',
      icon: 'warning',
      text: `Are you sure you want to permanently delete these ${items.length} items? Some of them were very nearly good ideas.`,
      buttons: [
        {
          label: 'Yes',
          primary: true,
          onClick: () => {
            emptied = true
            setItems([])
            setSelected(null)
            setMsg(null)
            play('empty')
            os.setTitle('recycle', 'Recycle Bin (empty)')
            binChanged()
          },
        },
        { label: 'No', onClick: () => setMsg(null) },
      ],
      onCancel: () => setMsg(null),
    })

  return (
    <div className="app app-explorer">
      <div className="toolbar">
        <button type="button" className="tool" disabled={!items.length} onClick={empty}>
          <Icon name="recycle" size={22} /> <span>Empty Recycle Bin</span>
        </button>
        <button
          type="button"
          className="tool"
          disabled={!!items.length}
          onClick={() => {
            emptied = false
            setItems(recycled)
            os.setTitle('recycle', 'Recycle Bin')
            binChanged()
          }}
        >
          <Icon name="back" size={22} /> <span>Restore all items</span>
        </button>
      </div>
      <div className="filearea view-details rb-area">
        {items.length ? (
          <table className="listview" aria-label="Deleted files">
            <thead>
              <tr>
                <th>Name</th>
                <th>Original location</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr
                  key={it.name}
                  className="lv-row"
                  tabIndex={0}
                  aria-selected={selected === it.name}
                  onClick={() => (os.compact ? open(it.name) : setSelected(it.name))}
                  onDoubleClick={() => open(it.name)}
                  onFocus={() => setSelected(it.name)}
                  onKeyDown={(e) => e.key === 'Enter' && open(it.name)}
                >
                  <td>
                    <span className="lv-name">
                      <Icon name={KIND_ICON[it.kind]} size={16} /> {it.name}
                    </span>
                  </td>
                  <td className="lv-dim">C:\Users\Baihaqi\{it.secret ? 'Very Important' : 'Old Ideas'}</td>
                  <td className="lv-dim nowrap">{it.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-note">The Recycle Bin is empty. It feels lighter already.</p>
        )}
      </div>
      <StatusBar>
        <span>{sel ? `${sel.name} — double-click to open` : `${items.length} objects`}</span>
        <span className="status-right">Fictional files. Any resemblance to real projects is purely relatable.</span>
      </StatusBar>
      {msg && <MessageBox spec={msg} />}
    </div>
  )
}
