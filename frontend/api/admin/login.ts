import { checkAdmin, json } from '../_lib/projects.js'

export function POST(request: Request) {
  return checkAdmin(request) ?? json({ ok: true })
}
