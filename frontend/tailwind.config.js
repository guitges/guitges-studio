/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070d',
          900: '#0a0e1a',
          800: '#0f1424',
          700: '#161b30',
        },
        cyan: {
          400: '#4dd8f0',
          500: '#22c3e8',
        },
        violet: {
          500: '#7c5cff',
          600: '#6d3bf0',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(115deg, #4dd8f0 0%, #6d8cf5 45%, #8b5cf6 100%)',
        'brand-radial': 'radial-gradient(circle at 50% 0%, rgba(109,140,245,0.25), rgba(5,7,13,0) 60%)',
      },
      boxShadow: {
        glow: '0 0 60px -15px rgba(109,140,245,0.55)',
      },
      animation: {
        'blob-slow': 'blob 18s infinite ease-in-out',
        float: 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 1.5s',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-25px, 25px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
      },
    },
  },
  plugins: [],
}
