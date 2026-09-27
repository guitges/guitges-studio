import { gsap, useGSAP, ScrollSmoother, MOTION_OK } from '../lib/gsap'

/**
 * Creates the ScrollSmoother. Render it before the page content: its layout
 * effect then runs before the sections', so pinned ScrollTriggers see the smoother.
 */
export default function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        effects: true,
        smoothTouch: false,
      })
    })
  })
  return null
}
