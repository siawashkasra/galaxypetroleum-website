import Hero from '@/components/sections/Hero'
import LivePrices from '@/components/sections/LivePrices'
import Stats from '@/components/sections/Stats'

export default function Home() {
  return (
    <main>
      <Hero />
      <LivePrices />
      <Stats />

      {/* Placeholder — remove as sessions complete */}
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm tracking-widest text-muted uppercase">
          Sessions 5 – 14 coming soon
        </p>
      </div>
    </main>
  )
}
