import { motion } from 'framer-motion'

interface Props {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
}

export default function SectionHeading({ eyebrow, title, description, align = 'center' }: Props) {
  const isCenter = align === 'center'
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {eyebrow && (
        <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-slate-400 sm:text-lg">{description}</p>}
    </motion.div>
  )
}
