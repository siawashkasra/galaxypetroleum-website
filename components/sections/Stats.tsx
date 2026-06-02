'use client'

import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { stats } from '@/lib/data'
import type { Stat } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Animated counter ───────────────────────────────────────── */

function Counter({ value, suffix }: Pick<Stat, 'value' | 'suffix'>) {
  const ref          = useRef<HTMLDivElement>(null)
  const motionValue  = useMotionValue(0)
  const isInView     = useInView(ref, { once: true, margin: '-80px' })

  // Format: numbers ≥ 1000 get a comma (3,000)
  const display = useTransform(motionValue, (v) => {
    const n = Math.round(v)
    return n >= 1000 ? n.toLocaleString('en-US') : String(n)
  })

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionValue, value, {
      duration: 2,
      ease: EASE,
    })
    return controls.stop
  }, [isInView, value, motionValue])

  return (
    <div ref={ref} className="flex items-baseline gap-1.5 leading-none">
      <motion.span
        style={{
          fontFamily: 'var(--font-bebas-neue)',
          fontSize: 'clamp(3.2rem, 5.5vw, 5rem)',
          letterSpacing: '0.02em',
          color: 'var(--color-ink)',
          lineHeight: 1,
        }}
      >
        {display}
      </motion.span>

      {suffix && (
        <span
          style={{
            fontFamily: 'var(--font-bebas-neue)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            letterSpacing: '0.02em',
            color: 'var(--color-gold)',
            lineHeight: 1,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function Stats() {
  return (
    <section
      id="stats"
      aria-label="Company statistics"
      className="bg-surface"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">

        {/* Section eyebrow */}
        <motion.p
          className="mb-14 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          Galaxy at a Glance
        </motion.p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col gap-4 lg:px-10 lg:first:pl-0 lg:last:pr-0"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: EASE }}
            >
              {/* Gold accent line */}
              <div aria-hidden="true" className="h-px w-10 bg-gold" />

              {/* Animated number */}
              <Counter value={stat.value} suffix={stat.suffix} />

              {/* Label */}
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom context line */}
        <motion.p
          className="mt-16 max-w-xl text-sm leading-relaxed text-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          Established in 2023, Galaxy Petroleum has grown into Afghanistan&rsquo;s
          most trusted petroleum partner — building the infrastructure, partnerships,
          and supply chains the country depends on.
        </motion.p>
      </div>
    </section>
  )
}
