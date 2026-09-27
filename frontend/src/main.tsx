import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Admin from './admin/Admin.tsx'
import { ScrollTrigger } from './lib/gsap'

const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin'

if (!isAdmin) {
  // Always start at the top so the intro plays over the hero
  ScrollTrigger.clearScrollMemory('manual')
  window.scrollTo(0, 0)
}

createRoot(document.getElementById('root')!).render(<StrictMode>{isAdmin ? <Admin /> : <App />}</StrictMode>)
