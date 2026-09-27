import { Router } from 'express'
import { generateFallbackConcept } from '../lib/fallbackGenerator.js'

const router = Router()

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

const SYSTEM_PROMPT = `You are a website strategist at a web design studio called Guitges.
Given a business name, a short description, and a site type, respond with ONLY a JSON object
(no markdown, no commentary) with this exact shape:
{
  "tagline": string (a catchy one-sentence tagline for their future website, under 15 words),
  "pages": string[] (4-6 short page names for the website, e.g. "Home", "About"),
  "sections": string[] (4-6 short homepage section ideas, e.g. "Hero with strong headline"),
  "colorMood": string (2-3 word description of a fitting color mood, e.g. "Warm & Inviting"),
  "colorHex": string[] (exactly 3 hex color codes that match the colorMood),
  "nextStep": string (one encouraging sentence inviting them to turn this into a real site with Guitges)
}`

async function callGroq({ business, description, type }) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Business name: ${business}\nSite type: ${type}\nDescription: ${description}`,
          },
        ],
      }),
      signal: controller.signal,
    })

    if (!res.ok) return null
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    const parsed = JSON.parse(content)
    if (!parsed.tagline || !Array.isArray(parsed.pages) || !Array.isArray(parsed.colorHex)) return null

    return {
      tagline: parsed.tagline,
      pages: parsed.pages.slice(0, 6),
      sections: parsed.sections?.slice(0, 6) || [],
      colorMood: parsed.colorMood || 'Modern & Trustworthy',
      colorHex: parsed.colorHex.slice(0, 3),
      nextStep: parsed.nextStep || 'Ready to make this real? Let\'s build it together.',
      source: 'ai',
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

router.post('/', async (req, res) => {
  const { business, description, type } = req.body || {}

  if (!business || !description) {
    return res.status(400).json({ error: 'business and description are required' })
  }

  const safeInput = {
    business: String(business).slice(0, 80),
    description: String(description).slice(0, 400),
    type: String(type || 'Other').slice(0, 40),
  }

  const aiResult = await callGroq(safeInput)
  const result = aiResult || generateFallbackConcept(safeInput)

  res.json(result)
})

export default router
