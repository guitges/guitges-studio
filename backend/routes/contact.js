import { Router } from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nodemailer from 'nodemailer'

const router = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', 'data', 'submissions.json')

async function saveSubmission(entry) {
  let existing = []
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    existing = JSON.parse(raw)
  } catch {
    existing = []
  }
  existing.push(entry)
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(existing, null, 2))
}

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

router.post('/', async (req, res) => {
  const { name, email, business, package: pkg, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' })
  }

  const entry = {
    name: String(name).slice(0, 120),
    email: String(email).slice(0, 200),
    business: business ? String(business).slice(0, 120) : '',
    package: pkg ? String(pkg).slice(0, 40) : '',
    message: String(message).slice(0, 2000),
    receivedAt: new Date().toISOString(),
  }

  try {
    await saveSubmission(entry)

    const transport = getTransport()
    if (transport && process.env.CONTACT_TO_EMAIL) {
      await transport.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: entry.email,
        subject: `New inquiry from ${entry.name} — Guitges`,
        text: `Name: ${entry.name}\nEmail: ${entry.email}\nBusiness: ${entry.business}\nPackage: ${entry.package}\n\n${entry.message}`,
      })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Failed to handle contact submission:', err)
    res.status(500).json({ error: 'Failed to process submission' })
  }
})

export default router
