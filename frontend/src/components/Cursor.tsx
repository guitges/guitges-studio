import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/**
 * A blended dot that trails the pointer. Elements with `data-cursor="Label"`
 * grow it into a labelled bubble; `data-cursor=""` just grows it.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useGSAP(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current!
    document.documentElement.classList.add('has-cursor')

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    let shown = false

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY })
        gsap.to(el, { autoAlpha: 1, duration: 0.3 })
        shown = true
      }
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onOver = (e: PointerEvent) => {
      el.classList.toggle('cursor-dark', !!(e.target as HTMLElement).closest('[data-cursor-dark]'))
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button')
      if (!target) {
        setLabel('')
        gsap.to(el, { scale: 1, duration: 0.3, ease: 'power3' })
        return
      }
      const text = target.dataset.cursor ?? ''
      setLabel(text)
      gsap.to(el, { scale: text ? 5 : 2.4, duration: 0.4, ease: 'back.out(2)' })
    }

    const onLeave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 })
      shown = false
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerleave', onLeave)
    }
  })

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none invisible fixed left-0 top-0 z-[100] -ml-2.5 -mt-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-lime opacity-0 transition-colors [&.cursor-dark]:bg-ink [&.cursor-dark_span]:text-cream"
    >
      <span className="whitespace-nowrap font-display text-[3.5px] font-bold uppercase tracking-wide text-ink">
        {label}
      </span>
    </div>
  )
}
