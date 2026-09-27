// In production the API is served by Vercel Functions on the same domain (/api/...)
export const API_BASE = import.meta.env.VITE_API_URL || ''

export interface Project {
  id: string
  title: string
  category: string
  year: string
  description: string
  tags: string[]
  url: string
  /** URL of the first-screen preview — null if capturing failed */
  image: string | null
}

export type ProjectInput = Pick<Project, 'title' | 'category' | 'year' | 'description' | 'url'> & { tags: string }

export function imageUrl(p: Project) {
  if (!p.image) return null
  return /^https?:\/\//.test(p.image) ? p.image : `${API_BASE}${p.image}`
}

async function request<T>(path: string, init: RequestInit = {}, password?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(password ? { Authorization: `Bearer ${password}` } : {}),
      ...init.headers,
    },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`)
  return body as T
}

/** `fresh` skips the short edge cache (used by the admin right after edits) */
export const fetchProjects = (fresh = false) => request<Project[]>(`/api/projects${fresh ? `?t=${Date.now()}` : ''}`)

export const admin = {
  login: (pw: string) => request<{ ok: boolean }>('/api/admin/login', { method: 'POST' }, pw),
  create: (pw: string, data: ProjectInput) =>
    request<{ project: Project; screenshotError: string | null }>(
      '/api/admin/projects',
      { method: 'POST', body: JSON.stringify(data) },
      pw,
    ),
  update: (pw: string, id: string, data: ProjectInput) =>
    request<{ project: Project; screenshotError: string | null }>(
      `/api/admin/projects/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      pw,
    ),
  refreshScreenshot: (pw: string, id: string) =>
    request<{ project: Project }>(`/api/admin/projects/${id}/screenshot`, { method: 'POST' }, pw),
  reorder: (pw: string, ids: string[]) =>
    request<Project[]>('/api/admin/projects/reorder', { method: 'POST', body: JSON.stringify({ ids }) }, pw),
  remove: (pw: string, id: string) => request<{ ok: boolean }>(`/api/admin/projects/${id}`, { method: 'DELETE' }, pw),
}
