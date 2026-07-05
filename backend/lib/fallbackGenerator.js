const PAGES_BY_TYPE = {
  'Business / Company': ['Home', 'About', 'Services', 'Testimonials', 'Contact'],
  'Personal / Portfolio': ['Home', 'About Me', 'Portfolio', 'Resume', 'Contact'],
  'Restaurant / Café': ['Home', 'Menu', 'About', 'Gallery', 'Reservations', 'Contact'],
  'Online Store': ['Home', 'Shop', 'Product Details', 'Cart & Checkout', 'About', 'Contact'],
  Other: ['Home', 'About', 'What We Offer', 'Gallery', 'Contact'],
}

const SECTIONS_BY_TYPE = {
  'Business / Company': ['Hero with clear value proposition', 'Services grid', 'Why choose us', 'Client results', 'Call to action'],
  'Personal / Portfolio': ['Bold intro / hero', 'Featured work', 'Skills & experience', 'Testimonials', 'Contact form'],
  'Restaurant / Café': ['Hero with signature dish photo', 'Menu highlights', 'Ambience gallery', 'Hours & location', 'Reservation CTA'],
  'Online Store': ['Hero with best-seller', 'Featured products', 'Collections grid', 'Customer reviews', 'Newsletter signup'],
  Other: ['Hero introduction', 'What makes you different', 'Offerings overview', 'Social proof', 'Contact CTA'],
}

const COLOR_MOODS = [
  { mood: 'Modern & Trustworthy', hex: ['#0ea5e9', '#1e293b', '#f8fafc'] },
  { mood: 'Warm & Inviting', hex: ['#f59e0b', '#7c2d12', '#fff7ed'] },
  { mood: 'Bold & Creative', hex: ['#8b5cf6', '#ec4899', '#0f0a1e'] },
  { mood: 'Fresh & Natural', hex: ['#10b981', '#134e4a', '#f0fdf4'] },
  { mood: 'Elegant & Minimal', hex: ['#111827', '#6b7280', '#f9fafb'] },
]

function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pickTagline(business, description) {
  const templates = [
    `${business} — where ${firstWords(description, 4)} meets a website people trust.`,
    `Bringing ${business} online, the way it deserves to be seen.`,
    `${business}: ${firstWords(description, 5)}, now with a home on the web.`,
    `A modern front door for ${business}.`,
  ]
  const idx = hashString(business + description) % templates.length
  return templates[idx]
}

function firstWords(text, count) {
  const words = text.trim().split(/\s+/).slice(0, count)
  return words.join(' ').toLowerCase().replace(/[.,!?]+$/, '')
}

export function generateFallbackConcept({ business, description, type }) {
  const pages = PAGES_BY_TYPE[type] || PAGES_BY_TYPE.Other
  const sections = SECTIONS_BY_TYPE[type] || SECTIONS_BY_TYPE.Other
  const moodIndex = hashString(business + type) % COLOR_MOODS.length
  const { mood, hex } = COLOR_MOODS[moodIndex]

  return {
    tagline: pickTagline(business, description),
    pages,
    sections,
    colorMood: mood,
    colorHex: hex,
    nextStep:
      "This is a starting concept — the real thing gets sharper once we talk through your brand, customers, and goals.",
    source: 'template',
  }
}
