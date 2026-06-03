import Hero from '@/components/sections/Hero'
import LivePrices from '@/components/sections/LivePrices'
import Stats from '@/components/sections/Stats'
import About from '@/components/sections/About'
import Journey from '@/components/sections/Journey'
import Commodities from '@/components/sections/Commodities'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import Network from '@/components/sections/Network'
import Team from '@/components/sections/Team'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <LivePrices />
      <Stats />
      <About />
      <Journey />
      <Commodities />
      <Services />
      <Projects />
      <Network />
      <Team />
      <Testimonials />
      <Contact />
    </main>
  )
}
