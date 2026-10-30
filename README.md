# Baihaqi.exe

The portfolio of **Ahmad Baihaqi** (Guitges), a full-stack developer in Malaysia, built as a
small, slightly impossible personal computer from 2003: a Frutiger Aero sky, desktop icons, real
draggable windows, a taskbar and a Start menu. The desktop *is* the homepage.

A recruiter can get everything in a few clicks: the welcome dialog has shortcuts to Projects,
Experience, Résumé and Contact, and every app is reachable from the Start menu and My Computer.

## The computer

| App | What it holds |
| --- | --- |
| **My Computer** | Explorer-style navigation: Back/Forward/Up, Search, an address bar and folders for About Me, Projects, Skills, Experience and Contact |
| **About Baihaqi** | Profile, education, certifications (About / System Information / Fun Facts tabs) |
| **Projects** | Every project as a file: tiles, thumbnails, icons or details view, sorting, a preview pane; each opens its own details window |
| **Skills and Components** | Skills by tab, labelled by where they were used (professional / projects / familiar), not by score |
| **Work History** | Positions in a list view with expandable details and a link to the résumé PDF |
| **Internet Explorer** | A tiny homepage, a contact page and a guestbook that lives only in the visitor's browser |
| **Recycle Bin** | Fictional bad ideas, an Empty button, and something you were told not to open |
| **Command Prompt** | A simulated prompt (`help`, `projects`, `skills`, `open <app>`, `theme <name>`…). Nothing typed is executed |
| **Notepad** | Edit, save as `.txt`, unsaved-changes warning |
| **System Properties** | Wallpapers, three themes (Classic XP Blue, Silver Millennium, Dreamy Sky), icon size, sound |

Right-click (or long-press) the desktop for View, Sort, Refresh, New, Display Properties and
About this computer. Log Off returns to the welcome dialog; Shut Down shows a screen with Restart.

Easter eggs: the `secret` command, poking the Recycle Bin five times, `do_not_open.exe`, an
occasional pixel fish, tray balloons, and the uptime in About this computer.

## Running locally

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run lint
```

In development `/api` is proxied to the live site (see `vite.config.ts`), so the project list
includes the sites added through `/admin`.

## Where things live

| Path | What |
| --- | --- |
| `frontend/src/data/site.ts` | Everything a visitor reads: profile, links, education, skills, experience, notes, Recycle Bin jokes, tray balloons |
| `frontend/src/data/projects.ts` | Projects: summary, problem, implementation, stack, links, source |
| `frontend/src/os/store.tsx` | The window manager (one reducer) plus desktop state and persisted settings |
| `frontend/src/os/registry.ts` | Each app's title, icon and default size |
| `frontend/src/os/WindowFrame.tsx` | Title bar, controls, drag, resize, minimise/maximise |
| `frontend/src/os/apps/` | One file per app |
| `frontend/src/os/os.css` | All styling; theme tokens live on `.os-theme-*` |
| `frontend/src/os/icons.tsx` | The hand-drawn SVG icon set |

Only verified facts are used (from the résumé in `public/resume.pdf`). Missing links are simply
hidden: set any link in `site.ts` to `''` to remove it everywhere.

## Notes

- Sound is off on every visit and only plays after the visitor turns it on (synthesised with the
  Web Audio API; there are no audio files).
- Settings live in `localStorage`; the welcome dialog is shown once per browser session.
- `prefers-reduced-motion` turns off cloud drift, the fish and window animations.
- On phones (< 640 px) icons open with a single tap and windows open near full-screen.

## Admin (/admin)

`/admin` manages an extra list of shipped sites in Vercel Blob (`ADMIN_PASSWORD` +
`BLOB_READ_WRITE_TOKEN` in the Vercel project; run with `npx vercel dev`). Those sites appear in
Projects next to the hand-written entries; a site already in `projects.ts` keeps its fuller entry.

## Deployment

Deploy `frontend/` to Vercel (`npx vercel --prod` from `frontend/`). `vercel.json` routes every
path to the app, and sets long-lived caching for hashed assets.
