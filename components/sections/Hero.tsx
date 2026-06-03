'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import GlobeVisualization from '@/components/ui/GlobeVisualization'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CONTENT_VARIANTS = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
}

const REDUCED_ITEM_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const itemVariants = prefersReducedMotion ? REDUCED_ITEM_VARIANTS : ITEM_VARIANTS

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-dvh flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0C0C0A 0%, #111108 50%, #0C0C0A 100%)' }}
    >
      {/* Subtle dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Horizontal gold rule — top accent */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px bg-gold opacity-30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Main layout */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 lg:flex-row lg:items-center lg:px-10">

        {/* ── Left: Text content ───────────────────────────────────── */}
        <motion.div
          className="flex flex-col justify-center pb-10 pt-32 lg:w-[52%] lg:py-28 lg:pr-8"
          variants={CONTENT_VARIANTS}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.p
            className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold"
            variants={itemVariants}
          >
            Afghanistan&rsquo;s Premier Petroleum Partner
          </motion.p>

          {/* Headline */}
          <motion.h1
            aria-label="Energy Without Borders"
            className="leading-[0.9] tracking-wide text-white"
            style={{
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: 'clamp(3.8rem, 10vw, 9rem)',
            }}
            variants={itemVariants}
          >
            Energy
            <br />
            <span style={{ color: 'var(--color-gold)' }}>Without</span>
            <br />
            Borders
          </motion.h1>

          {/* Divider */}
          <motion.div
            aria-hidden="true"
            className="my-8 h-px w-16 bg-gold opacity-50"
            variants={itemVariants}
          />

          {/* Subheadline */}
          <motion.p
            className="max-w-sm text-[14px] leading-7 text-white/60"
            variants={itemVariants}
          >
            Seven source nations. Four border crossings. One reliable partner.
            Galaxy Petroleum delivers world-class fuel across Afghanistan —
            tracing a supply chain no competitor has built.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            variants={itemVariants}
          >
            <Link
              href="#commodities"
              className="inline-flex items-center bg-gold px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Our Commodities
            </Link>
            <Link
              href="#journey"
              className="inline-flex items-center gap-2.5 border border-white/25 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 transition-all duration-300 hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Trace the Journey
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          {/* Trust metadata */}
          <motion.ul
            aria-label="Company facts"
            className="mt-12 flex flex-wrap gap-x-6 gap-y-2"
            variants={itemVariants}
          >
            {[
              'Est. 2023',
              'Kabul, Afghanistan',
              '7 Source Nations',
              '100+ Team Members',
            ].map(fact => (
              <li key={fact} className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                {fact}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ── Right: Globe ─────────────────────────────────────────── */}
        <motion.div
          className="flex items-center justify-center pb-8 lg:w-[48%] lg:py-16"
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
          aria-hidden="true"
        >
          <div className="relative w-full max-w-[560px]">
            {/* Radial glow behind globe */}
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(201,168,76,0.1) 0%, transparent 65%)',
              }}
            />
            {/* Label */}
            <p className="mb-1 text-center text-[9px] uppercase tracking-[0.4em] text-gold/40">
              Global Supply Network
            </p>
            <GlobeVisualization />
            {/* Legend strip */}
            <div className="mt-2 flex items-center justify-center gap-6">
              {[
                { color: 'rgba(201,168,76,0.6)', label: 'Source Nation' },
                { color: '#C9A84C',              label: 'Border Crossing' },
                { color: '#E8C96A',              label: 'Destination' },
              ].map(({ color, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="text-[8px] uppercase tracking-[0.12em] text-white/35">
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        role="presentation"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 2.2, duration: 0.8 }}
      >
        <span className="text-[8px] font-medium uppercase tracking-[0.4em]">Scroll</span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={13} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
