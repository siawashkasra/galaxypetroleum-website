'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { CeoMessage } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function CeoMessageSection({ ceoMessage }: { ceoMessage: CeoMessage }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const paragraphs = ceoMessage.message
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)

  return (
    <section
      ref={ref}
      id="ceo-message"
      aria-label="Message from the CEO"
      className="relative overflow-hidden"
      style={{ background: '#0a0a08' }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[44%_56%] min-h-[680px]">

        {/* ── Photo column ─────────────────────────────────────────── */}
        <div className="relative hidden lg:block">
          <Image
            src={ceoMessage.photo}
            alt={`${ceoMessage.name}, ${ceoMessage.title}`}
            fill
            sizes="44vw"
            className="object-cover object-center"
            priority={false}
          />
          {/* Right-edge gradient — dissolves photo into dark bg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, transparent 50%, #0a0a08 100%)',
            }}
          />
          {/* Bottom gradient — keeps feet from floating */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #0a0a08 0%, transparent 30%)',
            }}
          />
        </div>

        {/* ── Text column ──────────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-8 py-20 lg:px-16 lg:py-28">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-8 text-[10px] font-semibold uppercase tracking-[0.35em]"
            style={{ color: '#C9A84C' }}
          >
            From the CEO
          </motion.p>

          {/* Opening quote mark */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            aria-hidden="true"
            className="leading-none select-none"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(5rem, 10vw, 8rem)',
              color: '#C9A84C',
              lineHeight: 0.6,
              display: 'block',
              marginBottom: '1.5rem',
            }}
          >
            &#8220;
          </motion.span>

          {/* Message paragraphs */}
          <div className="space-y-5">
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE }}
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                  lineHeight: 1.8,
                  color: '#c8c4b8',
                }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Animated gold rule */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
            className="my-8 h-px origin-left"
            style={{ background: '#C9A84C', width: '48px' }}
          />

          {/* CEO name + title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
          >
            <p
              style={{
                fontFamily: 'var(--font-bebas-neue)',
                fontSize: '1.6rem',
                letterSpacing: '0.08em',
                color: '#f0ece0',
                lineHeight: 1,
              }}
            >
              {ceoMessage.name}
            </p>
            <p
              className="mt-1.5"
              style={{
                fontVariant: 'small-caps',
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                color: '#7a776f',
                textTransform: 'uppercase',
              }}
            >
              {ceoMessage.title}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
