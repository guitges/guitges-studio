import {
  body,
  captureScreenshot,
  checkAdmin,
  clean,
  deleteProject,
  json,
  projectId,
  readProjects,
  saveProject,
  toPublic,
} from '../../_lib/projects.js'

// Edit a site (re-captures the preview when the link changes)
export async function PUT(request: Request) {
  const denied = checkAdmin(request)
  if (denied) return denied

  const { value, error } = clean(await body(request))
  if (error) return json({ error }, 400)

  const project = (await readProjects()).find((p) => p.id === projectId(request))
  if (!project) return json({ error: 'Project not found' }, 404)

  const urlChanged = project.url !== value.url
  Object.assign(project, value)
  let screenshotError: string | null = null
  if (urlChanged || !project.screenshotUrl) {
    try {
      await captureScreenshot(project)
    } catch (err) {
      screenshotError = (err as Error).message
    }
  }
  await saveProject(project)
  return json({ project: toPublic(project), screenshotError })
}

// Remove a site
export async function DELETE(request: Request) {
  const denied = checkAdmin(request)
  if (denied) return denied

  const project = (await readProjects()).find((p) => p.id === projectId(request))
  if (!project) return json({ error: 'Project not found' }, 404)
  await deleteProject(project)
  return json({ ok: true })
}
