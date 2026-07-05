import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Mail, MessageSquare, Send } from 'lucide-react'
import SectionHeading from './SectionHeading'
import GradientBackdrop from './GradientBackdrop'
import { sendContact } from '../lib/api'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactCTA() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', business: '', package: 'Business', message: '' })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendContact(form)
      setStatus('success')
      setForm({ name: '', email: '', business: '', package: 'Business', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="section relative overflow-hidden">
      <GradientBackdrop />
      <div className="container-px relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Let's talk"
          title="Ready for a website you're proud to share?"
          description="Tell us a bit about your business and we'll reply with next steps — usually within one business day."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-gradient p-2.5 text-ink-950">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email us directly</p>
                  <p className="text-sm font-medium text-white">hello@guitges.studio</p>
                </div>
              </div>
            </div>
            <div className="card p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-gradient p-2.5 text-ink-950">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Response time</p>
                  <p className="text-sm font-medium text-white">Within 1 business day</p>
                </div>
              </div>
            </div>
            <p className="px-1 text-sm text-slate-500">
              Not ready to commit? Try the free AI concept tool above first — no email required.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="card grid gap-5 p-7 sm:grid-cols-2"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Your name</label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="jane@company.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Business (optional)</label>
              <input
                value={form.business}
                onChange={(e) => update('business', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="Company or project name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Interested package</label>
              <select
                value={form.package}
                onChange={(e) => update('package', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              >
                <option className="bg-ink-900">Starter</option>
                <option className="bg-ink-900">Business</option>
                <option className="bg-ink-900">Premium</option>
                <option className="bg-ink-900">Not sure yet</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Tell us about your project</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                placeholder="What does your business do, and what would you like your website to achieve?"
              />
            </div>

            <div className="sm:col-span-2">
              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-60">
                {status === 'sending' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
              {status === 'success' && (
                <p className="mt-3 text-sm text-emerald-400">
                  Thanks! We've received your message and will reply soon.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-sm text-rose-400">
                  Something went wrong sending your message. Please email hello@guitges.studio directly.
                </p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
