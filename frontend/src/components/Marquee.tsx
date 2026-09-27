import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from '../lib/gsap'
import { skills } from '../lib/content'
import { Star } from './Shapes'

const colors = ['text-lime', 'text-lilac', 'text-tangerine', 'text-bubblegum', 'text-sky']
const inkStars = ['text-ink']

function Row({ reverse = false, tilt, stars }: { reverse?: boolean; tilt: string; stars: string[] }) {
  const items = reverse ? [...skills].reverse() : skills
  return (
    <div className={`marquee-row overflow-hidden py-5 ${tilt}`} data-reverse={reverse || undefined}>
      <div className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((s, i) => (
              <span key={s} className="flex items-center font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
                <span className="px-6">{s}</span>
                <Star className={`h-8 w-8 sm:h-10 sm:w-10 ${stars[i % stars.length]}`} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Two skill ribbons that loop forever and speed up / flip with your scroll. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const loops = gsap.utils.toArray<HTMLElement>('.marquee-row').map((row) => {
          const reverse = row.hasAttribute('data-reverse')
          const track = row.querySelector('.marquee-track')
          const loop = gsap.fromTo(
            track,
            { xPercent: reverse ? -50 : 0 },
            { xPercent: reverse ? 0 : -50, duration: 28, ease: 'none', repeat: -1 },
          )
          // Start deep into the repeats so a negative timeScale can run backwards for ages
          return loop.totalTime(28 * 1000)
        })

        let direction = 1
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (self.direction !== direction) direction = self.direction
            const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 250)
            loops.forEach((loop) => {
              gsap.to(loop, { timeScale: boost * direction, duration: 0.2, overwrite: true })
              gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, ease: 'power2.out' })
            })
          },
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative overflow-hidden py-16" aria-label="Skills">
      <Row tilt="-rotate-2 bg-lime text-ink" stars={inkStars} />
      <Row reverse tilt="rotate-1 -mt-2 bg-ink-800 text-cream" stars={colors} />
    </div>
  )
}
