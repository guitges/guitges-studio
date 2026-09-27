import { useRef } from 'react'
import { Check } from 'lucide-react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { services, accentBg } from '../lib/content'
import { Star, Flower, Blob, Plus } from './Shapes'

const icons = [Star, Blob, Flower, Plus]

/** Cards pin in place and the next one slides over, shrinking the one below. */
export default function Services() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>('.service-card')
        cards.forEach((card, i) => {
          gsap.from(card.querySelector('.service-icon'), {
            rotate: -180,
            scale: 0,
            duration: 1,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: card, start: 'top 75%' },
          })
          if (i === cards.length - 1) return
          // ScrollSmoother transforms the page, so CSS sticky won't work; pin instead
          ScrollTrigger.create({
            trigger: card,
            start: 'top 12%',
            endTrigger: cards[cards.length - 1],
            end: 'top 12%',
            pin: true,
            pinSpacing: false,
          })
          gsap.to(card, {
            scale: 0.88,
            rotate: i % 2 ? 2 : -2,
            filter: 'brightness(0.55)',
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top 15%',
              scrub: true,
            },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="services" className="relative py-24 sm:py-36">
      <div className="container-px">
        <span className="eyebrow">( 02 ) What I do</span>
        <h2 className="mt-4 max-w-4xl font-display text-huge font-extrabold">
          Simple sites, <span className="italic text-tangerine">done properly</span>
        </h2>

        <div className="mt-16">
          {services.map((s, i) => {
            const Icon = icons[i % icons.length]
            return (
              <article
                key={s.title}
                style={{ zIndex: i + 1 }}
                className={`service-card relative mb-8 grid min-h-[60vh] origin-top gap-10 rounded-[2.5rem] p-8 text-ink sm:p-12 md:grid-cols-[1fr_auto] ${accentBg[s.accent]}`}
              >
                <div className="flex flex-col justify-between gap-10">
                  <div>
                    <span className="font-mono text-sm">0{i + 1}</span>
                    <h3 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">{s.title}</h3>
                    <p className="mt-4 max-w-lg text-lg">{s.description}</p>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-1.5 rounded-full bg-ink/10 px-4 py-2 text-sm font-medium">
                        <Check size={14} /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Icon className="service-icon h-28 w-28 self-start text-ink sm:h-44 sm:w-44 md:self-center" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
