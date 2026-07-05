import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { pricing } from '../lib/content'

export default function Pricing() {
  return (
    <section id="pricing" className="section relative">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, flat pricing — no surprises"
          description="Every project is a one-time flat price. Need something custom? We'll tailor a quote to fit."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {pricing.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-8 ${
                tier.highlight
                  ? 'card border-cyan-400/30 bg-white/[0.06] shadow-glow'
                  : 'card'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-4 py-1 text-xs font-semibold text-ink-950">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-white">{tier.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-sm text-slate-500">{tier.cadence}</span>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-cyan-300" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={tier.highlight ? 'btn-primary mt-8 w-full' : 'btn-secondary mt-8 w-full'}
              >
                Choose {tier.name}
              </a>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Prices shown in USD as a starting reference — happy to quote in your local currency.
        </p>
      </div>
    </section>
  )
}
