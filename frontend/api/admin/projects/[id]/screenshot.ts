import { captureScreenshot, checkAdmin, json, projectId, readProjects, saveProject, toPublic } from '../../../_lib/projects.js'

// Refresh a site's preview
export async function POST(request: Request) {
  const denied = checkAdmin(request)
  if (denied) return denied

  const project = (await readProjects()).find((p) => p.id === projectId(request))
  if (!project) return json({ error: 'Project not found' }, 404)
  try {
    await captureScreenshot(project)
  } catch (err) {
    return json({ error: `Couldn't capture a preview: ${(err as Error).message}` }, 502)
  }
  await saveProject(project)
  return json({ project: toPublic(project) })
}
