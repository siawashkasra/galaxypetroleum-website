'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/data'
import type { Project } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Project card ───────────────────────────────────────────── */

function ProjectCard({
  project,
  className = '',
  imagePosition = 'center',
}: {
  project: Project
  className?: string
  imagePosition?: string
}) {
  return (
    <motion.article
      className={`group relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      {/* Image */}
      <Image
        src={project.image}
        alt={project.title}
        fill
        className={`object-cover object-${imagePosition} transition-transform duration-700 group-hover:scale-105`}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
      />

      {/* Permanent gradient — bottom legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-ink/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top-right icon */}
      <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/20 bg-ink/40 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
        <ArrowUpRight size={15} strokeWidth={1.5} className="text-gold" />
      </div>

      {/* Content — sits at the bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        {/* Category + year */}
        <div className="mb-3 flex items-center gap-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-gold">
            {project.category}
          </span>
          <span className="text-[9px] text-white/40">{project.year}</span>
        </div>

        {/* Title */}
        <h3
          className="text-white"
          style={{
            fontFamily: 'var(--font-bebas-neue)',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            letterSpacing: '0.04em',
            lineHeight: 1.05,
          }}
        >
          {project.title}
        </h3>

        {/* Description — revealed on hover */}
        <p className="mt-0 max-h-0 overflow-hidden text-[13px] leading-6 text-white/65 transition-all duration-500 group-hover:mt-3 group-hover:max-h-20">
          {project.description}
        </p>

        {/* Gold underline — expands on hover */}
        <div className="mt-4 h-px w-0 bg-gold transition-all duration-500 group-hover:w-12" />
      </div>
    </motion.article>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function Projects() {
  const [p1, p2, p3, p4] = projects

  return (
    <section
      id="projects"
      aria-label="Featured projects"
      className="bg-surface"
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
              Featured Projects
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
              Delivering at
              <br />
              <span style={{ color: 'var(--color-gold)' }}>Every Scale</span>
            </h2>
          </motion.div>

          <motion.p
            className="max-w-sm text-[14px] leading-7 text-muted lg:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            From city-wide distribution networks to emergency fuel programs —
            Galaxy Petroleum has built the infrastructure Afghanistan depends on.
          </motion.p>
        </div>

        {/* ── Bento grid ────────────────────────────────────────── */}

        {/* Mobile: stacked */}
        <div className="flex flex-col gap-4 lg:hidden">
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              className="h-72 w-full"
            />
          ))}
        </div>

        {/* Desktop: asymmetric bento */}
        <div className="hidden gap-4 lg:grid lg:grid-cols-3 lg:grid-rows-2">
          {/* Row 1: large left (2 cols), narrow right */}
          <ProjectCard
            project={p1}
            className="col-span-2 row-span-1 h-80"
            imagePosition="center"
          />
          <ProjectCard
            project={p2}
            className="col-span-1 row-span-2 h-full min-h-[660px]"
            imagePosition="center"
          />

          {/* Row 2: narrow left, large right (2 cols) */}
          <ProjectCard
            project={p3}
            className="col-span-1 row-span-1 h-80"
            imagePosition="center"
          />
          <ProjectCard
            project={p4}
            className="col-span-1 row-span-1 h-80"
            imagePosition="center"
          />
        </div>

        {/* Footer note */}
        <motion.p
          className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-muted"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        >
          3,000+ projects completed since 2023 across all 34 provinces
        </motion.p>
      </div>
    </section>
  )
}
