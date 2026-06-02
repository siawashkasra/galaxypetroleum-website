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

      {/* Placeholder — remove as sessions complete */}
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm tracking-widest text-muted uppercase">
          Sessions 12 – 14 coming soon
        </p>
      </div>
    </main>
  )
}
