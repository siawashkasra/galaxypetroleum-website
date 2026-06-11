'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  journeySourceCountries as SOURCES,
  journeyCorridorCrossings as CROSSINGS,
} from '@/lib/data'
import type {
  JourneySourceCountryData,
  JourneyCrossing,
  JourneyImpactStat,
} from '@/lib/types'

/* ─── Shared constants ───────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const GOLD = '#C9A84C'
const BG   = '#0A0A0A'

/* ─── Shared: section chapter header ────────────────────────── */

function ChapterLabel({ number }: { number: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.42em',
        textTransform: 'uppercase',
        color: GOLD,
        marginBottom: '1rem',
        fontFamily: 'var(--font-inter)',
      }}
    >
      Chapter {number}
    </motion.p>
  )
}

function ChapterHeading({ text, delay = 0.08 }: { text: string; delay?: number }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: EASE, delay }}
      style={{
        fontFamily: 'var(--font-bebas-neue)',
        fontSize: 'clamp(2.6rem, 5.5vw, 4.4rem)',
        letterSpacing: '0.03em',
        lineHeight: 1,
        color: 'white',
        marginBottom: '1.25rem',
      }}
    >
      {text}
    </motion.h2>
  )
}

function ChapterSubtext({ text, delay = 0.18, center = false }: { text: string; delay?: number; center?: boolean }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      style={{
        fontSize: '15px',
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.52)',
        fontFamily: 'var(--font-inter)',
        textAlign: center ? 'center' : undefined,
        maxWidth: center ? '480px' : undefined,
        margin: center ? '0 auto' : undefined,
      }}
    >
      {text}
    </motion.p>
  )
}

function GoldRule({ delay = 0.14, center = false }: { delay?: number; center?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 0.55 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      style={{
        width: '36px',
        height: '1px',
        background: GOLD,
        transformOrigin: center ? 'center' : 'left',
        margin: center ? '0 auto 1.5rem' : '1.25rem 0 1.5rem',
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 1 — THE SOURCE  (Distance Board)
═══════════════════════════════════════════════════════════════ */

const MAX_DISTANCE = Math.max(...SOURCES.map(s => s.distanceKm))

function DistanceBoardRow({
  country,
  index,
}: {
  country: JourneySourceCountryData
  index: number
}) {
  const ref  = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const pct  = (country.distanceKm / MAX_DISTANCE) * 100

  /* km count-up */
  const [km, setKm] = useState(0)
  useEffect(() => {
    if (!inView) return
    const DURATION = 1800
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1)
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setKm(Math.round(eased * country.distanceKm))
      if (p < 1) requestAnimationFrame(tick)
    }
    const id = setTimeout(() => requestAnimationFrame(tick), index * 80)
    return () => clearTimeout(id)
  }, [inView, country.distanceKm, index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.08 }}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '1.25rem 0',
      }}
    >
      {/* ── Desktop: single-line 3-col layout ──────────────────── */}
      <div className="hidden items-center gap-6 sm:flex">

        {/* Left — flag + name */}
        <div className="flex shrink-0 items-center gap-3" style={{ width: '200px' }}>
          <span
            className={`fi fi-${country.flagCode}`}
            role="img"
            aria-label={`Flag of ${country.name}`}
            style={{
              display: 'inline-block',
              width: '32px',
              height: '24px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '1px',
              boxShadow: '0 1px 6px rgba(0,0,0,0.5)',
              flexShrink: 0,
            }}
          />
          <h3
            style={{
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: '1.55rem',
              letterSpacing: '0.07em',
              color: 'white',
              lineHeight: 1,
            }}
          >
            {country.name}
          </h3>
        </div>

        {/* Middle — animated distance track */}
        <div className="relative flex flex-1 items-center" style={{ height: '20px' }}>
          {/* Dim full-width track */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              top: '50%',
              height: '1px',
              background: 'rgba(255,255,255,0.07)',
              transform: 'translateY(-50%)',
            }}
          />
          {/* Proportional filled track */}
          <div style={{ width: `${pct}%`, position: 'relative' }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: index * 0.08 + 0.15 }}
              style={{
                height: '1px',
                background: `linear-gradient(90deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.85) 100%)`,
                transformOrigin: 'left',
              }}
            />
            {/* Glowing end-node */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, ease: EASE, delay: index * 0.08 + 1.55 }}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                transform: 'translate(50%, -50%)',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#E8C96A',
                boxShadow: '0 0 8px 3px rgba(232,201,106,0.5)',
              }}
            />
          </div>
        </div>

        {/* Right — km counter + products */}
        <div className="shrink-0 text-right" style={{ width: '210px' }}>
          <span
            aria-live="polite"
            style={{
              display: 'block',
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: '1.6rem',
              letterSpacing: '0.06em',
              color: GOLD,
              lineHeight: 1,
            }}
          >
            {km.toLocaleString()} <span style={{ fontSize: '0.8em', opacity: 0.6 }}>KM</span>
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '10px',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-inter)',
              marginTop: '4px',
            }}
          >
            {country.products.join(' · ')}
          </span>
        </div>
      </div>

      {/* ── Mobile: stacked layout ──────────────────────────────── */}
      <div className="sm:hidden">
        {/* Top row: flag + name | km */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`fi fi-${country.flagCode}`}
              role="img"
              aria-label={`Flag of ${country.name}`}
              style={{
                display: 'inline-block',
                width: '28px',
                height: '21px',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '1px',
                flexShrink: 0,
              }}
            />
            <h3
              style={{
                fontFamily: 'var(--font-bebas-neue)',
                fontSize: '1.4rem',
                letterSpacing: '0.07em',
                color: 'white',
                lineHeight: 1,
              }}
            >
              {country.name}
            </h3>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: '1.3rem',
              letterSpacing: '0.05em',
              color: GOLD,
              lineHeight: 1,
            }}
          >
            {km.toLocaleString()} <span style={{ fontSize: '0.75em', opacity: 0.55 }}>KM</span>
          </span>
        </div>

        {/* Bar */}
        <div className="relative mb-2.5" style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.3, ease: EASE, delay: index * 0.08 + 0.1 }}
            style={{
              position: 'absolute',
              inset: 0,
              width: `${pct}%`,
              background: `linear-gradient(90deg, rgba(201,168,76,0.3) 0%, #C9A84C 100%)`,
              borderRadius: '2px',
              transformOrigin: 'left',
            }}
          />
        </div>

        {/* Products */}
        <p style={{ fontSize: '10px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter)' }}>
          {country.products.join(' · ')}
        </p>
      </div>
    </motion.div>
  )
}

function ChapterSource() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: BG,
        paddingTop: 'clamp(5rem, 11vh, 8rem)',
        paddingBottom: 'clamp(5rem, 11vh, 8rem)',
      }}
    >
      {/* Dot-grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(201,168,76,0.05) 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">

        {/* Chapter header */}
        <div className="mb-14">
          <ChapterLabel number="01" />
          <ChapterHeading text="It begins thousands of kilometers away." />
          <GoldRule />
          <ChapterSubtext text="Seven nations. Some of the world's richest petroleum reserves — ranked by distance to Kabul." />
        </div>

        {/* Column headers — desktop only */}
        <div className="mb-3 hidden items-center gap-6 sm:flex">
          <div style={{ width: '200px', flexShrink: 0 }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-inter)' }}>
              Source Nation
            </span>
          </div>
          <div className="flex-1">
            <span style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-inter)' }}>
              Distance to Kabul
            </span>
          </div>
          <div style={{ width: '210px', flexShrink: 0, textAlign: 'right' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-inter)' }}>
              Commodities Supplied
            </span>
          </div>
        </div>

        {/* Distance board rows — sorted longest to shortest in data */}
        <div>
          {SOURCES.map((country, i) => (
            <DistanceBoardRow key={country.id} country={country} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 2 — THE CORRIDOR
═══════════════════════════════════════════════════════════════ */

function CorridorTimelineLine() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      className="relative mb-10 hidden lg:block"
      style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }}
    >
      {/* Gold draw animation */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${GOLD} 15%, ${GOLD} 85%, transparent 100%)`,
          transformOrigin: 'left',
          opacity: 0.55,
        }}
      />
      {/* Node dots at each crossing position (25%, 50%, 75%, 100%) */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.25 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: `${(i / 3) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: GOLD,
            boxShadow: `0 0 10px 3px rgba(201,168,76,0.4)`,
          }}
        />
      ))}
    </div>
  )
}

function CrossingCard({
  crossing,
  index,
}: {
  crossing: JourneyCrossing
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 56 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.14 }}
      aria-label={`${crossing.name}: ${crossing.tagline}`}
      className="flex flex-col"
    >
      {/* Landscape image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4 / 3', borderRadius: '2px', marginBottom: '1.25rem' }}
      >
        <Image
          src={crossing.image}
          alt={`Landscape near ${crossing.name} border crossing`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Cinematic dark overlay — heavier at the bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.38) 55%, rgba(10,10,10,0.18) 100%)',
          }}
        />

        {/* Region label */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontSize: '8px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.85)',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
          }}
        >
          {crossing.region}
        </div>

        {/* Gold pulse node — appears when in view */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translate(-50%, 50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: inView ? GOLD : 'transparent',
            border: `1.5px solid ${GOLD}`,
            boxShadow: inView ? `0 0 14px 5px rgba(201,168,76,0.45)` : 'none',
            transition: 'background 0.7s 0.4s, box-shadow 0.7s 0.4s',
            zIndex: 2,
          }}
        />
      </div>

      {/* Text */}
      <h3
        style={{
          fontFamily: 'var(--font-bebas-neue)',
          fontSize: 'clamp(1.45rem, 2vw, 1.9rem)',
          letterSpacing: '0.07em',
          color: 'white',
          marginBottom: '0.5rem',
        }}
      >
        {crossing.name}
      </h3>

      <div
        style={{
          width: '20px',
          height: '1px',
          background: GOLD,
          opacity: 0.45,
          marginBottom: '0.625rem',
        }}
      />

      <p
        style={{
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.48)',
          fontFamily: 'var(--font-inter)',
        }}
      >
        {crossing.tagline}
      </p>
    </motion.article>
  )
}

function ChapterCorridor() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0C0C0B 100%)',
        paddingTop: 'clamp(5rem, 11vh, 8rem)',
        paddingBottom: 'clamp(5rem, 11vh, 8rem)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Side vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Chapter header */}
        <div className="mb-14 text-center">
          <ChapterLabel number="02" />
          <ChapterHeading text="Thousands of kilometers. One corridor." />
          <GoldRule center />
          <ChapterSubtext
            text="Across steppes, mountains, and borders — the fuel moves."
            center
          />
        </div>

        {/* Animated timeline line (desktop only) */}
        <CorridorTimelineLine />

        {/* 4 crossing cards */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {CROSSINGS.map((crossing, i) => (
            <CrossingCard key={crossing.id} crossing={crossing} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 3 — THE ARRIVAL
═══════════════════════════════════════════════════════════════ */

function CountUpStat({
  stat,
  staggerDelay = 0,
}: {
  stat: JourneyImpactStat
  staggerDelay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const DURATION = 2400
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / DURATION, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(eased * stat.value))
      if (progress < 1) requestAnimationFrame(tick)
    }

    const id = setTimeout(() => requestAnimationFrame(tick), staggerDelay)
    return () => clearTimeout(id)
  }, [inView, stat.value, staggerDelay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: EASE, delay: staggerDelay / 1000 }}
      className="flex flex-col items-center text-center"
    >
      <span
        aria-live="polite"
        aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
        style={{
          fontFamily: 'var(--font-bebas-neue)',
          fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          letterSpacing: '0.04em',
          color: GOLD,
          lineHeight: 1,
          display: 'block',
        }}
      >
        {count.toLocaleString()}{stat.suffix}
      </span>
      <span
        style={{
          display: 'block',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.42)',
          marginTop: '0.6rem',
          fontFamily: 'var(--font-inter)',
          maxWidth: '180px',
        }}
      >
        {stat.label}
      </span>
    </motion.div>
  )
}

function ChapterArrival({ stats: STATS }: { stats: JourneyImpactStat[] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: '#0C0C0A',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Split screen — image left / text right */}
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left — Ken Burns image */}
        <div className="relative overflow-hidden" style={{ minHeight: '540px' }}>
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1.0, 1.08, 1.0] }}
            transition={{
              duration: 8,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1400&q=85"
              alt="Fuel storage and distribution facility at dusk"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Graduated dark overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(12,12,10,0.35) 0%, rgba(12,12,10,0.2) 100%)',
            }}
          />

          {/* Right-edge blend into text panel (desktop) */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-24 lg:block"
            style={{
              background: 'linear-gradient(to right, transparent, #0C0C0A)',
            }}
          />
        </div>

        {/* Right — text narrative */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-14 lg:py-24">
          <ChapterLabel number="03" />
          <ChapterHeading text="Afghanistan receives." delay={0.06} />
          <GoldRule delay={0.12} />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: EASE, delay: 0.22 }}
            style={{
              fontSize: '15px',
              lineHeight: 1.88,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'var(--font-inter)',
              maxWidth: '440px',
              marginBottom: '1.25rem',
            }}
          >
            Once the shipment crosses the border, Galaxy Petroleum&rsquo;s ground logistics
            network takes over. From our Kabul operations hub, fuel is dispatched to
            34&nbsp;provinces — reaching construction sites, hospitals, generator farms,
            and families.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.34 }}
            style={{
              fontSize: '14px',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.32)',
              fontFamily: 'var(--font-inter)',
              maxWidth: '380px',
              fontStyle: 'italic',
            }}
          >
            No competitor has built this network. Galaxy did.
          </motion.p>
        </div>
      </div>

      {/* Stats row */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 'clamp(3.5rem, 8vh, 5.5rem)',
          paddingBottom: 'clamp(3.5rem, 8vh, 5.5rem)',
        }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-6 sm:grid-cols-3 lg:gap-8 lg:px-10">
          {STATS.map((stat, i) => (
            <CountUpStat key={stat.label} stat={stat} staggerDelay={i * 220} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER 4 — THE IMPACT
═══════════════════════════════════════════════════════════════ */

function ChapterImpact() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: '#080808', borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Parallax background — slightly over-scaled for movement headroom */}
      <div
        className="absolute inset-0"
        style={{ transform: 'scale(1.1)' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1602853175733-5ad62dc6a2c8?auto=format&fit=crop&w=1800&q=85"
          alt="Digital display showing fuel data — the intelligence behind Galaxy Petroleum's supply network"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Multi-layer overlay for legibility and cinematic depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,8,8,0.72) 0%, rgba(8,8,8,0.52) 40%, rgba(8,8,8,0.80) 100%)',
        }}
      />

      {/* Gold vignette — center warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center lg:px-10">
        <ChapterLabel number="04" />

        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-bebas-neue)',
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            letterSpacing: '0.04em',
            lineHeight: 0.96,
            color: 'white',
            marginBottom: '1.5rem',
          }}
        >
          Fuel is not just energy.
          <br />
          <span style={{ color: GOLD }}>It is possibility.</span>
        </motion.h2>

        <GoldRule center delay={0.24} />

        {/* Cormorant Garamond italic — the editorial voice */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.34 }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)',
            lineHeight: 1.72,
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '580px',
            margin: '0 auto 2.75rem',
          }}
        >
          Every generator powered. Every construction project running. Every family with
          warmth in winter. Galaxy Petroleum is the invisible infrastructure behind
          Afghanistan&rsquo;s progress.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: EASE, delay: 0.48 }}
        >
          <Link
            href="#contact"
            className="inline-flex items-center gap-2.5 bg-gold px-9 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
          >
            Become a Supply Partner
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SECTION ROOT
═══════════════════════════════════════════════════════════════ */

export default function Journey({ journeyImpactStats: STATS }: { journeyImpactStats: JourneyImpactStat[] }) {
  return (
    <section
      id="journey"
      aria-label="The fuel supply journey — from source nations to Afghanistan"
    >
      <ChapterSource />
      <ChapterCorridor />
      <ChapterArrival stats={STATS} />
      <ChapterImpact />
    </section>
  )
}
