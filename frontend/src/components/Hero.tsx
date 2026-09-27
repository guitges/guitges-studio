import { useEffect, useRef, type MouseEvent } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, SplitText, MOTION_OK, scrollToHash } from '../lib/gsap'
import { profile, whatsappLink } from '../lib/content'
import { Star, Flower, Blob, Ring, Squiggle, Plus } from './Shapes'
import Magnetic from './Magnetic'

const floaters = [
  { Shape: Flower, cls: 'left-[4%] top-[18%] h-16 w-16 text-tangerine sm:h-24 sm:w-24', depth: 40 },
  { Shape: Ring, cls: 'right-[6%] top-[14%] h-14 w-14 text-sky sm:h-20 sm:w-20', depth: -30 },
  { Shape: Plus, cls: 'right-[18%] bottom-[22%] h-10 w-10 text-bubblegum sm:h-14 sm:w-14', depth: 55 },
  { Shape: Blob, cls: 'hidden md:block left-[50%] bottom-[20%] h-20 w-20 text-lilac', depth: -45 },
  { Shape: Squiggle, cls: 'left-[46%] top-[10%] h-8 w-24 text-lemon sm:h-10 sm:w-32', depth: 25 },
]

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('.hero-line', { type: 'chars', mask: 'lines', linesClass: 'split-line' })

        intro.current = gsap
          .timeline({ paused: true, defaults: { ease: 'expo.out' } })
          .from(split.chars, { yPercent: 120, rotate: 12, duration: 1.2, stagger: 0.025 })
          .from('.hero-inline', { scale: 0, rotate: -180, duration: 1, ease: 'back.out(2)', stagger: 0.1 }, 0.4)
          .from('.hero-floater', { scale: 0, autoAlpha: 0, duration: 1, ease: 'elastic.out(1, 0.5)', stagger: 0.08 }, 0.5)
          .from('.hero-fade', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.7)

        // Slow idle spin on the inline shapes
        gsap.to('.hero-inline', { rotate: '+=360', duration: 12, ease: 'none', repeat: -1 })

        // Scroll away: headline lifts and fades, floaters scatter at different speeds
        gsap.to('.hero-title', {
          yPercent: -25,
          autoAlpha: 0.2,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.utils.toArray<HTMLElement>('.hero-floater').forEach((el, i) => {
          gsap.to(el, {
            y: -200 - i * 80,
            rotate: i % 2 ? 180 : -180,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 },
          })
        })

        // Pointer parallax on the floaters
        const movers = gsap.utils.toArray<HTMLElement>('.hero-floater-inner').map((el) => ({
          x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
          y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
          depth: Number(el.dataset.depth),
        }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          movers.forEach((m) => {
            m.x(nx * m.depth)
            m.y(ny * m.depth)
          })
        }
        window.addEventListener('pointermove', onMove)
        return () => {
          window.removeEventListener('pointermove', onMove)
          split.revert()
        }
      })
    },
    { scope: root },
  )

  useEffect(() => {
    if (ready) intro.current?.play()
  }, [ready])

  function go(e: MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    scrollToHash(href)
  }

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-28 sm:pt-32">
      {floaters.map(({ Shape, cls, depth }, i) => (
        <div key={i} className={`hero-floater pointer-events-none absolute ${cls}`}>
          <div className="hero-floater-inner h-full w-full" data-depth={depth}>
            <Shape className="h-full w-full" />
          </div>
        </div>
      ))}

      <div className="container-px relative flex flex-1 flex-col">
        <p className="hero-fade eyebrow">
          {profile.available && <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />}
          {profile.available ? 'Available for new projects' : profile.role}
        </p>

        <h1 className="hero-title my-auto py-10 font-display text-mega font-extrabold">
          <span className="hero-line block">
            Hi, I’m <span className="text-lime">Guitges</span>
          </span>
          <span className="flex flex-wrap items-center gap-x-[0.2em]">
            <span className="hero-line">I build</span>
            <Star className="hero-inline inline-block h-[0.7em] w-[0.7em] text-bubblegum" />
            <span className="hero-line">websites</span>
          </span>
          <span className="flex flex-wrap items-center gap-x-[0.2em]">
            <span className="hero-line">for your</span>
            <span className="hero-line italic text-lilac">business.</span>
          </span>
        </h1>

        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <p className="hero-fade max-w-md text-lg text-cream-muted">{profile.intro}</p>
          <div className="hero-fade flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href="#work" onClick={(e) => go(e, '#work')} className="pill-lime" data-cursor="Go">
                See my work <ArrowUpRight size={18} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={whatsappLink('Hi Guitges!')} target="_blank" rel="noreferrer" className="pill-ghost">
                WhatsApp me
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="hero-fade mt-10 flex items-center justify-between border-t border-cream/10 pt-4 font-mono text-xs uppercase tracking-[0.2em] text-cream-dim">
          <span>{profile.name}</span>
          <span className="flex items-center gap-2">
            Scroll <ArrowDown size={14} className="animate-bounce" />
          </span>
          <span className="hidden sm:inline">{profile.role}</span>
        </div>
      </div>
    </section>
  )
}
