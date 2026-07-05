import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Loader2, ArrowRight, Bot } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { generateConcept, type ConceptResponse } from '../lib/api'

const types = ['Business / Company', 'Personal / Portfolio', 'Restaurant / Café', 'Online Store', 'Other']

export default function AiConceptTool() {
  const [business, setBusiness] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState(types[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ConceptResponse | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!business.trim() || !description.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await generateConcept({ business, description, type })
      setResult(data)
    } catch {
      setError('Something went wrong generating your concept. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="ai-concept" className="section relative">
      <div className="container-px mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Free AI tool"
          title="Get an instant website concept for your business"
          description="Describe your business in a sentence — our AI drafts a suggested site structure, tagline, and color mood in seconds."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="card space-y-5 p-7"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Business or project name</label>
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="e.g. Kopi Senja Coffee House"
                maxLength={80}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">What type of site is it?</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              >
                {types.map((t) => (
                  <option key={t} value={t} className="bg-ink-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Describe it in a sentence or two
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A cozy neighborhood coffee shop with pastries, free wifi, and weekend live music."
                required
                rows={4}
                maxLength={400}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating your concept…
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  Generate Free Concept
                </>
              )}
            </button>
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card relative flex min-h-[420px] flex-col justify-center overflow-hidden p-7"
          >
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-center text-slate-500"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Bot size={32} className="text-cyan-300" />
                  </div>
                  <p className="max-w-xs text-sm">
                    Your website concept will appear here — pages, sections, tagline ideas, and a color
                    mood, generated in seconds.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 text-slate-400"
                >
                  <Loader2 size={28} className="animate-spin text-cyan-300" />
                  <p className="text-sm">Thinking about the best structure for you…</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                      Suggested tagline
                    </span>
                    <p className="mt-1.5 font-display text-xl font-semibold text-white">
                      “{result.tagline}”
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">Pages</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.pages.map((p) => (
                        <span key={p} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                      Homepage sections
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.sections.map((s) => (
                        <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                      Color mood: {result.colorMood}
                    </span>
                    <div className="mt-2 flex gap-2">
                      {result.colorHex.map((c) => (
                        <span
                          key={c}
                          className="h-8 w-8 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                    <p className="text-sm text-slate-300">{result.nextStep}</p>
                    <a
                      href="#contact"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                    >
                      Turn this into a real website <ArrowRight size={15} />
                    </a>
                  </div>

                  {result.source === 'template' && (
                    <p className="text-[11px] text-slate-600">
                      Generated instantly by our concept engine.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
