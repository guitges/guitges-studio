import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Draggable, InertiaPlugin, useGSAP)

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Draggable, useGSAP }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Scroll to an in-page anchor, going through ScrollSmoother when it's active. */
export function scrollToHash(hash: string) {
  const smoother = ScrollSmoother.get()
  if (smoother) {
    smoother.scrollTo(hash === '#top' ? 0 : hash, true, 'top top')
  } else if (hash === '#top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }
}
