// Everything a visitor reads on Baihaqi.exe lives here (projects are in ./projects.ts).
// Edit the text, links and lists below; the desktop, windows and terminal all read from this file.
// Facts come from the résumé in /public/resume.pdf — nothing here is invented.

export const site = {
  computerName: 'BAIHAQI-PC',
  osName: 'Baihaqi.exe',
  version: '1.0.0',

  name: 'Ahmad Baihaqi',
  short: 'Baihaqi',
  handle: 'guitges',
  role: 'Full-Stack Developer',
  location: 'Kota Damansara, Selangor, Malaysia',
  tagline:
    'I build useful things for the internet, occasionally disappear into a design rabbit hole, and have a soft spot for weird little websites.',

  /** A photo in /public; set to null to show the placeholder silhouette */
  portrait: '/portrait.webp' as string | null,

  links: {
    /** Leave any of these empty ('') to hide it everywhere */
    email: 'ahmadbaihaqi2111@gmail.com',
    github: 'https://github.com/guitges',
    linkedin: 'https://linkedin.com/in/ahmadbaihaqiahmadrifae',
    whatsapp: 'https://wa.me/60198681534?text=' + encodeURIComponent('Hi Baihaqi! I came across your portfolio and'),
    /** Hidden when empty */
    resume: '/resume.pdf',
    /** This site's own source */
    source: 'https://github.com/guitges/guitges-studio',
    website: 'https://guitges.vercel.app',
  },

  education: {
    degree: 'Bachelor of Computer Science (Networking) with Honours',
    school: 'Universiti Putra Malaysia (UPM)',
    years: 'Sep 2020 – Sep 2024',
    cgpa: '3.76 / 4.00',
  },

  certifications: ['AWS Certified Cloud Practitioner (2024)', 'The Web Developer Bootcamp — Udemy (2023)'],

  achievements: [
    'Silver Medal — International Research Symposium and Exposition (RISE 2023)',
    'Gold Medal — Science & Mathematics Olympiad',
    'Publicity Lead — Serdang Royals Debate Club',
  ],
}

export const about = {
  paragraphs: [
    'I’m a full-stack developer in Malaysia. By day I build enterprise web apps and backend APIs at E-Outsource Asia; on the side I design and ship full-stack sites for NGOs and small businesses under the name Guitges.',
    'I like understanding how the pieces fit together, from the database to the last pixel, and I care about software that is reliable and pleasant to use.',
  ],
  funFacts: [
    'Favourite internet aesthetic: Frutiger Aero. Obviously. Look around.',
    'Has built a pool full of rubber ducks, on purpose (Little Pool Club).',
    'Built an incident-investigation demo where you get to break production at night (AFTERHOURS).',
    'Once won a gold medal at a science & maths olympiad. Still counts on fingers sometimes.',
    'Ex-publicity lead of a debate club, so will argue about tabs vs. spaces professionally.',
    'Current number of open browser tabs: classified.',
  ],
}

export type SkillLevel = 'Professional experience' | 'Used in projects' | 'Familiar with'

export interface Skill {
  name: string
  level: SkillLevel
  note: string
}

/** Grouped by tab in Skills.exe. Levels describe where a skill was used, not a score. */
export const skills: { tab: string; icon: 'lang' | 'frame' | 'server' | 'tool' | 'cloud'; items: Skill[] }[] = [
  {
    tab: 'Languages',
    icon: 'lang',
    items: [
      { name: 'PHP', level: 'Professional experience', note: 'Laravel backends and REST APIs for enterprise portals' },
      { name: 'Kotlin', level: 'Professional experience', note: 'Maintaining and extending backend services; AFTERHOURS API' },
      { name: 'TypeScript', level: 'Professional experience', note: 'Next.js apps for clients, plus every personal project' },
      { name: 'JavaScript', level: 'Professional experience', note: 'Frontends, tooling and the odd browser toy' },
      { name: 'Dart', level: 'Professional experience', note: 'Flutter Web frontends for enterprise clients' },
      { name: 'SQL', level: 'Professional experience', note: 'MySQL and PostgreSQL, including query and schema optimisation' },
      { name: 'HTML / CSS', level: 'Professional experience', note: 'Responsive layouts, and windows like these' },
      { name: 'Python', level: 'Used in projects', note: 'A Flask sports-analysis system during an internship' },
    ],
  },
  {
    tab: 'Frameworks',
    icon: 'frame',
    items: [
      { name: 'Laravel', level: 'Professional experience', note: 'Backend APIs for Honda portals' },
      { name: 'Flutter Web', level: 'Professional experience', note: 'ERL, UNZA and Honda platforms' },
      { name: 'Next.js', level: 'Professional experience', note: 'Freelance client work (Pengasih Selangor) and personal projects' },
      { name: 'React', level: 'Used in projects', note: 'Little Pool Club, AFTERHOURS and this desktop' },
      { name: 'Spring Boot', level: 'Used in projects', note: 'The AFTERHOURS API, in Kotlin' },
      { name: 'Tailwind CSS', level: 'Used in projects', note: 'AFTERHOURS and client sites' },
      { name: 'Flask', level: 'Used in projects', note: 'A real-time sports-analysis web system' },
    ],
  },
  {
    tab: 'Backend',
    icon: 'server',
    items: [
      { name: 'REST API design', level: 'Professional experience', note: 'Designing and optimising services to remove bottlenecks' },
      { name: 'MySQL', level: 'Professional experience', note: 'Enterprise portals, plus query and schema tuning' },
      { name: 'PostgreSQL / Supabase', level: 'Professional experience', note: 'Freelance production apps; AFTERHOURS on PostgreSQL 17' },
      { name: 'Authentication', level: 'Professional experience', note: 'Sessions, CSRF protection, BCrypt, Firebase Auth' },
      { name: 'Claude API', level: 'Used in projects', note: 'An in-house assistant and the AFTERHOURS AI investigator' },
      { name: 'OpenTelemetry', level: 'Used in projects', note: 'Traces, logs and metrics linked in AFTERHOURS' },
      { name: 'Firebase / Google Datastore', level: 'Used in projects', note: 'User management and cloud storage in an internship project' },
    ],
  },
  {
    tab: 'Tools',
    icon: 'tool',
    items: [
      { name: 'Docker & Docker Compose', level: 'Professional experience', note: 'Containerised PHP/Laravel and Kotlin backends' },
      { name: 'Git / GitHub', level: 'Professional experience', note: 'Every day, in Agile teams' },
      { name: 'GitHub Actions', level: 'Used in projects', note: 'CI for AFTERHOURS' },
      { name: 'Playwright', level: 'Used in projects', note: 'End-to-end tests in AFTERHOURS' },
      { name: 'Vite', level: 'Used in projects', note: 'This very desktop' },
      { name: 'Agile / Scrum', level: 'Professional experience', note: 'Sprint delivery with QA and stakeholders' },
    ],
  },
  {
    tab: 'Cloud',
    icon: 'cloud',
    items: [
      { name: 'Vercel', level: 'Used in projects', note: 'Hosting, functions, Blob storage and cron jobs' },
      { name: 'Google Cloud Run / GCP', level: 'Used in projects', note: 'A cost-capped production deploy for an NGO' },
      { name: 'AWS fundamentals', level: 'Familiar with', note: 'AWS Certified Cloud Practitioner (2024)' },
      { name: 'DNS & SSL setup', level: 'Used in projects', note: 'Custom subdomains coordinated with client registrars' },
    ],
  },
]

export interface Job {
  id: string
  title: string
  company: string
  type: string
  start: string
  end: string
  location: string
  summary: string
  responsibilities: string[]
  stack: string[]
}

export const experience: Job[] = [
  {
    id: 'eoa',
    title: 'Associate Consultant — Full-Stack Developer',
    company: 'E-Outsource Asia Sdn Bhd',
    type: 'Full-time',
    start: 'Oct 2024',
    end: 'Present',
    location: 'Malaysia',
    summary: 'Enterprise web apps and backend APIs for major Malaysian organisations, including Honda Malaysia, ERL and UNZA.',
    responsibilities: [
      'Delivered 10+ enterprise projects spanning Flutter Web frontends and backend APIs.',
      'Built responsive Flutter Web frontends for ERL, UNZA and Honda platforms (Self Check-in / eMOB, EV Car Booking).',
      'Led backend API development in PHP/Laravel and MySQL for Honda portals (Touch CR 2024, Supplier Portal).',
      'Containerised PHP/Laravel and Kotlin backends with Docker and Docker Compose for consistent local, staging and production environments.',
      'Maintained and extended Kotlin backend services, running and debugging them in Docker.',
      'Managed a zero-downtime migration of the legacy Honda Touch system to a modern architecture.',
      'Worked with cross-functional teams to define requirements, test and ship on tight schedules.',
    ],
    stack: ['PHP', 'Laravel', 'MySQL', 'Kotlin', 'Flutter Web', 'Docker', 'REST APIs'],
  },
  {
    id: 'freelance',
    title: 'Freelance Full-Stack Developer',
    company: 'Guitges (independent)',
    type: 'Freelance',
    start: '2023',
    end: 'Present',
    location: 'Malaysia',
    summary: 'Full-stack web apps for SME and NGO clients, from scoping and quotation to deployment and handover.',
    responsibilities: [
      'Design and ship full-stack apps with Next.js, React, TypeScript and Supabase, owning the whole lifecycle.',
      'Built the Pengasih Selangor donation & lucky-draw portal from scratch and delivered it to production.',
      'Implemented the donor flow with receipt uploads, plus admin-side receipt verification and the lucky-draw workflow.',
      'Kept a non-profit’s hosting bill safe with budget alerts and instance limits.',
      'Solved Supabase free-tier auto-pausing with a scheduled keep-alive job; set up custom-subdomain DNS and SSL.',
    ],
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel', 'Cloud Run'],
  },
  {
    id: 'eoa-intern',
    title: 'Software Development Intern — Backend & API',
    company: 'E-Outsource Asia Sdn Bhd',
    type: 'Internship',
    start: 'Mar 2024',
    end: 'Sep 2024',
    location: 'Malaysia',
    summary: 'Production REST API services for live enterprise environments.',
    responsibilities: [
      'Built and deployed production REST API services supporting 1,000+ daily active users.',
      'Applied SQL query and schema optimisations that improved application responsiveness.',
      'Contributed backend modules for automotive client portals, merged and deployed during the internship.',
      'Delivered sprint milestones with senior developers and QA in an Agile workflow.',
    ],
    stack: ['PHP', 'Laravel', 'SQL', 'REST APIs'],
  },
  {
    id: 'innohub',
    title: 'Frontend Developer (Internship)',
    company: 'INNOHUB, Putra Science Park',
    type: 'Internship',
    start: 'Aug 2023',
    end: 'Oct 2023',
    location: 'Malaysia',
    summary: 'A sports-analysis web system for researchers and coaching staff.',
    responsibilities: [
      'Built a sports-analysis web system with Python Flask and real-time data processing.',
      'Integrated Google Maps and Geolocation APIs for localisation and navigation.',
      'Implemented Firebase Authentication and Google Datastore for user management and storage.',
    ],
    stack: ['Python', 'Flask', 'Firebase', 'Google Maps API'],
  },
]

/** Playful fictional files in the Recycle Bin. Not real project history. */
export const recycled: { name: string; kind: 'zip' | 'txt' | 'img' | 'exe' | 'folder'; size: string; joke: string; secret?: boolean }[] = [
  { name: 'final-final-v7-actual-final.zip', kind: 'zip', size: '4.2 MB', joke: 'Contains final-final-v8.zip. It goes all the way down.' },
  { name: 'why-is-this-css-not-working.txt', kind: 'txt', size: '1 KB', joke: '“it was a missing semicolon.” — written at 2:47 AM, after three hours.' },
  { name: 'todo-app-attempt-14', kind: 'folder', size: '—', joke: 'Every developer’s rite of passage. This one had dark mode, and nothing else.' },
  { name: 'startup-idea-uber-for-ducks.txt', kind: 'txt', size: '2 KB', joke: 'The ducks unionised. Little Pool Club was the settlement.' },
  { name: 'node_modules (old).zip', kind: 'zip', size: '2.7 GB', joke: 'Heavier than the sun. Deleting it freed up 40% of this disk.' },
  { name: 'screenshot_2003_desktop.bmp', kind: 'img', size: '2.3 MB', joke: 'A blue sky. Some clouds. Hmm, looks familiar.' },
  { name: 'do_not_open.exe', kind: 'exe', size: '13 KB', joke: '', secret: true },
]

export const notes: { name: string; text: string }[] = [
  { name: 'remember to drink water.txt', text: 'remember to drink water.\n\nalso:\n- stand up\n- unclench jaw\n- close at least 3 tabs (you won’t)\n' },
  {
    name: 'readme.txt',
    text:
      'Welcome to Baihaqi.exe.\n\nThis notepad works. Type anything, then File > Save to download it as a .txt.\nNothing you write here leaves your computer.\n\nThings to try:\n- Open Command Prompt and type "help"\n- Right-click the desktop\n- Look in the Recycle Bin (carefully)\n',
  },
  { name: 'ideas.txt', text: 'website ideas:\n- a desktop that is also a portfolio  ✓\n- a pool full of ducks  ✓\n- a website that is just one very good button\n' },
]

/** Occasional tray balloons. Gentle, never more than one at a time. */
export const balloons = [
  { title: 'Tip', text: 'Right-click the desktop for display properties and more.' },
  { title: 'Hydration Service', text: 'This is your computer reminding you to drink some water.' },
  { title: 'Command Prompt', text: 'Psst. Try typing “help” in the Command Prompt.' },
  { title: 'Windows of Opportunity', text: 'Baihaqi is open to interesting work. Contact is in the Start menu.' },
  { title: 'Clouds', text: 'The clouds are moving. Slowly. On purpose.' },
]
