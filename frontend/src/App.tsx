import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TechMarquee from './components/TechMarquee'
import Services from './components/Services'
import WhyUs from './components/WhyUs'
import Process from './components/Process'
import Portfolio from './components/Portfolio'
import AiConceptTool from './components/AiConceptTool'
import Pricing from './components/Pricing'
import Guarantee from './components/Guarantee'
import FAQ from './components/FAQ'
import ContactCTA from './components/ContactCTA'
import Footer from './components/Footer'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <Services />
        <WhyUs />
        <Process />
        <Portfolio />
        <AiConceptTool />
        <Pricing />
        <Guarantee />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
