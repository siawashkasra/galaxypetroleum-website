'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Product card ───────────────────────────────────────────── */

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.article
      className="group relative overflow-hidden"
      style={{ aspectRatio: '3 / 4' }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <Image
          src={product.image}
          alt={`${product.name} — ${product.grade}`}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Base gradient — always visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10 transition-opacity duration-500" />

      {/* Hover overlay — darkens the upper portion */}
      <div className="absolute inset-0 bg-ink/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Gold top accent */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-0.5 bg-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-6">
        {/* Grade badge */}
        <span className="mb-3 inline-block self-start border border-gold/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
          {product.grade}
        </span>

        {/* Product name */}
        <h3
          className="text-white"
          style={{
            fontFamily: 'var(--font-bebas-neue)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          {product.name}
        </h3>

        {/* Description — hidden initially, revealed on hover */}
        <p className="mt-3 max-h-0 overflow-hidden text-[13px] leading-6 text-white/65 transition-all duration-500 group-hover:max-h-24">
          {product.description}
        </p>

        {/* Specs — slide up on hover */}
        <ul
          className="mt-4 translate-y-4 space-y-1.5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`${product.name} specifications`}
        >
          {product.specs.map(spec => (
            <li key={spec.label} className="flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {spec.label}
              </span>
              <span className="text-[11px] font-medium text-white/80">
                {spec.value}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA link */}
        <Link
          href="#contact"
          className="group/link mt-5 inline-flex translate-y-4 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Request a quote for ${product.name}`}
        >
          Request Quote
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover/link:translate-x-1"
          />
        </Link>
      </div>
    </motion.article>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function Commodities({ products }: { products: Product[] }) {
  return (
    <section
      id="commodities"
      aria-label="Our petroleum commodities"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
              Our Commodities
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
              World-Class
              <br />
              <span style={{ color: 'var(--color-gold)' }}>Petroleum Commodities</span>
            </h2>
          </motion.div>

          <motion.p
            className="max-w-sm text-[14px] leading-7 text-muted lg:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            Every commodity we supply is tested and certified against international
            standards. Hover each card to explore full specifications.
          </motion.p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 flex items-center justify-between border-t border-border pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        >
          <p className="text-[12px] text-muted">
            All commodities sourced from certified refineries across 7 nations.
          </p>
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
          >
            Discuss Your Requirements
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
