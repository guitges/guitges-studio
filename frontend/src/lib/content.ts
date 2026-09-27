// All the copy for the portfolio lives here — edit this file to make the site yours.

export const profile = {
  name: 'Ahmad Baihaqi',
  handle: 'guitges',
  role: 'Websites for businesses',
  intro:
    'Simple, fast websites that help customers find you and contact you — from a one-page site (a landing page) to a full company website. One flat price, pay once.',
  about:
    "I'm a web designer and developer who keeps things simple: a clear message, a layout that guides people to act, and a site that loads fast on every phone. You pay once, I build it, launch it, and hand it over — no monthly subscriptions, no lock-in. From small businesses to personal brands, I take projects from first sketch to live site.",
  available: true,
}

// WhatsApp is the only way to get in touch
export const whatsapp = {
  number: '60198681534', // international format, no + or spaces
  display: '019-868 1534',
}

export function whatsappLink(message?: string) {
  return `https://wa.me/${whatsapp.number}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export const socials = [{ label: `WhatsApp · ${whatsapp.display}`, href: whatsappLink() }]

export const stats = [
  { value: '5–10', label: 'days from kickoff to launch' },
  { value: 'RM699', label: 'one-time, for a landing page' },
  { value: '100%', label: 'mobile-first, every build' },
]

export const skills = [
  'Landing Pages',
  'Company Profiles',
  'Informational Sites',
  'Mobile-First',
  'SEO Basics',
  'Contact Forms',
  'Fast Loading',
  'One-Time Price',
  'React',
  'Tailwind CSS',
  'Figma',
  'Easy Handover',
]

export type Accent = 'lime' | 'lilac' | 'tangerine' | 'bubblegum' | 'sky' | 'lemon'

// Previous work is managed from the /admin page and loaded from the backend.

export const services: { title: string; description: string; points: string[]; accent: Accent }[] = [
  {
    title: 'Landing Pages',
    description: 'One focused page built to do one job — get sign-ups, bookings, orders or calls.',
    points: ['Clear headline & call to action', 'Mobile-first layout', 'Contact or sign-up form'],
    accent: 'lime',
  },
  {
    title: 'Informational Websites',
    description: 'A simple, credible home for your business: who you are, what you offer, how to reach you.',
    points: ['Multiple pages', 'Company profile, services, contact', 'Custom quote — just ask'],
    accent: 'lilac',
  },
  {
    title: 'Launch & Handover',
    description: 'I put it online and hand you the keys. Pay once — the site is yours.',
    points: ['Domain & hosting setup', 'Analytics installed', 'Short guide to update your content'],
    accent: 'tangerine',
  },
]

export const pricing: {
  name: string
  price: string
  priceNote: string
  description: string
  features: string[]
  cta: string
  message: string
  highlight?: boolean
}[] = [
  {
    name: 'Landing Page',
    price: 'RM699',
    priceNote: 'one-time payment',
    description: 'A single focused page that gets your business online, fast.',
    features: [
      '1-page responsive website',
      'Mobile-first design',
      'WhatsApp or contact button',
      'Basic SEO setup',
      'Domain & hosting setup help',
      '5-day delivery',
    ],
    cta: 'Get started',
    message: 'Hi Guitges! I’m interested in the Landing Page package (RM699).',
    highlight: true,
  },
  {
    name: 'Custom',
    price: 'Let’s talk',
    priceNote: 'custom quote',
    description: 'More pages, an informational website, or something specific in mind? Message me and I’ll quote a flat price.',
    features: ['Multi-page informational sites', 'Tailored to your scope', 'Still a one-time price', 'No obligation quote'],
    cta: 'Contact me',
    message: 'Hi Guitges! I’d like a custom quote for a website.',
  },
]

export const pricingNotes = [
  'One-time payment — no monthly fees to me.',
  'Domain & hosting are paid to the provider directly.',
  'Everything is arranged over WhatsApp.',
]

export const accentBg: Record<Accent, string> = {
  lime: 'bg-lime',
  lilac: 'bg-lilac',
  tangerine: 'bg-tangerine',
  bubblegum: 'bg-bubblegum',
  sky: 'bg-sky',
  lemon: 'bg-lemon',
}
