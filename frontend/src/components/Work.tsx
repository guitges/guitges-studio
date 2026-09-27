import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { gsap, useGSAP, SplitText, ScrollTrigger } from '../lib/gsap'
import { accentBg, whatsappLink, type Accent } from '../lib/content'
import { fetchProjects, imageUrl, type Project } from '../lib/api'
import { Star, Flower, Blob, Pill } from './Shapes'

const accents: Accent[] = ['tangerine', 'sky', 'lilac', 'lime', 'bubblegum', 'lemon']
const shapes = [Flower, Pill, Star, Blob]

/**
 * Projects come from the backend (managed on /admin).
 * Desktop: the section pins and the cards slide sideways as you scroll.
 * Mobile / reduced motion: a plain vertical stack.
 */
export default function Work() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  useGSAP(
    () => {
      if (!projects) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        // No projects yet: the empty state renders instead of the card track
        if (!track.current) return
        const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth)
        if (distance() === 0) return
        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        // Placeholder shapes spin, screenshots drift up as they travel across
        gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
          const isShot = !!card.querySelector('img')
          gsap.fromTo(
            card.querySelector('.work-shape'),
            isShot ? { yPercent: 10 } : { rotate: -90, xPercent: -30 },
            {
              ...(isShot ? { yPercent: 0 } : { rotate: 90, xPercent: 30 }),
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: slide,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })

        gsap.to('.work-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
          gsap.from(card, {
            y: 80,
            rotate: 3,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
          })
        })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('.work-title', { type: 'chars', mask: 'chars', charsClass: 'split-char' })
        gsap.from(split.chars, {
          yPercent: 100,
          stagger: 0.03,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.work-title', start: 'top 85%' },
        })
        return () => split.revert()
      })

      // This section's height changed after the data arrived, and its pin was created
      // after the sections below it: re-order and re-measure every trigger on the page.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    },
    { scope: root, dependencies: [projects], revertOnUpdate: true },
  )

  function tilt(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(e.currentTarget.querySelector('.work-visual'), {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
    })
  }

  function untilt(e: React.PointerEvent<HTMLAnchorElement>) {
    gsap.to(e.currentTarget.querySelector('.work-visual'), { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
  }

  const hasProjects = !!projects && projects.length > 0

  return (
    <section
      ref={root}
      id="work"
      className={`relative overflow-hidden py-24 ${hasProjects ? 'lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0' : ''}`}
    >
      <div className="container-px mb-12 flex items-end justify-between gap-6 lg:mb-10">
        <div>
          <span className="eyebrow">( 01 ) Previous work</span>
          <h2 className="work-title mt-4 font-display text-huge font-extrabold">Sites I’ve built</h2>
        </div>
        {hasProjects && projects.length > 1 && (
          <p className="hidden max-w-xs text-cream-muted lg:block">
            Landing pages and informational sites for real businesses. Keep scrolling — they slide by.
          </p>
        )}
      </div>

      {projects === null && (
        <div className="container-px">
          <div className="h-[40svh] animate-pulse rounded-[2rem] bg-ink-800 lg:w-[min(58vw,760px)]" />
        </div>
      )}

      {projects?.length === 0 && (
        <div className="container-px">
          <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-ink-900 p-8 sm:p-12">
            <Star className="h-14 w-14 text-lime" />
            <p className="max-w-lg font-display text-3xl font-bold tracking-tight">
              New projects are on their way. Want to see examples of what I’ve built?
            </p>
            <a
              href={whatsappLink('Hi Guitges! Could you show me some websites you’ve built?')}
              target="_blank"
              rel="noreferrer"
              className="pill-lime"
            >
              <MessageCircle size={18} /> Ask me on WhatsApp
            </a>
          </div>
        </div>
      )}

      {hasProjects && (
        <>
          <div ref={track} className="flex flex-col gap-6 px-4 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:px-12">
            {projects.map((p, i) => {
              const accent = accents[i % accents.length]
              const Shape = shapes[i % shapes.length]
              const src = imageUrl(p)
              return (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="work-card group block lg:w-[min(58vw,760px)]"
                  data-cursor="Visit"
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                >
                  <div
                    className={`work-visual relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] ${accentBg[accent]} lg:aspect-auto lg:h-[min(48svh,560px)]`}
                  >
                    {src ? (
                      // Browser-framed preview of the site's first screen
                      <div className="work-shape absolute inset-x-[7%] bottom-0 top-[15%] flex flex-col overflow-hidden rounded-t-2xl bg-cream shadow-2xl shadow-ink/40">
                        <div className="flex h-7 shrink-0 items-center gap-1.5 bg-ink px-3">
                          <span className="h-2 w-2 rounded-full bg-tangerine" />
                          <span className="h-2 w-2 rounded-full bg-lemon" />
                          <span className="h-2 w-2 rounded-full bg-lime" />
                          <span className="ml-2 truncate font-mono text-[10px] text-cream-dim">
                            {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </span>
                        </div>
                        <img
                          src={src}
                          alt={`Preview of ${p.title}`}
                          loading="lazy"
                          className="min-h-0 w-full flex-1 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : (
                      <Shape className="work-shape h-1/2 w-1/2 text-ink/90 transition-transform duration-500 group-hover:scale-110" />
                    )}
                    <span className="absolute left-6 top-5 font-mono text-sm text-ink/70">
                      {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                    </span>
                    <span className="absolute right-5 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                  <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div>
                      <h3 className="font-display text-3xl font-bold tracking-tight">{p.title}</h3>
                      {p.description && <p className="mt-1 max-w-md text-cream-muted">{p.description}</p>}
                      {p.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <span key={t} className="rounded-full border border-cream/15 px-3 py-1 font-mono text-xs text-cream-muted">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-3 font-mono text-xs uppercase tracking-widest text-cream-dim sm:block sm:text-right">
                      <p>{p.category}</p>
                      <p className="sm:mt-1">{p.year}</p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          <div className="container-px mt-10 hidden lg:block">
            <div className="h-1 overflow-hidden rounded-full bg-cream/10">
              <div className="work-progress h-full origin-left scale-x-0 bg-lime" />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
