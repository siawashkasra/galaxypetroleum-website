'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { team } from '@/lib/data'
import type { TeamMember } from '@/lib/types'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Team card ──────────────────────────────────────────────── */

function TeamCard({
  member,
  index,
}: {
  member: TeamMember
  index: number
}) {
  return (
    <motion.article
      className="group flex flex-col"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      {/* Photo */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
        <Image
          src={member.image}
          alt={`${member.name} — ${member.title}`}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Warm overlay — ties portraits to the brand palette */}
        <div className="absolute inset-0 bg-gold/5 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
      </div>

      {/* Info */}
      <div className="border-b border-border pb-5 pt-5">
        {/* Gold accent line */}
        <div
          aria-hidden="true"
          className="mb-4 h-0.5 w-8 bg-gold transition-all duration-500 group-hover:w-full"
        />

        <h3
          className="text-ink transition-colors duration-300 group-hover:text-gold"
          style={{
            fontFamily: 'var(--font-bebas-neue)',
            fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          {member.name}
        </h3>

        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          {member.title}
        </p>
      </div>
    </motion.article>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function Team() {
  return (
    <section
      id="team"
      aria-label="Our team"
      className="bg-surface"
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
              Our Team
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
              The People Who
              <br />
              <span style={{ color: 'var(--color-gold)' }}>Make It Happen</span>
            </h2>
          </motion.div>

          <motion.p
            className="max-w-sm text-[14px] leading-7 text-muted lg:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            A dedicated team of energy professionals, logistics specialists,
            and market experts — united by one goal: keeping Afghanistan
            reliably powered.
          </motion.p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* Culture note */}
        <motion.div
          className="mt-20 border-t border-border pt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                label: 'Our Culture',
                text: 'We operate with the precision of a global energy company and the agility of a team that knows Afghanistan from the inside.',
              },
              {
                label: 'Our Commitment',
                text: 'Every team member is personally accountable to the clients and communities we serve — from first contact to final delivery.',
              },
              {
                label: 'Join Us',
                text: "Galaxy Petroleum is growing. If you're passionate about energy, logistics, or market intelligence, we want to hear from you.",
              },
            ].map(({ label, text }) => (
              <div key={label}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                  {label}
                </p>
                <p className="text-[13px] leading-7 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
