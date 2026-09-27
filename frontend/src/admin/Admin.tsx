import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, ImageOff, Loader2, LogOut, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { admin, fetchProjects, imageUrl, type Project, type ProjectInput } from '../lib/api'
import logoIcon from '../assets/guitges-icon.png'

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
    document.title = 'Admin — Guitges'
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
    <div className="min-h-screen bg-ink text-cream">
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
      <form onSubmit={submit} className="w-full max-w-sm rounded-[2rem] border border-cream/10 bg-ink-900 p-8">
        <img src={logoIcon} alt="" className="h-12 w-12" />
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Portfolio admin</h1>
        <p className="mt-1 text-sm text-cream-muted">Manage the sites shown on your portfolio.</p>
        <label className="mt-8 block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Password</span>
          <input
            type="password"
            required
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="field"
          />
        </label>
        {error && <p className="mt-3 text-sm text-tangerine">{error}</p>}
        <button type="submit" disabled={busy} className="pill-lime mt-6 w-full disabled:opacity-60">
          {busy ? <Loader2 size={18} className="animate-spin" /> : 'Log in'}
        </button>
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
          ? { kind: 'error', text: `Saved, but the preview couldn't be captured: ${res.screenshotError}. Try “Refresh preview” later.` }
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
    setForm({ title: p.title, url: p.url, category: p.category, year: p.year, description: p.description, tags: p.tags.join(', ') })
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
      setProjects(await admin.reorder(pw, next.map((p) => p.id)))
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
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="" className="h-10 w-10" />
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Portfolio admin</h1>
            <p className="text-sm text-cream-muted">Sites shown in “Sites I’ve built”.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="/" className="pill-ghost !px-4 !py-2 text-sm">
            <ExternalLink size={16} /> View site
          </a>
          <button onClick={onLogout} className="pill-ghost !px-4 !py-2 text-sm">
            <LogOut size={16} /> Log out
          </button>
        </div>
      </header>

      {notice && (
        <p
          className={`mt-8 rounded-2xl px-5 py-4 text-sm ${
            notice.kind === 'ok' ? 'bg-lime/15 text-lime' : 'bg-tangerine/15 text-tangerine'
          }`}
        >
          {notice.text}
        </p>
      )}

      <form onSubmit={submit} className="mt-8 grid gap-5 rounded-[2rem] border border-cream/10 bg-ink-900 p-6 sm:grid-cols-2 sm:p-8">
        <h2 className="font-display text-xl font-bold sm:col-span-2">{editingId ? 'Edit site' : 'Add a site'}</h2>
        <label className="block sm:col-span-2">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Link to the live site</span>
          <input required type="url" placeholder="https://yourclient.com" className="field" {...field('url')} />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Title</span>
          <input required maxLength={80} placeholder="Kedai Kopi Aisyah" className="field" {...field('title')} />
        </label>
        <div className="grid grid-cols-[1fr_6rem] gap-3">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Type</span>
            <select className="field" {...field('category')}>
              {categories.map((c) => (
                <option key={c} className="bg-ink-900">
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Year</span>
            <input maxLength={4} inputMode="numeric" className="field" {...field('year')} />
          </label>
        </div>
        <label className="block sm:col-span-2">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Short description</span>
          <textarea
            rows={2}
            maxLength={240}
            placeholder="What the site does for the client, in one sentence."
            className="field resize-none"
            {...field('description')}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Tags (comma separated)</span>
          <input placeholder="1 page, WhatsApp button, SEO" className="field" {...field('tags')} />
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="pill-lime disabled:opacity-60">
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving & capturing preview…
              </>
            ) : editingId ? (
              'Save changes'
            ) : (
              'Add site'
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(blank)
              }}
              className="pill-ghost"
            >
              Cancel
            </button>
          )}
          <p className="text-xs text-cream-dim">
            A screenshot of the site’s first screen is taken automatically — this can take up to 30 seconds.
          </p>
        </div>
      </form>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Your sites ({projects.length})</h2>
        {projects.length === 0 && <p className="mt-4 text-cream-muted">No sites yet — add your first one above.</p>}
        <ul className="mt-4 space-y-3">
          {projects.map((p, i) => {
            const src = imageUrl(p)
            const busy = busyId === p.id
            return (
              <li key={p.id} className="flex flex-col gap-4 rounded-3xl border border-cream/10 bg-ink-900 p-4 sm:flex-row sm:items-center">
                <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-ink-800 sm:w-44">
                  {src ? (
                    <img src={src} alt="" className="h-full w-full object-cover object-top" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-cream-dim">
                      <ImageOff size={22} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold">{p.title}</p>
                  <a href={p.url} target="_blank" rel="noreferrer" className="block truncate text-sm text-cream-muted hover:text-lime">
                    {p.url}
                  </a>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cream-dim">
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
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 transition-colors disabled:opacity-30 ${
        danger ? 'hover:border-tangerine hover:bg-tangerine hover:text-ink' : 'hover:border-cream hover:bg-cream hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
