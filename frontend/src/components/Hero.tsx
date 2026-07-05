import { motion } from 'framer-motion'
import { ArrowRight, MonitorSmartphone, Sparkles } from 'lucide-react'
import GradientBackdrop from './GradientBackdrop'
import logoFull from '../assets/guitges-icon.png'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-40 sm:pt-48">
      <GradientBackdrop variant="top" />

      <div className="container-px relative mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300">
              <Sparkles size={14} />
              Websites built for people & business
            </span>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              A modern website that makes people want to{' '}
              <span className="text-gradient">work with you.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-400">
              Guitges Studio designs and builds fast, beautiful, mobile-friendly websites for
              businesses and individuals — from first sketch to a live site your customers love,
              usually in under two weeks.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#contact" className="btn-primary">
                Start Your Website
                <ArrowRight size={18} />
              </a>
              <a href="#ai-concept" className="btn-secondary">
                <MonitorSmartphone size={18} />
                Try the Free AI Concept Tool
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
              <span>✓ Flat, transparent pricing</span>
              <span>✓ Launch in 5–10 days</span>
              <span>✓ Built with React</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-brand-gradient opacity-20 blur-3xl" />
            <div className="card relative overflow-hidden p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-1.5 border-b border-white/10 pb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-4 truncate rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400">
                  yourbusiness.com
                </span>
              </div>

              <div className="flex flex-col items-center py-10">
                <img
                  src={logoFull}
                  alt="Guitges Studio mark"
                  className="h-24 w-24 animate-float drop-shadow-[0_0_35px_rgba(109,140,245,0.45)]"
                />
                <div className="mt-6 h-2.5 w-40 rounded-full bg-gradient-to-r from-cyan-400/60 to-violet-500/60" />
                <div className="mt-3 h-2 w-28 rounded-full bg-white/10" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['Home', 'Services', 'Contact'].map((label) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/10 bg-white/[0.02] py-2.5 text-center text-xs text-slate-400"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="card absolute -right-6 -top-6 flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-300 shadow-lg"
            >
              ● Site live in 7 days
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="card absolute -bottom-6 -left-6 px-4 py-2.5 text-xs font-medium text-slate-300 shadow-lg"
            >
              📱 100% mobile-friendly
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
