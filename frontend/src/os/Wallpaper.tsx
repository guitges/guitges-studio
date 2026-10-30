import type { CSSProperties } from 'react'
import type { WallpaperId } from './store'

// Every cloud is a handful of soft round puffs on a flat base; positions are fixed so the sky
// looks the same on every visit, like a real wallpaper would.
const CLOUDS: { top: number; left: number; scale: number; dur: number; puffs: [number, number, number][]; o: number }[] = [
  { top: 9, left: 6, scale: 1.25, dur: 260, o: 0.95, puffs: [[0, 30, 60], [40, 8, 90], [100, 0, 110], [170, 18, 80], [215, 34, 55]] },
  { top: 22, left: 52, scale: 0.9, dur: 320, o: 0.85, puffs: [[0, 26, 50], [30, 6, 76], [86, 0, 92], [146, 20, 64]] },
  { top: 5, left: 74, scale: 0.7, dur: 380, o: 0.75, puffs: [[0, 20, 46], [30, 0, 70], [84, 10, 60], [126, 24, 40]] },
  { top: 40, left: 20, scale: 1.6, dur: 300, o: 0.7, puffs: [[0, 34, 56], [36, 12, 84], [96, 0, 104], [168, 10, 92], [230, 30, 60], [270, 40, 40]] },
  { top: 54, left: 66, scale: 1.1, dur: 340, o: 0.6, puffs: [[0, 22, 50], [34, 4, 74], [92, 0, 84], [148, 18, 58]] },
  { top: 31, left: 88, scale: 0.55, dur: 420, o: 0.65, puffs: [[0, 16, 40], [24, 0, 60], [70, 10, 46]] },
]

export function Wallpaper({ id, mini, drift = false }: { id: WallpaperId; mini?: boolean; drift?: boolean }) {
  drift &&= !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <div className={`wp wp-${id} ${mini ? 'wp-mini' : ''} ${drift ? 'drift' : ''}`} aria-hidden="true">
      <div className="wp-sky" />
      <div className="wp-sun" />
      <div className="wp-rays" />
      {id !== 'classic' &&
        CLOUDS.map((c, i) => (
          <div
            key={i}
            className="cloud"
            style={
              {
                top: `${c.top}%`,
                left: `${c.left}%`,
                opacity: c.o,
                '--s': c.scale,
                '--dur': `${c.dur}s`,
                // Drifting clouds start off-screen at -40% and travel 180vw; start each one where it sits
                '--delay': `${-(((c.left + 40) / 180) * c.dur)}s`,
              } as CSSProperties
            }
          >
            {c.puffs.map(([x, y, r], j) => (
              <span key={j} className="puff" style={{ left: x, top: y, width: r, height: r }} />
            ))}
            <span className="cloud-base" />
          </div>
        ))}
      {id === 'meadow' && (
        <div className="hills">
          <div className="hill hill-back" />
          <div className="hill hill-front" />
        </div>
      )}
      {id !== 'classic' && (
        <div className="flare">
          <span />
          <span />
          <span />
        </div>
      )}
      <div className="wp-haze" />
      <div className="wp-grain" />
    </div>
  )
}
