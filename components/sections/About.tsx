'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { company } from '@/lib/data'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Golden sunrise over oil field — pump jacks silhouetted, cinematic and directly relevant
const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1773097258874-17d6446c3113?auto=format&fit=crop&w=1400&q=85'

const HIGHLIGHTS = [
  { value: 'Est. 2023',    label: 'Founded'        },
  { value: 'Kabul, AF',   label: 'Headquarters'   },
  { value: '6 Nations',   label: 'Supply Network' },
  { value: '4 Crossings', label: 'Border Points'  },
]

export default function About() {
  return (
    <section
      id="about"
      aria-label="About Galaxy Petroleum"
      className="overflow-hidden bg-background"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[46%_54%]">

        {/* ── Text column ──────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col justify-center px-6 py-20 lg:px-10 lg:py-32"
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Eyebrow */}
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
            About Galaxy Petroleum
          </p>

          {/* Headline */}
          <h2
            className="leading-[0.92] text-ink"
            style={{
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: 'clamp(2.8rem, 5vw, 4.8rem)',
              letterSpacing: '0.02em',
            }}
          >
            Built on Trust.
            <br />
            <span style={{ color: 'var(--color-gold)' }}>Powered by</span>
            <br />
            Purpose.
          </h2>

          {/* Gold rule */}
          <div aria-hidden="true" className="my-8 h-px w-12 bg-gold" />

          {/* Body */}
          <p className="max-w-md text-[15px] leading-8 text-muted">
            {company.about}
          </p>

          {/* Highlight metadata */}
          <ul
            aria-label="Company highlights"
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          >
            {HIGHLIGHTS.map(({ value, label }) => (
              <li
                key={label}
                className="flex flex-col gap-1 border-l-2 border-gold pl-3"
              >
                <span className="text-[13px] font-semibold text-ink">{value}</span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-muted">{label}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="#journey"
            className="group mt-12 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
          >
            Trace Our Journey
            <ArrowRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* ── Image column ─────────────────────────────────────────── */}
        <motion.div
          className="relative min-h-[380px] lg:min-h-0"
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Image
            src={ABOUT_IMAGE}
            alt="Industrial energy infrastructure representing Galaxy Petroleum's operations"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 54vw"
          />

          {/* Left gradient — blends into text column on desktop */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-background/25 via-transparent to-transparent"
          />

          {/* Floating caption card */}
          <motion.div
            className="absolute bottom-6 left-6 right-6 border border-white/20 bg-ink/70 px-5 py-4 backdrop-blur-sm lg:left-auto lg:right-8 lg:w-64"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
              Our Mission
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/80">
              Reliable energy for every community, business, and
              infrastructure project across Afghanistan.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
