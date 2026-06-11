'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Testimonial } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const AUTO_ADVANCE_MS = 5500

/* ─── Slide variants ─────────────────────────────────────────── */

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.35, ease: EASE },
  }),
}

/* ─── Section ────────────────────────────────────────────────── */

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent]     = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused]       = useState(false)
  const prefersReducedMotion      = useReducedMotion()
  const total = testimonials.length

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
  }, [])

  const next = useCallback(() => {
    goTo((current + 1) % total, 1)
  }, [current, total, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total, -1)
  }, [current, total, goTo])

  // Auto-advance
  useEffect(() => {
    if (paused || prefersReducedMotion) return
    const id = setInterval(next, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [paused, prefersReducedMotion, next])

  const active = testimonials[current]

  if (!active) return null

  return (
    <section
      id="testimonials"
      aria-label="Client testimonials"
      style={{ background: '#0C0C0A' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">

        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
              Client Testimonials
            </p>
            <h2
              className="text-white"
              style={{
                fontFamily: 'var(--font-bebas-neue)',
                fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                letterSpacing: '0.02em',
                lineHeight: 0.95,
              }}
            >
              Trusted by
              <br />
              <span style={{ color: 'var(--color-gold)' }}>
                Afghanistan&rsquo;s Best
              </span>
            </h2>
          </motion.div>

          {/* Prev / Next arrows */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/50 transition-all duration-300 hover:border-gold/50 hover:text-gold"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/50 transition-all duration-300 hover:border-gold/50 hover:text-gold"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

        {/* Quote block */}
        <div className="relative min-h-[260px] overflow-hidden lg:min-h-[220px]">

          {/* Decorative opening mark */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 left-0 select-none leading-none text-gold/15"
            style={{ fontSize: 'clamp(6rem, 12vw, 10rem)', fontFamily: 'Georgia, serif', lineHeight: 0.8 }}
          >
            &ldquo;
          </span>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.blockquote
              key={active.id}
              custom={direction}
              variants={prefersReducedMotion ? undefined : variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative pl-0 lg:pl-4"
            >
              {/* Quote */}
              <p
                className="mb-10 text-white/80"
                style={{
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
                  lineHeight: 1.75,
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  maxWidth: '820px',
                }}
              >
                {active.quote}
              </p>

              {/* Author */}
              <footer className="flex items-center gap-4">
                {/* Gold dash */}
                <span aria-hidden="true" className="h-px w-8 bg-gold" />
                <div>
                  <p
                    className="text-gold"
                    style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em' }}
                  >
                    {active.author}
                  </p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/40">
                    {active.role} &nbsp;·&nbsp; {active.company}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Navigation dots + progress */}
        <div className="mt-12 flex flex-col gap-4">
          {/* Dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={i === current}
                aria-label={`Go to testimonial by ${t.author}`}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className="transition-all duration-300"
                style={{
                  height: '2px',
                  width: i === current ? '28px' : '8px',
                  background: i === current ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                  borderRadius: '99px',
                }}
              />
            ))}
          </div>

          {/* Auto-advance progress bar */}
          {!prefersReducedMotion && (
            <div className="h-px w-full overflow-hidden bg-white/8">
              <motion.div
                key={`${current}-${paused}`}
                className="h-full bg-gold/50"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? undefined : 1 }}
                transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left', width: '100%' }}
              />
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
