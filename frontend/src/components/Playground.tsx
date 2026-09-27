import { useRef } from 'react'
import { gsap, useGSAP, Draggable } from '../lib/gsap'
import { Star, Flower, Blob, Pill, Ring, Plus, Squiggle } from './Shapes'

const toys = [
  { Shape: Flower, color: 'text-tangerine', size: 'h-28 w-28 sm:h-36 sm:w-36', pos: 'left-[8%] top-[18%]' },
  { Shape: Star, color: 'text-lime', size: 'h-24 w-24 sm:h-32 sm:w-32', pos: 'left-[30%] top-[52%]' },
  { Shape: Blob, color: 'text-lilac', size: 'h-28 w-28 sm:h-40 sm:w-40', pos: 'right-[10%] top-[14%]' },
  { Shape: Pill, color: 'text-sky', size: 'h-24 w-24 sm:h-36 sm:w-36', pos: 'left-[52%] top-[18%]' },
  { Shape: Ring, color: 'text-bubblegum', size: 'h-20 w-20 sm:h-28 sm:w-28', pos: 'right-[26%] bottom-[12%]' },
  { Shape: Plus, color: 'text-lemon', size: 'h-16 w-16 sm:h-24 sm:w-24', pos: 'left-[12%] bottom-[10%]' },
  { Shape: Squiggle, color: 'text-cream', size: 'h-12 w-32 sm:h-14 sm:w-44', pos: 'right-[6%] bottom-[38%]' },
]

/** A box of shapes you can fling around — inertia and bounds courtesy of GSAP. */
export default function Playground() {
  const root = useRef<HTMLElement>(null)
  const box = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.toy', {
        scale: 0,
        rotate: () => gsap.utils.random(-180, 180),
        duration: 1.2,
        ease: 'elastic.out(1, 0.45)',
        stagger: { each: 0.08, from: 'random' },
        scrollTrigger: { trigger: box.current, start: 'top 75%' },
      })

      Draggable.create('.toy', {
        bounds: box.current,
        inertia: true,
        edgeResistance: 0.7,
        zIndexBoost: true,
        onPress() {
          gsap.to(this.target, { scale: 1.15, duration: 0.2 })
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
        },
        onClick() {
          gsap.to(this.target.firstElementChild, { rotate: '+=360', duration: 0.8, ease: 'back.out(1.6)' })
        },
      })
    },
    { scope: root },
  )

  function shuffle() {
    const bounds = box.current!.getBoundingClientRect()
    gsap.utils.toArray<HTMLElement>('.toy').forEach((toy) => {
      const r = toy.getBoundingClientRect()
      const drag = Draggable.get(toy)
      gsap.to(toy, {
        x: `+=${gsap.utils.random(bounds.left - r.left, bounds.right - r.right)}`,
        y: `+=${gsap.utils.random(bounds.top - r.top, bounds.bottom - r.bottom)}`,
        rotate: gsap.utils.random(-45, 45),
        duration: 1,
        ease: 'expo.inOut',
        onUpdate: () => drag?.update(),
      })
    })
  }

  return (
    <section ref={root} id="play" className="relative py-24 sm:py-36">
      <div className="container-px">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">( ✦ ) Break time</span>
            <h2 className="mt-4 font-display text-huge font-extrabold">
              Go on, <span className="italic text-lime">play.</span>
            </h2>
            <p className="mt-4 max-w-md text-cream-muted">
              Nothing to sell here, just shapes. Grab one, fling it, tap to spin — then let’s talk about your site.
            </p>
          </div>
          <button onClick={shuffle} className="pill-ghost" data-cursor="Mix">
            Shuffle shapes
          </button>
        </div>

        <div
          ref={box}
          className="relative mt-12 h-[60vh] min-h-[380px] overflow-hidden rounded-[2.5rem] border border-cream/10 bg-ink-900 [background-image:radial-gradient(rgba(255,252,225,0.1)_1px,transparent_1px)] [background-size:28px_28px]"
        >
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-4xl font-extrabold text-cream/5 sm:text-8xl">
            drag me
          </p>
          {toys.map(({ Shape, color, size, pos }, i) => (
            <div key={i} className={`toy absolute touch-none ${pos} ${size} ${color}`} data-cursor="Drag">
              <Shape className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
