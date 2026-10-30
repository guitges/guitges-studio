import { useId } from 'react'

/** Baihaqi.exe's own mark: a small glossy world, sky over grass, with one cloud. */
export function Logo({ size = 24, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9ff" />
          <stop offset="0.55" stopColor="#3d9cf0" />
          <stop offset="0.56" stopColor="#8fd65f" />
          <stop offset="1" stopColor="#2d8a2f" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx="0.35" cy="0.25" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill={`url(#${id}s)`} stroke="#14508f" strokeWidth="1.2" />
      <path d="M9 13.5a3 3 0 0 1 3.2-3 4 4 0 0 1 7.4.6 2.6 2.6 0 0 1 .4 5.2H10a2.4 2.4 0 0 1-1-2.8z" fill="#fff" />
      <circle cx="23.5" cy="8.5" r="2.2" fill="#ffe27a" />
      <ellipse cx="13" cy="9" rx="9" ry="6" fill={`url(#${id}g)`} />
    </svg>
  )
}
