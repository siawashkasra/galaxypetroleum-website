'use client'

import { motion } from 'framer-motion'
import { sourceCountries } from '@/lib/data'
import type { SourceCountry } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Featured country card (full-width, horizontal) ─────────── */

function FeaturedCountryCard({ country }: { country: SourceCountry }) {
  return (
    <motion.article
      className="group relative mb-4 overflow-hidden border border-gold/30 bg-surface"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {/* Subtle gold gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, rgba(201,168,76,0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:gap-10 lg:p-10">

        {/* Left — number + flag */}
        <div className="flex shrink-0 items-center gap-5 lg:flex-col lg:items-start lg:gap-3">
          <span
            className="font-medium tabular-nums text-gold/40"
            style={{ fontSize: '11px', letterSpacing: '0.1em' }}
            aria-hidden="true"
          >
            01
          </span>
          <span
            className="leading-none transition-transform duration-500 group-hover:scale-105"
            style={{ fontSize: '4rem' }}
            role="img"
            aria-label={`${country.name} flag`}
          >
            {country.flag}
          </span>
        </div>

        {/* Center — name + description */}
        <div className="flex-1">
          {/* Badge */}
          {country.featuredBadge && (
            <span
              className="mb-3 inline-flex items-center gap-1.5 bg-gold px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white"
              style={{ borderRadius: '1px' }}
            >
              <span aria-hidden="true">★</span>
              {country.featuredBadge}
            </span>
          )}

          <h3
            className="mb-3 text-ink transition-colors duration-300 group-hover:text-gold"
            style={{
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              letterSpacing: '0.04em',
              lineHeight: 1,
              display: 'block',
            }}
          >
            {country.name}
          </h3>

          <p className="max-w-xl text-[13px] leading-7 text-muted">
            {country.description}
          </p>
        </div>

        {/* Right — products */}
        <div className="shrink-0 lg:text-right">
          <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-muted">
            Commodities Supplied
          </p>
          <div className="flex flex-wrap gap-1.5 lg:justify-end">
            {country.products.map(product => (
              <span
                key={product}
                className="border border-gold/35 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-gold/90 transition-colors duration-300 group-hover:border-gold/60 group-hover:text-gold"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Gold bottom rule — always visible, brightens on hover */}
      <div
        aria-hidden="true"
        className="h-0.5 w-full bg-gold/40 transition-all duration-500 group-hover:bg-gold"
      />
    </motion.article>
  )
}

/* ─── Standard country card ──────────────────────────────────── */

function CountryCard({
  country,
  index,
}: {
  country: SourceCountry
  index: number
}) {
  const num = String(index + 2).padStart(2, '0')   // starts at 02 — featured is 01

  return (
    <motion.article
      className="group relative flex flex-col border border-border bg-background p-6 transition-all duration-400 hover:border-gold/40 hover:shadow-md lg:p-8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: EASE }}
    >
      {/* Top row: number + flag */}
      <div className="mb-5 flex items-start justify-between">
        <span
          className="text-[11px] font-medium tabular-nums text-muted transition-colors duration-300 group-hover:text-gold/70"
          aria-hidden="true"
        >
          {num}
        </span>
        <span
          className="text-4xl leading-none transition-transform duration-400 group-hover:scale-110"
          role="img"
          aria-label={`${country.name} flag`}
        >
          {country.flag}
        </span>
      </div>

      {/* Country name */}
      <h3
        className="mb-3 text-ink transition-colors duration-300 group-hover:text-gold"
        style={{
          fontFamily: 'var(--font-bebas-neue)',
          fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        {country.name}
      </h3>

      {/* Description */}
      <p className="mb-6 flex-1 text-[13px] leading-7 text-muted">
        {country.description}
      </p>

      {/* Products supplied */}
      <div className="space-y-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-muted">
          Commodities Supplied
        </p>
        <div className="flex flex-wrap gap-1.5">
          {country.products.map(product => (
            <span
              key={product}
              className="border border-gold/25 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-gold/80 transition-colors duration-300 group-hover:border-gold/50 group-hover:text-gold"
            >
              {product}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom gold rule — grows on hover */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-500 group-hover:w-full"
      />
    </motion.article>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function Network() {
  return (
    <section
      id="network"
      aria-label="Our supply network"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">

        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
              Our Network
            </p>
            <h2
              className="text-ink"
              style={{
                fontFamily: 'var(--font-bebas-neue)',
                fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
                letterSpacing: '0.02em',
                lineHeight: 0.95,
              }}
            >
              Seven Nations.
              <br />
              <span style={{ color: 'var(--color-gold)' }}>One Pipeline.</span>
            </h2>
          </motion.div>

          <motion.p
            className="max-w-sm text-[14px] leading-7 text-muted lg:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            A deliberately diversified sourcing strategy across seven nations
            protects against regional disruption and ensures Afghanistan always
            has reliable access to the energy it needs.
          </motion.p>
        </div>

        {/* Featured card — full width, always first */}
        {(() => {
          const featured = sourceCountries.find(c => c.featuredBadge)
          const rest     = sourceCountries.filter(c => !c.featuredBadge)
          return (
            <>
              {featured && <FeaturedCountryCard country={featured} />}
              {/* Remaining 6 — clean 3×2 grid, no orphan */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((country, i) => (
                  <CountryCard key={country.id} country={country} index={i} />
                ))}
              </div>
            </>
          )
        })()}

        {/* Bottom stat strip */}
        <motion.div
          className="mt-12 grid grid-cols-3 divide-x divide-border border border-border"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
        >
          {[
            { value: '7',   label: 'Source Countries'   },
            { value: '4',   label: 'Border Entry Points' },
            { value: '34',  label: 'Provinces Served'    },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 py-5 px-4">
              <span
                className="text-gold"
                style={{
                  fontFamily: 'var(--font-bebas-neue)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
              <span className="text-center text-[9px] uppercase tracking-[0.2em] text-muted">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
