import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { process } from '../lib/content'

export default function Process() {
  return (
    <section id="process" className="section relative">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="From idea to live website in four steps"
          description="A clear, simple process — you'll always know exactly what happens next."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {process.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card relative p-7"
            >
              <span className="text-gradient font-display text-4xl font-bold">{item.step}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              {i < process.length - 1 && (
                <div className="absolute right-[-14px] top-1/2 hidden h-px w-7 -translate-y-1/2 bg-gradient-to-r from-white/20 to-transparent lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
