import { useRef, type MouseEvent } from 'react'
import { ArrowUp } from 'lucide-react'
import { gsap, useGSAP, SplitText, MOTION_OK, scrollToHash } from '../lib/gsap'
import { profile, socials } from '../lib/content'

export default function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('.footer-word', { type: 'chars' })
        gsap.from(split.chars, {
          yPercent: 100,
          stagger: { each: 0.05, from: 'center' },
          duration: 1.2,
          ease: 'bounce.out',
          scrollTrigger: { trigger: '.footer-word', start: 'top 95%' },
        })

        // Letters hop when hovered
        const hop = (e: Event) =>
          gsap.fromTo(
            e.currentTarget as HTMLElement,
            { y: 0 },
            { y: '-0.12em', duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true },
          )
        split.chars.forEach((c) => c.addEventListener('pointerenter', hop))
        return () => {
          split.chars.forEach((c) => c.removeEventListener('pointerenter', hop))
          split.revert()
        }
      })
    },
    { scope: root },
  )

  function toTop(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    scrollToHash('#top')
  }

  return (
    <footer ref={root} className="relative overflow-hidden rounded-t-[2.5rem] bg-lime text-ink" data-cursor-dark>
      <div className="container-px pt-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-display text-lg font-semibold">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                {s.label}
              </a>
            ))}
          </div>
          <a
            href="#top"
            onClick={toTop}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:-translate-y-1"
            aria-label="Back to top"
            data-cursor="Up"
          >
            <ArrowUp size={22} />
          </a>
        </div>

        <p className="footer-word mt-10 select-none text-center font-display text-[clamp(4rem,22vw,22rem)] font-extrabold leading-[0.85] tracking-[-0.06em] pb-[0.14em]">
          {profile.handle}
        </p>

        <div className="flex flex-wrap justify-between gap-2 border-t border-ink/20 py-5 font-mono text-xs uppercase tracking-widest">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Built with React & GSAP</span>
        </div>
      </div>
    </footer>
  )
}
