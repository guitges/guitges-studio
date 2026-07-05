const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export interface ConceptRequest {
  business: string
  description: string
  type: string
}

export interface ConceptResponse {
  tagline: string
  pages: string[]
  sections: string[]
  colorMood: string
  colorHex: string[]
  nextStep: string
  source: 'ai' | 'template'
}

export async function generateConcept(payload: ConceptRequest): Promise<ConceptResponse> {
  const res = await fetch(`${API_BASE}/api/ai-concept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to generate concept')
  return res.json()
}

export interface ContactPayload {
  name: string
  email: string
  business?: string
  package?: string
  message: string
}

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}
