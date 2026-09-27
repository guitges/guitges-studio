import { useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { gsap, useGSAP, SplitText, MOTION_OK } from '../lib/gsap'
import { whatsapp, whatsappLink } from '../lib/content'
import { Star } from './Shapes'
import Magnetic from './Magnetic'

const projectTypes = ['Landing page (RM699)', 'Informational website', 'Something custom', 'Not sure yet']
const empty = { name: '', type: projectTypes[0], message: '' }

/** WhatsApp is the only contact channel: the form just drafts the first message. */
export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [form, setForm] = useState(empty)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const split = SplitText.create('.contact-title', { type: 'chars,lines', mask: 'lines', linesClass: 'split-line' })
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 10,
          stagger: 0.02,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.contact-title', start: 'top 80%' },
        })
        gsap.to('.contact-star', {
          rotate: 360,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.from('.contact-form > *', {
          y: 40,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-form', start: 'top 80%' },
        })
        return () => split.revert()
      })
    },
    { scope: root },
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const lines = [
      `Hi Guitges! I'm ${form.name.trim()}.`,
      `I'm interested in: ${form.type}.`,
      form.message.trim() && `\n${form.message.trim()}`,
    ]
    window.open(whatsappLink(lines.filter(Boolean).join('\n')), '_blank', 'noopener')
  }

  return (
    <section ref={root} id="contact" className="relative overflow-hidden py-24 sm:py-36">
      <div className="container-px">
        <span className="eyebrow">( 05 ) Contact</span>
        <div className="mt-4 flex items-start gap-4">
          <h2 className="contact-title font-display text-mega font-extrabold">
            Let’s build
            <br />
            your <span className="text-lime">site.</span>
          </h2>
          <Star className="contact-star mt-4 hidden h-24 w-24 shrink-0 text-bubblegum sm:block lg:h-40 lg:w-40" />
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-8">
            <p className="max-w-md text-lg text-cream-muted">
              Need a landing page or a simple website for your business? Message me on WhatsApp and I’ll reply
              with a flat quote — usually within a day.
            </p>
            <Magnetic strength={0.2}>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 font-display text-4xl font-bold tracking-tight sm:text-6xl"
                data-cursor="Chat"
              >
                <MessageCircle className="shrink-0 text-lime" size={44} />
                <span className="bg-gradient-to-r from-lime to-lime bg-[length:0%_4px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_4px]">
                  {whatsapp.display}
                </span>
              </a>
            </Magnetic>
            <p className="font-mono text-xs uppercase tracking-widest text-cream-dim">WhatsApp only · no calls, please</p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form grid gap-5">
            <label className="block">
              <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">Your name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field"
                placeholder="Aisyah"
              />
            </label>
            <fieldset>
              <legend className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    aria-pressed={form.type === t}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      form.type === t ? 'border-lime bg-lime text-ink' : 'border-cream/20 text-cream-muted hover:border-cream'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block">
              <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-cream-dim">About your business (optional)</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="field resize-none"
                placeholder="What does your business do, and what should the site help with?"
              />
            </label>
            <div>
              <button type="submit" className="pill-lime" data-cursor="Send">
                <MessageCircle size={18} /> Continue on WhatsApp <ArrowUpRight size={18} />
              </button>
              <p className="mt-3 text-sm text-cream-dim">Opens WhatsApp with your message ready to send.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
