import Hero from '@/components/sections/Hero'
import LivePrices from '@/components/sections/LivePrices'
import Stats from '@/components/sections/Stats'
import About from '@/components/sections/About'

export default function Home() {
  return (
    <main>
      <Hero />
      <LivePrices />
      <Stats />
      <About />

      {/* Placeholder — remove as sessions complete */}
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm tracking-widest text-muted uppercase">
          Sessions 6 – 14 coming soon
        </p>
      </div>
    </main>
  )
}
