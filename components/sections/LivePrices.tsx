'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import type { PricesPayload, CommodityPrice } from '@/app/api/prices/route'

const REFRESH_INTERVAL = 60 // seconds
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Price card ─────────────────────────────────────────────── */

function PriceCard({ commodity }: { commodity: CommodityPrice }) {
  const isPositive = commodity.change > 0
  const isNegative = commodity.change < 0
  const isNeutral  = commodity.change === 0

  const changeColor = isPositive
    ? 'text-emerald-400'
    : isNegative
    ? 'text-rose-400'
    : 'text-white/40'

  const ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  const formattedPrice  = commodity.price.toFixed(2)
  const formattedChange = `${isPositive ? '+' : ''}${commodity.change.toFixed(2)}`
  const formattedPct    = `${isPositive ? '+' : ''}${commodity.changePct.toFixed(2)}%`

  return (
    <div className="flex flex-col gap-3 px-8 py-6 lg:px-10">
      {/* Commodity label */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
        {commodity.label}
      </p>

      {/* Price — animates on change */}
      <div className="flex items-baseline gap-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={formattedPrice}
            className="text-white"
            style={{
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              lineHeight: 1,
              letterSpacing: '0.02em',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            ${formattedPrice}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] uppercase tracking-widest text-white/35">
          {commodity.unit}
        </span>
      </div>

      {/* Change indicator */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={formattedChange}
          className={`flex items-center gap-1.5 ${changeColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChangeIcon size={13} strokeWidth={2} />
          <span className="text-[11px] font-semibold tabular-nums">
            {formattedChange}
          </span>
          <span className="text-[11px] tabular-nums opacity-75">
            ({formattedPct})
          </span>
          {commodity.period !== 'Demo' && (
            <span className="ml-1 text-[9px] uppercase tracking-wider text-white/25">
              vs prev day
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─── Skeleton card ──────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 px-8 py-6 lg:px-10">
      <div className="h-3 w-24 animate-pulse rounded-sm bg-white/10" />
      <div className="h-10 w-36 animate-pulse rounded-sm bg-white/10" />
      <div className="h-3 w-28 animate-pulse rounded-sm bg-white/10" />
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function LivePrices() {
  const [data, setData]           = useState<PricesPayload | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)
  const prefersReducedMotion      = useReducedMotion()

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/prices', { cache: 'no-store' })
      if (!res.ok) throw new Error('fetch failed')
      const json: PricesPayload = await res.json()
      setData(json)
      setError(false)
      setCountdown(REFRESH_INTERVAL)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL * 1_000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(
      () => setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL : prev - 1)),
      1_000,
    )
    return () => clearInterval(timer)
  }, [])

  const commodities = data
    ? [data.brent, data.wti, data.naturalGas]
    : null

  return (
    <section
      id="prices"
      aria-label="Live petroleum market prices"
      className="relative overflow-hidden"
      style={{ background: '#0E0E0B' }}
    >
      {/* Top gold rule */}
      <div aria-hidden="true" className="h-px w-full bg-gold opacity-20" />

      <motion.div
        className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* Header row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
              Live Market Prices
            </p>
            {data?.isDemo && (
              <span className="rounded-sm border border-gold/30 px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-gold/60">
                Demo
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/30">
            {error ? (
              <button
                onClick={fetchPrices}
                className="flex items-center gap-1.5 text-rose-400 transition-opacity hover:opacity-80"
                aria-label="Retry fetching prices"
              >
                <RefreshCw size={11} />
                Retry
              </button>
            ) : (
              <>
                {data && (
                  <span>
                    Updated{' '}
                    {new Date(data.updatedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short',
                    })}
                  </span>
                )}
                <span className="tabular-nums">
                  Refresh in{' '}
                  <span className="font-semibold text-white/50">
                    {String(countdown).padStart(2, '0')}s
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="mb-0 h-px bg-white/8" />

        {/* Price grid */}
        <div className="grid grid-cols-1 divide-y divide-white/8 md:grid-cols-3 md:divide-x md:divide-y-0">
          {loading || !commodities
            ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
            : commodities.map(commodity => (
                <PriceCard key={commodity.label} commodity={commodity} />
              ))}
        </div>

        {/* Footer */}
        <div aria-hidden="true" className="mt-0 h-px bg-white/8" />
        <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-white/20">
          Data sourced from the U.S. Energy Information Administration (EIA)
          {data?.brent.period && data.brent.period !== 'Demo' && (
            <> &nbsp;·&nbsp; As of {data.brent.period}</>
          )}
        </p>
      </motion.div>

      {/* Fade to light background */}
      <div
        aria-hidden="true"
        className="pointer-events-none h-16"
        style={{
          background: 'linear-gradient(to bottom, #0E0E0B, var(--color-background))',
        }}
      />
    </section>
  )
}
