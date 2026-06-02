export default function Home() {
  return (
    <main>
      {/*
       * Sections are assembled here session by session.
       * Session 1  → Navbar
       * Session 2  → Hero
       * Session 3  → LivePrices
       * Session 4  → Stats
       * Session 5  → About
       * Session 6  → JourneyMap
       * Session 7  → Products
       * Session 8  → Services
       * Session 9  → Projects
       * Session 10 → Network
       * Session 11 → Team
       * Session 12 → Testimonials
       * Session 13 → Contact
       * Session 14 → Footer
       */}
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p
          className="font-display text-5xl tracking-widest text-gold"
          style={{ fontFamily: 'var(--font-bebas-neue)' }}
        >
          Galaxy Petroleum
        </p>
      </div>
    </main>
  )
}
