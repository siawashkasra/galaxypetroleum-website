'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80'

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const HEADLINE = ['Fueling', "Afghanistan's", 'Future']

function buildVariants(prefersReducedMotion: boolean | null) {
  if (prefersReducedMotion) {
    return {
      container: { hidden: {}, visible: {} },
      item: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.01 } } },
    }
  }

  return {
    container: {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.3 },
      },
    },
    item: {
      hidden: { opacity: 0, y: 28 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: EASE_OUT_EXPO },
      },
    },
  }
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const variants = buildVariants(prefersReducedMotion)

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-ink"
    >
      {/* Background image with Ken Burns zoom */}
      <motion.div
        className="absolute inset-0"
        initial={prefersReducedMotion ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'easeOut' }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Galaxy Petroleum — industrial energy infrastructure"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Layered gradient overlay — preserves image at top, darkens for text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/55 to-ink/85"
      />

      {/* Gold accent line — left edge of content */}
      <motion.div
        aria-hidden="true"
        className="absolute left-6 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-gold lg:left-10 lg:block"
        initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8, ease: EASE_OUT_EXPO }}
        style={{ transformOrigin: 'top' }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-28 pt-36 lg:px-10 lg:pl-20"
        variants={variants.container}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow label */}
        <motion.p
          className="mb-6 text-[11px] font-semibold tracking-[0.35em] text-gold uppercase"
          variants={variants.item}
        >
          Afghanistan&rsquo;s Premier Petroleum Partner
        </motion.p>

        {/* Headline — each line animates individually */}
        <h1 className="font-display leading-[0.92] tracking-wide text-white" aria-label="Fueling Afghanistan's Future">
          {HEADLINE.map((line, i) => (
            <motion.span
              key={line}
              className="block"
              style={{
                fontFamily: 'var(--font-bebas-neue)',
                fontSize: 'clamp(3.5rem, 11vw, 9.5rem)',
                color: i === 1 ? 'var(--color-gold)' : 'white',
              }}
              variants={variants.item}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          className="mt-8 max-w-lg text-[15px] leading-relaxed text-white/65 lg:text-base"
          variants={variants.item}
        >
          Sourced from six nations across Central Asia and the Middle East. Delivered
          reliably across Afghanistan. World-class petroleum products through a supply
          chain built for scale and consistency.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          variants={variants.item}
        >
          <Link
            href="#products"
            className="inline-flex items-center bg-gold px-8 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Explore Products
          </Link>
          <Link
            href="#journey"
            className="inline-flex items-center gap-2.5 border border-white/35 px-8 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/90 transition-all duration-300 hover:border-white/70 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            The Journey
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="mt-10 text-[11px] tracking-widest text-white/35 uppercase"
          variants={variants.item}
        >
          Established 2023 &nbsp;·&nbsp; Kabul, Afghanistan &nbsp;·&nbsp; 6 Source Nations
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        role="presentation"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.6, duration: 0.8 }}
      >
        <span className="text-[9px] font-medium tracking-[0.4em] uppercase">Scroll</span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
