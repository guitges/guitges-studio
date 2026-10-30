// The hand-written projects plus the sites added through /admin, as one list.
import { useEffect, useState } from 'react'
import { projects as written, type Project } from '../data/projects'
import { fetchProjects, imageUrl, type Project as Listed } from '../lib/api'

const host = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

function fromListed(p: Listed): Project {
  const img = imageUrl(p)
  return {
    id: `site-${p.id}`,
    name: p.title.trim(),
    file: `${p.title.trim()}.url`,
    type: 'Client site',
    status: 'Live',
    year: p.year || undefined,
    summary: p.description,
    details: [],
    stack: [],
    tags: p.tags,
    role: p.category || 'Website',
    image: img ? { src: img, alt: `The first screen of ${p.title}` } : undefined,
    art: img ? undefined : 'desktop',
    link: { href: p.url, label: host(p.url) },
    source: { note: 'Source not listed.' },
    listed: true,
  }
}

// One request per visit, shared by every window that asks
let cache: Promise<Project[]> | null = null

function load() {
  cache ??= fetchProjects()
    .then((list) => {
      if (!Array.isArray(list)) return []
      // A site that's already written up in data/projects.ts keeps its fuller entry
      const known = new Set(written.flatMap((p) => (p.link ? [host(p.link.href)] : [])))
      return list.filter((p) => !known.has(host(p.url))).map(fromListed)
    })
    .catch(() => [])
  return cache
}

export function useProjects() {
  const [extra, setExtra] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    load().then((list) => {
      if (!alive) return
      setExtra(list)
      setLoading(false)
    })
    return () => {
      alive = false
    }
  }, [])
  return { projects: [...written, ...extra], loading }
}
