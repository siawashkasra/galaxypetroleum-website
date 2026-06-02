export default function Home() {
  return (
    <main>
      {/* Dark hero placeholder — tests navbar transparent state */}
      <section className="relative flex min-h-dvh items-center justify-center bg-ink-secondary">
        <p
          className="text-center text-6xl text-white/20"
          style={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.1em' }}
        >
          Hero — Session 2
        </p>
      </section>

      {/* Light section placeholder — tests navbar scrolled state */}
      <section className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-center text-2xl text-muted">
          Scroll down to see navbar transition
        </p>
      </section>
    </main>
  )
}
