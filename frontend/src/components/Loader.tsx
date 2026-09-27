import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import { Star } from './Shapes'

/** Intro screen: counts to 100, then wipes up to reveal the page. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const counter = { v: 0 }
      const quick = prefersReducedMotion()
      const tl = gsap.timeline()

      tl.to('.loader-star', { rotate: 360, duration: quick ? 0.2 : 1.8, ease: 'power2.inOut' }, 0)
        .to(
          counter,
          {
            v: 100,
            duration: quick ? 0.2 : 1.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v))
            },
          },
          0,
        )
        .to('.loader-bar', { scaleX: 1, duration: quick ? 0.2 : 1.8, ease: 'power2.inOut' }, 0)
        .add(onDone)
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
        .set(root.current, { display: 'none' })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-lime p-4 text-ink sm:p-8"
      aria-hidden
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em]">
        <span>guitges — portfolio</span>
        <span>technology for tomorrow</span>
      </div>
      <Star className="loader-star mx-auto h-24 w-24 sm:h-32 sm:w-32" />
      <div>
        <div className="flex items-end justify-between">
          <span className="font-display text-mega font-extrabold">
            <span ref={count}>0</span>
          </span>
          <span className="mb-4 font-display text-4xl font-extrabold sm:text-6xl">%</span>
        </div>
        <div className="loader-bar mt-4 h-1.5 origin-left scale-x-0 rounded-full bg-ink" />
      </div>
    </div>
  )
}
