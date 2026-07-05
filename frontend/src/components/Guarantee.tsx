import { motion } from 'framer-motion'
import { ShieldCheck, RefreshCcw, Clock } from 'lucide-react'

const points = [
  {
    icon: ShieldCheck,
    title: 'Satisfaction guarantee',
    description: "If you're not happy with the initial design direction, we'll revise it until it fits — or refund your deposit.",
  },
  {
    icon: Clock,
    title: 'On-time delivery',
    description: 'We agree on a launch date up front and build a project plan to hit it.',
  },
  {
    icon: RefreshCcw,
    title: 'Free post-launch fixes',
    description: 'Every package includes a support window for bug fixes after you go live — on us.',
  },
]

export default function Guarantee() {
  return (
    <section className="section relative">
      <div className="container-px mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="card relative overflow-hidden p-10 sm:p-14"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                Our promise to you
              </span>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                Investing in a website should feel <span className="text-gradient">safe.</span>
              </h2>
              <p className="mt-4 text-slate-400">
                We build in the open with regular check-ins, so there are never any surprises —
                just a website you're proud to share.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {points.map((p) => (
                <div key={p.title}>
                  <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-300">
                    <p.icon size={20} />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">{p.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
