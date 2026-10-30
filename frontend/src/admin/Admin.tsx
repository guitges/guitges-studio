import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, ImageOff, Loader2, LogOut, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { admin, fetchProjects, imageUrl, type Project, type ProjectInput } from '../lib/api'
import './admin.css'

const PW_KEY = 'guitges-admin-pw'
const categories = ['Landing page', 'Informational website', 'Company profile', 'Other']
const blank: ProjectInput = {
  title: '',
  url: '',
  category: categories[0],
  year: String(new Date().getFullYear()),
  description: '',
  tags: '',
}

function readPw() {
  try {
    return sessionStorage.getItem(PW_KEY) || ''
  } catch {
    return ''
  }
}

function writePw(pw: string) {
  try {
    if (pw) sessionStorage.setItem(PW_KEY, pw)
    else sessionStorage.removeItem(PW_KEY)
  } catch {
    // Private mode etc. — you'll just need to log in again next time
  }
}

export default function Admin() {
  const [pw, setPw] = useState(readPw)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    document.title = 'the back office · somewhere, not here.'
    if (!pw) return
    admin
      .login(pw)
      .then(() => setAuthed(true))
      .catch(() => {
        writePw('')
        setPw('')
      })
    // Only verify a remembered password once on load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function logout() {
    writePw('')
    setPw('')
    setAuthed(false)
  }

  return (
    <div
      className="relative min-h-screen font-sans text-ink"
      style={{ background: 'linear-gradient(180deg, #B3BDD1 0%, #C4CADB 45%, #D7D2EA 100%)' }}
    >
      <div className="grain" aria-hidden="true" />
      {authed ? (
        <Dashboard pw={pw} onLogout={logout} />
      ) : (
        <Login
          onSuccess={(value) => {
            writePw(value)
            setPw(value)
            setAuthed(true)
          }}
        />
      )}
    </div>
  )
}

function Login({ onSuccess }: { onSuccess: (pw: string) => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await admin.login(value)
      onSuccess(value)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-sm p-8 shadow-window">
        <p className="sys">staff only · room 000</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-ink">The back office.</h1>
        <p className="mt-3 font-sans text-[0.72rem] tracking-[0.06em] text-ink-soft">
          the guest ledger is kept here. you’ll need the key.
        </p>
        <label className="mt-8 block">
          <span className="sys mb-2 block">key</span>
          <input
            type="password"
            required
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="field-dream"
          />
        </label>
        {error && <p className="mt-3 font-sans text-xs text-[#8A3F3A]">// {error.toLowerCase()}</p>}
        <button type="submit" disabled={busy} className="link-sys mt-6 w-full justify-center disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" /> : '[ unlock ]'}
        </button>
        <a
          href="/"
          className="mt-6 block text-center font-sans text-[0.66rem] uppercase tracking-[0.14em] text-ink-faint hover:text-ink"
        >
          ← back to the water
        </a>
      </form>
    </div>
  )
}

function Dashboard({ pw, onLogout }: { pw: string; onLogout: () => void }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState<ProjectInput>(blank)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const load = useCallback(() => {
    fetchProjects(true)
      .then(setProjects)
      .catch((err) => setNotice({ kind: 'error', text: `Couldn't load projects: ${err.message}` }))
  }, [])

  useEffect(load, [load])

  function reportError(err: unknown) {
    const text = (err as Error).message
    if (text === 'Wrong password') onLogout()
    setNotice({ kind: 'error', text })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setNotice(null)
    try {
      const res = editingId ? await admin.update(pw, editingId, form) : await admin.create(pw, form)
      setNotice(
        res.screenshotError
          ? {
              kind: 'error',
              text: `Saved, but the preview couldn't be captured: ${res.screenshotError}. Try “Refresh preview” later.`,
            }
          : { kind: 'ok', text: editingId ? 'Changes saved.' : 'Site added to your portfolio.' },
      )
      setForm(blank)
      setEditingId(null)
      load()
    } catch (err) {
      reportError(err)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(p: Project) {
    setEditingId(p.id)
    setForm({
      title: p.title,
      url: p.url,
      category: p.category,
      year: p.year,
      description: p.description,
      tags: p.tags.join(', '),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function refresh(p: Project) {
    setBusyId(p.id)
    setNotice(null)
    try {
      await admin.refreshScreenshot(pw, p.id)
      setNotice({ kind: 'ok', text: `Preview for “${p.title}” updated.` })
      load()
    } catch (err) {
      reportError(err)
    } finally {
      setBusyId(null)
    }
  }

  async function remove(p: Project) {
    if (!window.confirm(`Remove “${p.title}” from your portfolio?`)) return
    setBusyId(p.id)
    try {
      await admin.remove(pw, p.id)
      setNotice({ kind: 'ok', text: `“${p.title}” removed.` })
      if (editingId === p.id) {
        setEditingId(null)
        setForm(blank)
      }
      load()
    } catch (err) {
      reportError(err)
    } finally {
      setBusyId(null)
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...projects]
    const [item] = next.splice(index, 1)
    next.splice(index + dir, 0, item)
    setProjects(next)
    try {
      setProjects(
        await admin.reorder(
          pw,
          next.map((p) => p.id),
        ),
      )
    } catch (err) {
      reportError(err)
      load()
    }
  }

  const field = (key: keyof ProjectInput) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value }),
  })

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="sys">room 000 · the back office · 03:17 am</p>
          <h1 className="mt-3 font-serif text-5xl leading-none text-ink sm:text-6xl">The guest ledger.</h1>
          <p className="mt-3 font-sans text-[0.72rem] tracking-[0.06em] text-ink-soft">
            every site that has stayed here. sign them in, tidy them up, let them check out.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/" className="link-sys">
            <ExternalLink size={14} /> the site
          </a>
          <button onClick={onLogout} className="link-sys">
            <LogOut size={14} /> lock up
          </button>
        </div>
      </header>

      {notice && (
        <p
          role="status"
          className={`mt-8 rounded-sm border px-4 py-3 font-sans text-xs ${
            notice.kind === 'ok'
              ? 'border-[#4F8F78]/30 bg-[#E3F0EA]/80 text-[#2E5F4E]'
              : 'border-[#A0524C]/30 bg-[#F4E4E2]/80 text-[#7A3A35]'
          }`}
        >
          // {notice.text}
        </p>
      )}

      <form onSubmit={submit} className="glass mt-8 grid gap-5 rounded-sm p-6 shadow-window sm:grid-cols-2 sm:p-8">
        <h2 className="font-serif text-3xl text-ink sm:col-span-2">
          {editingId ? 'Amend an entry.' : 'Sign a new guest in.'}
        </h2>
        <label className="block sm:col-span-2">
          <span className="sys mb-2 block">Link to the live site</span>
          <input required type="url" placeholder="https://yourclient.com" className="field-dream" {...field('url')} />
        </label>
        <label className="block">
          <span className="sys mb-2 block">Title</span>
          <input required maxLength={80} placeholder="Kedai Kopi Aisyah" className="field-dream" {...field('title')} />
        </label>
        <div className="grid grid-cols-[1fr_6rem] gap-3">
          <label className="block">
            <span className="sys mb-2 block">Type</span>
            <select className="field-dream" {...field('category')}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sys mb-2 block">Year</span>
            <input maxLength={4} inputMode="numeric" className="field-dream" {...field('year')} />
          </label>
        </div>
        <label className="block sm:col-span-2">
          <span className="sys mb-2 block">Short description</span>
          <textarea
            rows={2}
            maxLength={240}
            placeholder="What the site does for the client, in one sentence."
            className="field-dream resize-none"
            {...field('description')}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="sys mb-2 block">Tags (comma separated)</span>
          <input placeholder="1 page, WhatsApp button, SEO" className="field-dream" {...field('tags')} />
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="link-sys disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> saving & taking a photograph…
              </>
            ) : editingId ? (
              '[ save changes ]'
            ) : (
              '[ sign in ]'
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(blank)
              }}
              className="link-sys"
            >
              cancel
            </button>
          )}
          <p className="font-sans text-[0.68rem] text-ink-faint">
            a photograph of the site’s first screen is taken automatically. it can take up to 30 seconds.
          </p>
        </div>
      </form>

      <section className="mt-10">
        <h2 className="sys">guests currently staying · {String(projects.length).padStart(2, '0')}</h2>
        {projects.length === 0 && (
          <p className="mt-4 font-sans text-xs text-ink-soft">the ledger is empty. there is no one else here.</p>
        )}
        <ul className="mt-4 space-y-3">
          {projects.map((p, i) => {
            const src = imageUrl(p)
            const busy = busyId === p.id
            return (
              <li
                key={p.id}
                className="overflow-hidden rounded-md border border-white/70 bg-mist/80 shadow-window backdrop-blur-md"
              >
                <div className="flex items-center justify-between border-b border-ink/10 bg-white/50 px-3 py-1.5">
                  <span className="font-sans text-[0.66rem] tracking-[0.06em] text-ink-soft">
                    guest_{String(i + 1).padStart(2, '0')} — {p.title.toLowerCase().replace(/\s+/g, '_')}
                  </span>
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((k) => (
                      <span key={k} className="h-2 w-2 border border-ink/30" />
                    ))}
                  </span>
                </div>
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-sm bg-lavender/40 sm:w-44">
                    {src ? (
                      <img src={src} alt="" className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-ink-faint">
                        <ImageOff size={22} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-2xl leading-tight text-ink">{p.title}</p>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate font-sans text-xs text-ink-soft underline decoration-ink/20 underline-offset-4 hover:text-ink"
                    >
                      {p.url}
                    </a>
                    <p className="sys mt-1.5">
                      {p.category} · {p.year}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                      <ArrowUp size={16} />
                    </IconButton>
                    <IconButton label="Move down" disabled={i === projects.length - 1} onClick={() => move(i, 1)}>
                      <ArrowDown size={16} />
                    </IconButton>
                    <IconButton label="Edit" onClick={() => startEdit(p)}>
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton label="Refresh preview" disabled={busy} onClick={() => refresh(p)}>
                      <RefreshCw size={16} className={busy ? 'animate-spin' : ''} />
                    </IconButton>
                    <IconButton label="Delete" disabled={busy} onClick={() => remove(p)} danger>
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-sm border border-ink/20 bg-white/50 text-ink transition-colors disabled:opacity-30 ${
        danger
          ? 'hover:border-[#A0524C] hover:bg-[#A0524C] hover:text-mist'
          : 'hover:border-ink hover:bg-ink hover:text-mist'
      }`}
    >
      {children}
    </button>
  )
}
