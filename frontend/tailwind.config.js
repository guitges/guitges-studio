/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0e100f',
          900: '#141615',
          800: '#1c1f1d',
          700: '#2a2d2b',
        },
        cream: {
          DEFAULT: '#fffce1',
          muted: '#b6b4a2',
          dim: '#7c7b6f',
        },
        lime: '#0ae448',
        lilac: '#9d95ff',
        tangerine: '#ff8709',
        bubblegum: '#fec5fb',
        sky: '#00bae2',
        lemon: '#f5e14a',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        mega: ['clamp(3.25rem, min(13vw, 19svh), 13rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        huge: ['clamp(2.5rem, min(8vw, 13svh), 7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
      },
    },
  },
  plugins: [],
}
