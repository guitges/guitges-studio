import { useRef } from 'react'
import { gsap, useGSAP, SplitText, MOTION_OK } from '../lib/gsap'
import { profile, stats } from '../lib/content'
import { Blob } from './Shapes'
import portrait from '../assets/guitges-icon.png'

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Words light up one by one as you scroll through the paragraph
        const split = SplitText.create('.about-text', { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        )

        gsap.from('.about-stat', {
          y: 60,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
        })

        gsap.to('.about-blob', {
          rotate: 200,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })

        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative py-24 sm:py-36">
      <div className="container-px grid gap-14 lg:grid-cols-[0.8fr_2fr]">
        <div className="flex flex-col items-start gap-6">
          <span className="eyebrow">( 04 ) About me</span>
          <div className="relative mt-4 h-48 w-48 sm:h-56 sm:w-56" data-cursor="Hi!">
            <Blob className="about-blob absolute inset-0 h-full w-full text-lilac" />
            <img src={portrait} alt={profile.name} className="relative h-full w-full scale-75 object-contain" />
          </div>
        </div>

        <div>
          <p className="about-text font-display text-3xl font-semibold leading-[1.2] tracking-tight sm:text-5xl">
            {profile.about}
          </p>

          <div className="about-stats mt-16 grid gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`about-stat rounded-3xl p-6 text-ink ${['bg-lime', 'bg-bubblegum', 'bg-sky'][i % 3]}`}
              >
                <p className="font-display text-5xl font-extrabold tracking-tight">{s.value}</p>
                <p className="mt-2 text-sm font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
