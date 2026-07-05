import { motion } from 'framer-motion'
import {
  Building2,
  UserRound,
  Rocket,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import SectionHeading from './SectionHeading'
import { services } from '../lib/content'

const icons: Record<string, LucideIcon> = {
  Building2,
  UserRound,
  Rocket,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
}

export default function Services() {
  return (
    <section id="services" className="section relative">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="What we build"
          title="One studio, every website you'll ever need"
          description="Whether you're a company, a freelancer, or just getting started — we design and build the site that fits."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[service.icon]
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="card group p-7 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="inline-flex rounded-xl bg-brand-gradient p-3 text-ink-950 shadow-glow">
                  <Icon size={22} strokeWidth={2.25} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
