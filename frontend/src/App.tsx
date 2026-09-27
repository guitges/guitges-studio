import { useState } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Work from './components/Work'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Playground from './components/Playground'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [ready, setReady] = useState(false)

  return (
    <>
      <SmoothScroll />
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero ready={ready} />
            <Marquee />
            <Work />
            <Services />
            <Pricing />
            <About />
            <Playground />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
