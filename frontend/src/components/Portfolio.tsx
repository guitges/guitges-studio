import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { portfolioExamples } from '../lib/content'

export default function Portfolio() {
  return (
    <section id="work" className="section relative">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Example concepts"
          title="A taste of what your website could look like"
          description="Illustrative concepts we've mocked up to show the range of styles we design — your final site is built uniquely around your brand."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {portfolioExamples.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="card group overflow-hidden"
            >
              <div className={`relative h-48 bg-gradient-to-br ${item.accent} p-5`}>
                <div className="absolute inset-3 rounded-lg border border-white/25 bg-black/10 backdrop-blur-sm" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                    <span className="h-2 w-2 rounded-full bg-white/60" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 w-2/3 rounded-full bg-white/70" />
                    <div className="h-2 w-1/3 rounded-full bg-white/40" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                  {item.label}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.name}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{item.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Want to see a concept for your own business?{' '}
          <a href="#ai-concept" className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200">
            Try the free AI concept tool below ↓
          </a>
        </p>
      </div>
    </section>
  )
}
