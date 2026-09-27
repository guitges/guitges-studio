import { json, readProjects, toPublic } from './_lib/projects.js'

// Public list shown on the portfolio. Briefly cached at the edge; the admin adds ?t=… to bypass.
export async function GET() {
  const projects = await readProjects()
  return json(projects.map(toPublic), 200, { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60' })
}
