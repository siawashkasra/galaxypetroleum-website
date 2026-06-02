import Hero from '@/components/sections/Hero'

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Placeholder — remove as sessions complete */}
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm tracking-widest text-muted uppercase">
          Sessions 3 – 14 coming soon
        </p>
      </div>
    </main>
  )
}
