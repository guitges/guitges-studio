import crypto from 'node:crypto'
import { body, captureScreenshot, checkAdmin, clean, json, readProjects, saveProject, toPublic } from '../../_lib/projects.js'

// Add a site (shown first)
export async function POST(request: Request) {
  const denied = checkAdmin(request)
  if (denied) return denied

  const { value, error } = clean(await body(request))
  if (error) return json({ error }, 400)

  const existing = await readProjects()
  const order = existing.length ? Math.min(...existing.map((p) => p.order)) - 1 : 0
  const project = { id: crypto.randomUUID(), ...value, createdAt: Date.now(), order }
  let screenshotError: string | null = null
  try {
    await captureScreenshot(project)
  } catch (err) {
    screenshotError = (err as Error).message
  }
  await saveProject(project)
  return json({ project: toPublic(project), screenshotError }, 201)
}
