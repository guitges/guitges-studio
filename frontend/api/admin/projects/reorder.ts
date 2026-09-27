import { body, checkAdmin, json, readProjects, saveProject, toPublic } from '../../_lib/projects.js'

// Save a new display order
export async function POST(request: Request) {
  const denied = checkAdmin(request)
  if (denied) return denied

  const input = await body(request)
  const ids = Array.isArray(input.ids) ? input.ids.map(String) : []
  const projects = await readProjects()
  const byId = new Map(projects.map((p) => [p.id, p]))
  const reordered = ids.flatMap((id) => byId.get(id) ?? [])
  // Keep anything the client didn't mention at the end
  for (const p of projects) if (!ids.includes(p.id)) reordered.push(p)

  // Only rewrite the projects whose position actually changed
  await Promise.all(
    reordered.map((p, i) => {
      if (p.order === i) return null
      p.order = i
      return saveProject(p)
    }),
  )
  return json(reordered.map(toPublic))
}
