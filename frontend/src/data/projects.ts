// Selected work, shown in Projects. Only verified facts: no invented metrics, clients or URLs.
// Sites added through /admin are fetched at runtime and appear alongside these (see os/useProjects.ts).

export type ProjectType = 'Freelance' | 'Personal' | 'Professional' | 'In-house' | 'Competition' | 'Client site'
export type ProjectStatus = 'Live' | 'Live demo' | 'Private' | 'Case study' | 'You are here'

export interface Project {
  id: string
  name: string
  /** Shown as the file name in Explorer */
  file: string
  type: ProjectType
  status: ProjectStatus
  year?: string
  summary: string
  /** What it is for: the problem it solves */
  problem?: string
  /** How it is built, taken only from what the project actually is */
  details: string[]
  stack: string[]
  role: string
  /** A screenshot in /public or a remote URL; when missing, a drawn thumbnail is used */
  image?: { src: string; alt: string }
  /** Which drawn thumbnail to use when there is no image */
  art?: 'desktop' | 'chat' | 'server' | 'shield'
  link?: { href: string; label: string }
  /** Where the source lives, or why it isn't public */
  source: { href: string } | { note: string }
  /** Free-form keywords (sites added through /admin have these instead of a stack) */
  tags?: string[]
  /** Added through /admin rather than written here */
  listed?: boolean
}

export const projects: Project[] = [
  {
    id: 'guitges',
    name: 'Baihaqi.exe (this computer)',
    file: 'Baihaqi.exe',
    type: 'Personal',
    status: 'You are here',
    year: '2026',
    summary:
      'The portfolio you are using right now: a small simulated desktop from the early 2000s, with a real window manager, a Start menu, a working command prompt and a Recycle Bin full of bad ideas.',
    problem:
      'Portfolios tend to look the same. This one tries to be memorable while still getting a recruiter to the projects, skills and contact details in a few clicks.',
    details: [
      'React 18 and TypeScript on Vite, with no UI framework: every window, button, tab and scrollbar is hand-written CSS.',
      'A central window manager (a single reducer) keeps windows, the taskbar and the Start menu in sync: drag, focus, minimise, maximise, restore and close.',
      'The project list merges these hand-written entries with sites added through a password-protected /admin, served by Vercel Functions and stored in Vercel Blob.',
      'Sounds are synthesised with the Web Audio API, off by default. Settings are kept in localStorage.',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'CSS', 'Vercel Functions', 'Vercel Blob', 'Web Audio API'],
    role: 'Solo developer · design and build',
    art: 'desktop',
    link: { href: 'https://guitges.vercel.app', label: 'guitges.vercel.app' },
    source: { href: 'https://github.com/guitges/guitges-studio' },
  },
  {
    id: 'afterhours',
    name: 'AFTERHOURS',
    file: 'AFTERHOURS.exe',
    type: 'Personal',
    status: 'Live demo',
    year: '2026',
    summary:
      'Incident intelligence for when things break at night. AFTERHOURS follows a request across services, links its traces, logs and metrics, and helps find out why production broke. All telemetry is synthetic: it is a demo environment, not a monitor for a real system.',
    problem:
      'Debugging an outage means jumping between logs, traces and dashboards. Its centrepiece, Break the System, triggers one of six controlled failures in a simulated checkout system; you watch it spread through live telemetry, investigate, apply a fix and see recovery checked automatically.',
    details: [
      'A Kotlin 2.2 and Spring Boot 4 API (Web MVC, Data JPA, Security, Validation, Actuator) on PostgreSQL 17, with Flyway migrations and an OpenAPI / Swagger UI.',
      'Claude, through the official Java SDK, proposes a root cause as structured JSON. It must cite the real log lines, traces and metrics behind its answer, and the server verifies every citation. Without an API key, a rule-based investigator takes over.',
      'OpenTelemetry through the Spring Boot starter and Micrometer Tracing, OTLP export, trace IDs in every log line, and health and readiness probes.',
      'Session cookies, CSRF protection, BCrypt password hashing and rate limiting.',
      'Tested end to end: JUnit 5 and MockMvc against a real embedded PostgreSQL, Vitest and Testing Library on the frontend, and Playwright across both.',
      'A Next.js 16 frontend in React 19 and Tailwind CSS 4, with Recharts and SWR, hosted on Vercel; Docker Compose and GitHub Actions CI for the rest.',
    ],
    stack: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'Next.js', 'TypeScript', 'Claude API', 'OpenTelemetry', 'Docker'],
    role: 'Solo developer · design, frontend and backend',
    image: {
      src: '/projects/afterhours.jpg',
      alt: 'AFTERHOURS landing page: “Something is wrong beneath the surface.” over a dark, underwater pool with fluorescent lights.',
    },
    link: { href: 'https://afterhours-kappa-five.vercel.app', label: 'Open the live demo' },
    source: { note: 'The source isn’t linked here yet.' },
  },
  {
    id: 'pengasih',
    name: 'Pengasih Selangor Donation Portal',
    file: 'Pengasih Selangor.url',
    type: 'Freelance',
    status: 'Live',
    year: '2026',
    summary:
      'A donation and charity lucky-draw portal for the 2026 campaign (Bertuah 2026) of Persatuan Pengasih Malaysia Negeri Selangor, built from scratch and launched end-to-end as a solo developer.',
    problem:
      'The organisation needed supporters to donate by bank transfer, prove it, and enter a lucky draw, and the organising team needed a way to verify receipts and run the draw, all on a non-profit budget.',
    details: [
      'One Next.js app in TypeScript, with server-side logic in its own API routes.',
      'Supporters donate by bank transfer and upload their receipt; the organising team verifies receipts and runs the lucky draw from an admin side.',
      'Data lives in Supabase (PostgreSQL). A scheduled keep-alive job stops the free tier from auto-pausing.',
      'Hosting options were compared (Vercel, Netlify, Cloudflare Pages, Cloud Run); it runs with budget alerts and instance limits as a cost safety net.',
      'Custom subdomain DNS and SSL coordinated with the client’s registrar.',
    ],
    stack: ['Next.js', 'TypeScript', 'Next.js API routes', 'Supabase', 'PostgreSQL', 'Cron jobs'],
    role: 'Freelance developer · full-stack',
    image: {
      src: '/projects/pengasih-selangor.webp',
      alt: 'Pengasih Selangor campaign homepage: “Kempen Sumbangan & Cabutan Bertuah 2026” on a deep blue background with donate and prizes buttons.',
    },
    link: { href: 'https://derma.pengasihselangor.com.my/', label: 'derma.pengasihselangor.com.my' },
    source: { note: 'Client work: the source is private.' },
  },
  {
    id: 'little-pool-club',
    name: 'Little Pool Club',
    file: 'Little Pool Club.exe',
    type: 'Personal',
    status: 'Live',
    year: '2026',
    summary:
      'A tiny corner of the internet: a pool where you tap a rubber duck and it reacts. Keep saying hi and other ducks swim in, fifteen in all, most of which only appear if you poke around. No accounts, no tracking, no backend.',
    problem: 'Not every website needs to solve a problem. This one exists to make someone smile for thirty seconds.',
    details: [
      'Next.js 16 (App Router, Turbopack), React 19 and TypeScript, hosted on Vercel as a static site, with no libraries beyond Next.js and React.',
      'CSS Modules for styling, and all animation in CSS: there is no animation library.',
      'Every duck comes from one SVG component with swappable expressions, colours and accessories.',
      'Canvas 2D draws collectible cards and exports them as PNGs; the Web Share and Clipboard APIs share them, with fallbacks.',
      'The Web Audio API makes every sound in the browser, so there are no audio files.',
      'The collection lives in localStorage through useSyncExternalStore, and saved data is validated when it loads.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'CSS Modules', 'SVG', 'Canvas 2D', 'Web Audio API'],
    role: 'Solo developer · design and build',
    image: {
      src: '/projects/little-pool-club.jpg',
      alt: 'Little Pool Club: “welcome to your little pool.” above a yellow rubber duck floating in a tiled pool, with a “tap me” label.',
    },
    link: { href: 'https://littlepoolclub.vercel.app', label: 'littlepoolclub.vercel.app' },
    source: { note: 'The source isn’t linked here yet.' },
  },
  {
    id: 'ai-chatbot',
    name: 'AI Chatbot',
    file: 'AI Chatbot.exe',
    type: 'In-house',
    status: 'Private',
    summary:
      'A conversational assistant built for the company I work at, powered by Anthropic’s Claude API. The work centred on the integration itself and on shaping a chat experience colleagues can use in practice.',
    problem: 'Colleagues wanted an assistant they could actually use day to day, not a demo.',
    details: [
      'Built on Anthropic’s Claude API.',
      'The work centred on the integration and on the shape of the conversation.',
      'Designed for everyday internal use rather than as a showcase.',
    ],
    stack: ['Claude API'],
    role: 'Developer · AI integration (in-house)',
    art: 'chat',
    source: { note: 'An internal tool: there is no public demo or source.' },
  },
  {
    id: 'enterprise',
    name: 'Enterprise Portals',
    file: 'Enterprise Portals',
    type: 'Professional',
    status: 'Case study',
    summary:
      'Most of my professional work at E-Outsource Asia: Flutter Web frontends and PHP/Laravel and Kotlin backends for clients including Honda Malaysia, ERL and UNZA.',
    problem:
      'Large organisations run on many internal portals: supplier systems, vehicle check-in, EV fleet booking. They need to be fast, consistent across environments, and migrated without anyone noticing.',
    details: [
      'Honda Touch migration: moved a legacy system to a modern, Docker-containerised stack with zero downtime during rollout.',
      'Honda Self Check-in (eMOB) and EV Car Booking: Flutter Web apps for automated vehicle check-in and fleet booking with availability scheduling.',
      'Backend API development in PHP/Laravel and MySQL for Honda portals (Touch CR 2024, Supplier Portal).',
      'Responsive Flutter Web frontends for ERL and UNZA business platforms.',
    ],
    stack: ['PHP', 'Laravel', 'MySQL', 'Kotlin', 'Flutter Web', 'Docker'],
    role: 'Full-stack developer · professional work',
    art: 'server',
    source: { note: 'Professional work: the code belongs to the clients.' },
  },
  {
    id: 'anti-phishing',
    name: 'Anti-Phishing Awareness Tool',
    file: 'Anti-Phishing.exe',
    type: 'Competition',
    status: 'Case study',
    summary: 'A gamified cybersecurity-awareness solution made for the Hilti IT Competition, teaching people to spot phishing interactively.',
    problem: 'Phishing works because people are busy. Making detection a game makes the lesson stick.',
    details: ['A gamified approach to educating users and detecting phishing interactively.'],
    stack: ['Cybersecurity awareness', 'Gamification'],
    role: 'Competition entry',
    art: 'shield',
    source: { note: 'A competition entry: no public demo.' },
  },
]
