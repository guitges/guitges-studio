# Guitges — Portfolio

Portfolio of **Guitges** (Ahmad Baihaqi): landing pages and informational websites for a
one-time price. The site itself uses playful GSAP motion (inspired by gsap.com) to stand out.

- `frontend/` — React + TypeScript + Vite + Tailwind CSS, animated with GSAP
  (ScrollTrigger, ScrollSmoother, SplitText, Draggable + Inertia)
- `frontend/api/` — Vercel Functions for the portfolio projects admin (stored in Vercel Blob)
- `backend/` — the old Express API (contact form + AI concept tool), no longer used by the site
- `assets/` — source logo files

## Editing content

Most copy lives in `frontend/src/lib/content.ts`: intro, about text, stats, skills, services,
pricing (in RM) and your WhatsApp number. WhatsApp is the only contact method: the contact
form just drafts a message and opens a WhatsApp chat.

## Managing your portfolio (/admin)

The "Sites I've built" section is managed from a small admin page, no code edits needed.
Its API runs as Vercel Functions (`frontend/api/`) and stores everything in Vercel Blob.

1. Set `ADMIN_PASSWORD` in the Vercel project (Settings → Environment Variables, or
   `npx vercel env add ADMIN_PASSWORD production` inside `frontend/`), then redeploy.
2. Open `https://<your-site>/admin` and log in.
3. Add a site: paste its live link, a title, type, year, a short description and tags.
   A screenshot of the site's first screen (1440×900) is captured automatically using
   [Microlink](https://microlink.io)'s free API (about 50 screenshots/day).
4. Edit, reorder, refresh a preview (e.g. after the client's site changes) or delete sites
   from the same page.

Each project is stored as its own JSON file in Blob under `portfolio/projects/`, and
previews under `portfolio/screenshots/`.

## What moves

- Loader that counts to 100% and wipes away into the hero intro
- Hero: SplitText character reveals, spinning inline shapes, pointer-parallax floaters
- Skill marquees that speed up and flip direction with your scroll
- About paragraph that lights up word by word as you scroll
- Pinned horizontal project gallery with tilt-on-hover cards (desktop)
- Stacking service cards that shrink as the next one slides over
- One-time pricing cards that pop in
- Playground of draggable, throwable shapes
- Custom cursor, magnetic buttons, bouncy footer wordmark

Animations respect `prefers-reduced-motion`.

## Running locally

```bash
cd frontend
npm install
npx vercel dev      # site + /api functions on http://localhost:3000
```

`npx vercel dev` pulls the project's environment (including the Blob token) from Vercel, so
the local admin edits your real portfolio. To use the local admin, add
`ADMIN_PASSWORD=...` to `frontend/.env.local`. Plain `npm run dev` also works for the site
itself, but `/api` (and the "Sites I've built" list) only works under `vercel dev`.

The old Express `backend/` (contact form + AI concept tool) is no longer used by the site.

## Environment variables (Vercel project)

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password for the `/admin` page. Admin is disabled while it's unset |
| `BLOB_READ_WRITE_TOKEN` | Added automatically when the Blob store is connected |

## Deployment

Deploy `frontend/` to Vercel (`npx vercel --prod` from `frontend/`). Vite is detected
automatically, `api/` becomes Vercel Functions, and `vercel.json` routes `/admin` to the app.
