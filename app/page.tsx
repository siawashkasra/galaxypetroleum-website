import Hero from '@/components/sections/Hero'
import LivePrices from '@/components/sections/LivePrices'
import Stats from '@/components/sections/Stats'
import About from '@/components/sections/About'
import JourneyMap from '@/components/sections/JourneyMap'
import Products from '@/components/sections/Products'
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
      <JourneyMap />
      <Products />
      <Services />
      <Projects />
      <Network />
      <Team />
      <Testimonials />
      <Contact />

      {/* Placeholder — remove as sessions complete */}
      <div className="flex min-h-[20vh] items-center justify-center bg-background">
        <p className="text-sm tracking-widest text-muted uppercase">
          Session 14 — Footer coming soon
        </p>
      </div>
    </main>
  )
}
