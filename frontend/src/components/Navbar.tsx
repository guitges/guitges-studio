import { useRef, useState, type MouseEvent } from 'react'
import { gsap, useGSAP, ScrollTrigger, scrollToHash } from '../lib/gsap'
import { profile, socials } from '../lib/content'
import logoIcon from '../assets/guitges-icon.png'
import Magnetic from './Magnetic'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const header = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const menuTl = useRef<gsap.core.Timeline | null>(null)
  const [open, setOpen] = useState(false)

  useGSAP(() => {
    // Hide on scroll down, reveal on scroll up
    const hide = gsap.to(header.current, { yPercent: -120, duration: 0.35, ease: 'power2.out', paused: true })
    ScrollTrigger.create({
      start: 'top -120',
      end: 'max',
      onUpdate: (self) => (self.direction === 1 ? hide.play() : hide.reverse()),
    })

    menuTl.current = gsap
      .timeline({ paused: true })
      .set(menu.current, { display: 'flex' })
      .fromTo(menu.current, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.7, ease: 'power3.inOut' })
      .from('.menu-link', { yPercent: 110, rotate: 4, stagger: 0.06, duration: 0.6, ease: 'power3.out' }, '-=0.3')
  })

  function toggle(next = !open) {
    setOpen(next)
    if (next) menuTl.current?.timeScale(1).play()
    else menuTl.current?.timeScale(1.6).reverse()
  }

  function go(e: MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    toggle(false)
    scrollToHash(href)
  }

  return (
    <>
      <header ref={header} className="fixed inset-x-0 top-0 z-50">
        <nav className="container-px flex items-center justify-between py-4">
          <a href="#top" onClick={(e) => go(e, '#top')} className="flex items-center gap-2.5" aria-label="Back to top">
            <img src={logoIcon} alt="" className="h-9 w-9" />
            <span className="font-display text-xl font-bold tracking-tight">{profile.handle}</span>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-cream/10 bg-ink/70 p-1.5 backdrop-blur-md md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="rounded-full px-4 py-2 text-sm font-medium text-cream-muted transition-colors hover:bg-cream hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Magnetic>
                <a href="#contact" onClick={(e) => go(e, '#contact')} className="pill-lime !px-5 !py-2.5 text-sm">
                  Let’s talk
                </a>
              </Magnetic>
            </div>
            <button
              onClick={() => toggle()}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-[60] flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-cream md:hidden"
            >
              <span
                className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? 'translate-y-1 rotate-45' : ''}`}
              />
              <span
                className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${open ? '-translate-y-1 -rotate-45' : ''}`}
              />
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menu}
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-lilac px-4 pb-8 pt-24 text-ink md:hidden"
      >
        <ul className="space-y-1">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="menu-link flex items-baseline gap-3 font-display text-6xl font-extrabold tracking-tight"
              >
                <span className="font-mono text-sm font-normal">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
