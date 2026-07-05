import { motion } from 'framer-motion'
import { Zap, Smartphone, Cpu, Search, Wallet, MessageCircle, type LucideIcon } from 'lucide-react'
import SectionHeading from './SectionHeading'
import GradientBackdrop from './GradientBackdrop'
import { whyUs } from '../lib/content'

const icons: Record<string, LucideIcon> = { Zap, Smartphone, Cpu, Search, Wallet, MessageCircle }

export default function WhyUs() {
  return (
    <section className="section relative overflow-hidden">
      <GradientBackdrop />
      <div className="container-px relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Guitges"
          title="Designed to convince, built to last"
          description="Everything about the process is built around one goal: a website that makes your business look as good as it actually is."
        />

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, i) => {
            const Icon = icons[item.icon]
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="flex gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
