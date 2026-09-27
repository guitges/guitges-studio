import { useRef } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { pricing, pricingNotes, whatsappLink } from '../lib/content'
import { Star } from './Shapes'
import Magnetic from './Magnetic'

export default function Pricing() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('.price-card', {
          y: 100,
          rotate: (i: number) => (i % 2 ? 4 : -4),
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '.price-grid', start: 'top 80%' },
        })
        gsap.to('.price-star', { rotate: 360, duration: 10, ease: 'none', repeat: -1 })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="pricing" className="relative py-24 sm:py-36">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">( 03 ) Pricing</span>
            <h2 className="mt-4 font-display text-huge font-extrabold">
              Pay once. <span className="italic text-lime">It’s yours.</span>
            </h2>
          </div>
          <p className="max-w-sm text-cream-muted">
            Flat, one-time prices in RM, agreed up front. No subscriptions, no surprise invoices.
          </p>
        </div>

        <div className="price-grid mt-16 grid max-w-5xl gap-6 md:grid-cols-2">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`price-card relative flex flex-col rounded-[2rem] p-8 ${
                plan.highlight ? 'bg-lime text-ink' : 'border border-cream/10 bg-ink-900'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 right-6 flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-lime">
                  <Star className="price-star h-3.5 w-3.5" /> Fixed price
                </span>
              )}
              <h3 className="font-display text-2xl font-bold tracking-tight">{plan.name}</h3>
              <p className={`mt-2 text-sm ${plan.highlight ? 'text-ink/75' : 'text-cream-muted'}`}>{plan.description}</p>
              <p className="mt-8 font-display text-6xl font-extrabold tracking-tight">{plan.price}</p>
              <p className={`mt-1 font-mono text-xs uppercase tracking-widest ${plan.highlight ? 'text-ink/60' : 'text-cream-dim'}`}>
                {plan.priceNote}
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={16} className={`mt-0.5 shrink-0 ${plan.highlight ? '' : 'text-lime'}`} /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Magnetic strength={0.2}>
                  <a
                    href={whatsappLink(plan.message)}
                    target="_blank"
                    rel="noreferrer"
                    className={plan.highlight ? 'pill bg-ink text-cream hover:bg-cream hover:text-ink' : 'pill-ghost'}
                  >
                    {plan.cta} <ArrowUpRight size={18} />
                  </a>
                </Magnetic>
              </div>
            </article>
          ))}
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-cream-dim">
          {pricingNotes.map((n) => (
            <li key={n}>✦ {n}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
