import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import aiConceptRouter from './routes/aiConcept.js'
import contactRouter from './routes/contact.js'

dotenv.config({ quiet: true })

const app = express()
const PORT = process.env.PORT || 4000
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')
const LOCAL_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser requests (curl, health checks) send no Origin header at all.
      if (!origin) return callback(null, true)
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
      // In dev, Vite may bump to another port (5174, 5175...) if 5173 is taken.
      if (!IS_PRODUCTION && LOCAL_ORIGIN_RE.test(origin)) return callback(null, true)
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
  }),
)
app.use(express.json({ limit: '50kb' }))

const requestLog = new Map()
function rateLimit({ windowMs, max }) {
  return (req, res, next) => {
    const key = req.ip
    const now = Date.now()
    const entry = requestLog.get(key) || []
    const recent = entry.filter((t) => now - t < windowMs)
    if (recent.length >= max) {
      return res.status(429).json({ error: 'Too many requests, please try again shortly.' })
    }
    recent.push(now)
    requestLog.set(key, recent)
    next()
  }
}

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/ai-concept', rateLimit({ windowMs: 60_000, max: 12 }), aiConceptRouter)
app.use('/api/contact', rateLimit({ windowMs: 60_000, max: 6 }), contactRouter)

app.listen(PORT, () => {
  console.log(`Guitges backend listening on http://localhost:${PORT}`)
})
