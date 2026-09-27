// Shared storage + auth for the portfolio projects API (Vercel Functions + Vercel Blob).
// Files under api/_lib are not routes.
import crypto from 'node:crypto'
import { del, list, put } from '@vercel/blob'

export interface StoredProject {
  id: string
  title: string
  url: string
  category: string
  year: string
  description: string
  tags: string[]
  createdAt: number
  /** Display position; lower comes first */
  order: number
  /** Public Vercel Blob URL of the first-screen preview */
  screenshotUrl?: string
}

// ---------- storage ----------
// Each project is its own JSON blob, written under a fresh random name on every save
// (portfolio/projects/<id>/data-<random>.json). Overwriting one shared file is only
// eventually consistent, which made edits silently disappear; unique names never go stale.

const PREFIX = 'portfolio/projects/'

async function listBlobs(prefix: string) {
  const blobs = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix, cursor, limit: 1000 })
    blobs.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return blobs
}

export async function readProjects(): Promise<StoredProject[]> {
  // Newest version per project wins (an older one can linger briefly mid-save)
  const latest = new Map<string, { url: string; uploadedAt: Date }>()
  for (const b of await listBlobs(PREFIX)) {
    const id = b.pathname.slice(PREFIX.length).split('/')[0]
    const current = latest.get(id)
    if (!current || b.uploadedAt > current.uploadedAt) latest.set(id, b)
  }
  const projects = await Promise.all(
    [...latest.values()].map(async (b) => {
      const res = await fetch(b.url)
      return res.ok ? ((await res.json()) as StoredProject) : null
    }),
  )
  return projects
    .filter((p): p is StoredProject => !!p)
    .sort((a, b) => a.order - b.order || b.createdAt - a.createdAt)
}

export async function saveProject(project: StoredProject) {
  const saved = await put(`${PREFIX}${project.id}/data.json`, JSON.stringify(project), {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'application/json',
  })
  // Remove the previous versions of this project
  const old = (await listBlobs(`${PREFIX}${project.id}/`)).filter((b) => b.url !== saved.url)
  if (old.length) await del(old.map((b) => b.url))
}

export async function deleteProject(project: StoredProject) {
  const blobs = await listBlobs(`${PREFIX}${project.id}/`)
  const urls = blobs.map((b) => b.url)
  if (project.screenshotUrl) urls.push(project.screenshotUrl)
  if (urls.length) await del(urls)
}

export function toPublic(p: StoredProject) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    year: p.year,
    description: p.description,
    tags: p.tags,
    url: p.url,
    image: p.screenshotUrl ?? null,
  }
}

// ---------- screenshots ----------

/** Captures the first screen (1440×900) of a site via Microlink's free API and stores it in Blob. */
export async function captureScreenshot(project: StoredProject) {
  const api = new URL('https://api.microlink.io/')
  api.searchParams.set('url', project.url)
  api.searchParams.set('screenshot', 'true')
  api.searchParams.set('meta', 'false')
  api.searchParams.set('viewport.width', '1440')
  api.searchParams.set('viewport.height', '900')
  api.searchParams.set('viewport.deviceScaleFactor', '1')
  api.searchParams.set('waitForTimeout', '1500')

  const res = await fetch(api, { signal: AbortSignal.timeout(45_000) })
  const body = await res.json().catch(() => null)
  const shotUrl: string | undefined = body?.data?.screenshot?.url
  if (!res.ok || !shotUrl) throw new Error(body?.message || `Screenshot service returned ${res.status}`)
  // Only download images from Microlink's own CDN
  if (!new URL(shotUrl).hostname.endsWith('microlink.io')) throw new Error('Unexpected screenshot host')

  const img = await fetch(shotUrl, { signal: AbortSignal.timeout(30_000) })
  if (!img.ok) throw new Error(`Could not download screenshot (${img.status})`)
  const ext = String(body.data.screenshot.type || 'png').replace(/[^a-z]/g, '') || 'png'

  const blob = await put(`portfolio/screenshots/${project.id}.${ext}`, await img.arrayBuffer(), {
    access: 'public',
    addRandomSuffix: true, // new URL each time, so browsers never show a stale preview
    contentType: `image/${ext}`,
  })
  if (project.screenshotUrl) await del(project.screenshotUrl).catch(() => {})
  project.screenshotUrl = blob.url
}

// ---------- validation ----------

type Input = Record<string, unknown>

export function clean(input: Input) {
  const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)
  let parsed: URL
  try {
    parsed = new URL(str(input.url, 500))
  } catch {
    return { error: 'Please enter a full link, e.g. https://example.com' } as const
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) return { error: 'Link must start with http:// or https://' } as const

  const title = str(input.title, 80)
  if (!title) return { error: 'Title is required' } as const

  const rawTags = Array.isArray(input.tags) ? input.tags : String(input.tags ?? '').split(',')
  const tags = rawTags
    .map((t) => str(t, 30))
    .filter(Boolean)
    .slice(0, 6)

  return {
    value: {
      title,
      url: parsed.toString(),
      category: str(input.category, 40) || 'Landing page',
      year: str(input.year, 4) || String(new Date().getFullYear()),
      description: str(input.description, 240),
      tags,
    },
  } as const
}

// ---------- http helpers ----------

const hash = (value: string) => crypto.createHash('sha256').update(value).digest()

/** Returns an error Response when the request isn't from the admin, otherwise null. */
export function checkAdmin(request: Request): Response | null {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return json({ error: 'Admin is disabled. Set ADMIN_PASSWORD in the Vercel project settings.' }, 503)
  const given = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!given || !crypto.timingSafeEqual(hash(given), hash(password))) return json({ error: 'Wrong password' }, 401)
  return null
}

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

export async function body(request: Request): Promise<Input> {
  return (await request.json().catch(() => ({}))) as Input
}

/** Pulls the project id out of /api/admin/projects/<id>[/...] */
export function projectId(request: Request) {
  return new URL(request.url).pathname.split('/')[4] ?? ''
}
