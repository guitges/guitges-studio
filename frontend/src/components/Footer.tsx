import { Mail, MessageCircle, Globe, ArrowUpRight } from 'lucide-react'
import logoIcon from '../assets/guitges-icon.png'

const columns = [
  {
    title: 'Studio',
    links: [
      { label: 'Services', href: '#services' },
      { label: 'Example Concepts', href: '#work' },
      { label: 'Process', href: '#process' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'AI Concept Tool', href: '#ai-concept' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="container-px mx-auto max-w-6xl py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <img src={logoIcon} alt="Guitges Studio" className="h-9 w-9" />
              <span className="font-display text-lg font-semibold tracking-wide text-white">GUITGES</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              Technology for tomorrow — modern, professional websites for businesses and individuals.
            </p>
            <div className="mt-5 flex gap-3">
              {[Mail, MessageCircle, Globe, ArrowUpRight].map((Icon, i) => (
                <a
                  key={i}
                  href="#contact"
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-slate-500 transition-colors hover:text-slate-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Guitges Studio. All rights reserved.</p>
          <p>Designed & built by Guitges Studio.</p>
        </div>
      </div>
    </footer>
  )
}
