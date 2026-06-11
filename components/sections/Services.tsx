'use client'

import { motion } from 'framer-motion'
import {
  Zap, Truck, ShieldCheck, BarChart3, Network, Leaf,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Service } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Truck, ShieldCheck, BarChart3, Network, Leaf,
}

/* ─── Service card ───────────────────────────────────────────── */

function ServiceCard({
  service,
  index,
}: {
  service: Service
  index: number
}) {
  const Icon = ICON_MAP[service.icon] ?? Zap

  return (
    <motion.div
      className="group relative overflow-hidden p-8 transition-colors duration-500 hover:bg-white/[0.03] lg:p-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
    >
      {/* Left gold border — draws down on hover */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-gold transition-transform duration-500 group-hover:scale-y-100"
      />

      {/* Icon */}
      <div className="mb-6 inline-flex h-11 w-11 items-center justify-center border border-white/12 text-gold transition-all duration-300 group-hover:border-gold/50 group-hover:bg-gold/8">
        <Icon size={19} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3
        className="mb-3 text-white transition-colors duration-300 group-hover:text-gold"
        style={{
          fontFamily: 'var(--font-bebas-neue)',
          fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
          letterSpacing: '0.04em',
          lineHeight: 1.1,
        }}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-[13px] leading-7 text-white/50">
        {service.description}
      </p>

      {/* Arrow — slides in on hover */}
      <div className="mt-5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold opacity-0 transition-all duration-300 group-hover:opacity-100">
        Learn More
        <ArrowRight size={11} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </motion.div>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function Services({ services }: { services: Service[] }) {
  return (
    <section
      id="services"
      aria-label="Our services"
      style={{ background: '#0C0C0A' }}
    >
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pb-0 pt-20 lg:px-10 lg:pt-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
              Our Services
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
              Beyond the
              <br />
              <span style={{ color: 'var(--color-gold)' }}>Fuel Itself</span>
            </h2>
          </motion.div>

          <motion.p
            className="max-w-sm text-[14px] leading-7 text-white/50 lg:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            Galaxy Petroleum delivers more than petroleum products — we provide
            the infrastructure, intelligence, and assurance that keep your
            operations running without interruption.
          </motion.p>
        </div>
      </div>

      {/* Grid — gap-px with bg-white/8 as the divider colour */}
      <div className="mx-auto mt-16 max-w-7xl border-t border-white/8">
        <div
          className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className="mx-auto flex max-w-7xl items-center justify-between border-t border-white/8 px-6 py-8 lg:px-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      >
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
          Trusted by businesses across Afghanistan since 2023
        </p>
        <a
          href="#contact"
          className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
        >
          Talk to Us
          <ArrowRight
            size={12}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </motion.div>
    </section>
  )
}
