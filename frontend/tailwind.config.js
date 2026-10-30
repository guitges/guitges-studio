/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // the endless poolrooms
        pool: '#B9F3F3', // pool cyan
        mist: '#E6FAF7', // water mist
        sun: '#FFF3D9', // warm sunlight
        deep: '#244E63', // deep pool blue
        tile: '#F8FCFA', // white tile
        aqua: {
          DEFAULT: '#7FD6D3', // muted aqua accent
          soft: '#CDEFEE',
          dark: '#2F7F87',
        },
        exit: '#2E7D68', // the green of exit signs, muted
        ink: {
          DEFAULT: '#161E20', // text
          soft: '#4B5856', // secondary text
          faint: '#6B7775', // labels
        },
        paper: { DEFAULT: '#ECEEEB', 2: '#E2E6E3' }, // white tile, in daylight
        line: 'rgba(22, 30, 32, 0.14)',
        water: '#2C6A6E',
        // older names, still used by /admin and the concept apps
        faded: '#8CCFD0',
        lavender: '#CDEFEE',
        wallpaper: '#FFF3D9',
        distant: '#B9F3F3',
        fluorescent: '#F8FCFA',
      },
      fontFamily: {
        display: ['Syne', '"Arial Black"', 'sans-serif'],
        serif: ['Syne', '"Arial Black"', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        // no monospace on this site: anything that asks for it gets DM Sans
        mono: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        window: '0 1px 0 rgba(255,255,255,0.8) inset, 0 18px 50px -24px rgba(36, 78, 99, 0.45)',
        note: '0 2px 3px rgba(36, 78, 99, 0.08), 0 22px 40px -22px rgba(36, 78, 99, 0.4)',
        tile: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -2px 0 rgba(36,78,99,0.08), 0 1px 2px rgba(36,78,99,0.12)',
        sign: '0 1px 0 rgba(255,255,255,0.9) inset, 0 -2px 0 rgba(36,78,99,0.12) inset, 0 10px 22px -12px rgba(36,78,99,0.55)',
      },
      transitionTimingFunction: {
        dream: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        water: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
}
