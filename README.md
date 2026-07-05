# Guitges Studio

Marketing website for **Guitges Studio** — a web design studio building modern,
mobile-friendly websites for businesses and individuals.

- `frontend/` — React + TypeScript + Vite + Tailwind CSS + Framer Motion single-page site
- `backend/` — Express API powering the contact form and the "Free AI Concept Tool"
- `assets/` — source logo files (including a transparent-background version)

## Features

- Modern, animated, mobile-first landing page built around the Guitges brand
- Interactive **AI Concept Tool**: visitors describe their business and get an instant
  suggested site structure, tagline, and color mood — powered by [Groq's free API](https://console.groq.com)
  when configured, with a built-in template-based fallback so it always works out of the box
- Contact form that stores submissions to disk and can optionally email them via SMTP

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # optionally add GROQ_API_KEY / SMTP settings
npm run dev
```

Runs on `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Runs on `http://localhost:5173`.

## Environment variables

**`backend/.env`**

| Variable | Purpose |
| --- | --- |
| `PORT` | Port for the API server (default `4000`) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |
| `GROQ_API_KEY` | Optional. Enables real AI-generated concepts via Groq's free tier |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Optional. Enables emailing contact submissions |
| `CONTACT_TO_EMAIL` | Where contact form emails are sent |

**`frontend/.env.local`**

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API |

## Deployment

- **Frontend**: deploy `frontend/` to Vercel or Netlify (build command `npm run build`, output `dist/`)
- **Backend**: deploy `backend/` to any Node host (Render, Railway, Fly.io) and set the env vars above
