import type { SVGProps } from 'react'

type ShapeProps = SVGProps<SVGSVGElement>

// Playful solid shapes; they take their color from `currentColor`.

export function Star(props: ShapeProps) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" aria-hidden {...props}>
      <path d="M100 0c6 52 22 78 100 100-78 22-94 48-100 100-6-52-22-78-100-100C78 78 94 52 100 0Z" />
    </svg>
  )
}

export function Flower(props: ShapeProps) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" aria-hidden {...props}>
      <path d="M100 0a50 50 0 0 1 50 50 50 50 0 1 1 0 100 50 50 0 1 1-100 0A50 50 0 1 1 50 50 50 50 0 0 1 100 0Z" />
    </svg>
  )
}

export function Blob(props: ShapeProps) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" aria-hidden {...props}>
      <path d="M160 34c26 24 38 64 26 98s-50 62-92 64S14 174 6 136 12 52 44 28 134 10 160 34Z" />
    </svg>
  )
}

export function Pill(props: ShapeProps) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" aria-hidden {...props}>
      <rect x="0" y="55" width="200" height="90" rx="45" />
    </svg>
  )
}

export function Ring(props: ShapeProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="34" aria-hidden {...props}>
      <circle cx="100" cy="100" r="80" />
    </svg>
  )
}

export function Squiggle(props: ShapeProps) {
  return (
    <svg
      viewBox="0 0 240 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="18"
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path d="M12 40c24-36 48-36 72 0s48 36 72 0 48-36 72 0" />
    </svg>
  )
}

export function Plus(props: ShapeProps) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" aria-hidden {...props}>
      <path d="M70 0h60v70h70v60h-70v70H70v-70H0V70h70Z" />
    </svg>
  )
}
