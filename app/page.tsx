import Hero from '@/components/sections/Hero'
import LivePrices from '@/components/sections/LivePrices'

export default function Home() {
  return (
    <main>
      <Hero />
      <LivePrices />

      {/* Placeholder — remove as sessions complete */}
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm tracking-widest text-muted uppercase">
          Sessions 4 – 14 coming soon
        </p>
      </div>
    </main>
  )
}
