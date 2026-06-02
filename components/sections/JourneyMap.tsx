'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Phase definitions ──────────────────────────────────────── */

const PHASES = [
  {
    step: '01',
    tag: 'Origin',
    headline: 'Six Nations\nFeed the Network',
    body: 'Galaxy Petroleum sources from Russia, Belarus, Azerbaijan, Iraq, Turkmenistan, and Uzbekistan — a strategically diversified supply chain that guarantees continuity regardless of regional disruptions.',
    items: [
      { label: 'Russia',       flag: '🇷🇺', detail: 'Diesel · AI 92 · LPG'         },
      { label: 'Belarus',      flag: '🇧🇾', detail: 'Diesel · AI 80'               },
      { label: 'Azerbaijan',   flag: '🇦🇿', detail: 'AI 92 · Diesel'              },
      { label: 'Iraq',         flag: '🇮🇶', detail: 'Diesel · LPG'                },
      { label: 'Turkmenistan', flag: '🇹🇲', detail: 'AI 80 · Diesel · LPG'        },
      { label: 'Uzbekistan',   flag: '🇺🇿', detail: 'AI 92 · Diesel'              },
    ],
  },
  {
    step: '02',
    tag: 'Transit',
    headline: 'Four Gateways\nInto Afghanistan',
    body: 'Fuel enters Afghanistan through four strategically positioned border crossings — each connecting a distinct supply corridor to the national distribution network.',
    items: [
      { label: 'Hairatan',   flag: '🔰', detail: 'Northern · Uzbekistan border'   },
      { label: 'Rozanaq',    flag: '🔰', detail: 'Northern · Uzbekistan border'   },
      { label: 'Islam Qala', flag: '🔰', detail: 'Western · Iran border'          },
      { label: 'Tor Ghondi', flag: '🔰', detail: 'Western · Turkmenistan border'  },
    ],
  },
  {
    step: '03',
    tag: 'Destination',
    headline: 'Powering\nAfghanistan Forward',
    body: 'From Kabul to the provinces, Galaxy Petroleum delivers world-class fuel to businesses, generators, construction sites, and communities — reliably and on schedule.',
    items: [
      { label: '34 Provinces', flag: '📍', detail: 'National coverage'            },
      { label: '3,000+ Projects', flag: '⚙️', detail: 'Delivered since 2023'    },
      { label: '60+ Partners',    flag: '🤝', detail: 'Across all sectors'       },
      { label: '100+ Team',       flag: '👥', detail: 'Dedicated professionals'  },
    ],
  },
]

/* ─── SVG map data ───────────────────────────────────────────── */

const SOURCE_NODES = [
  { id: 'russia',       label: 'Russia',       flag: '🇷🇺', x: 238, y: 36  },
  { id: 'belarus',      label: 'Belarus',      flag: '🇧🇾', x: 100, y: 52  },
  { id: 'azerbaijan',   label: 'Azerbaijan',   flag: '🇦🇿', x: 132, y: 126 },
  { id: 'iraq',         label: 'Iraq',         flag: '🇮🇶', x: 112, y: 194 },
  { id: 'turkmenistan', label: 'Turkmenistan', flag: '🇹🇲', x: 292, y: 126 },
  { id: 'uzbekistan',   label: 'Uzbekistan',   flag: '🇺🇿', x: 310, y: 78  },
]

const CROSSING_NODES = [
  { id: 'hairatan',   label: 'Hairatan',   x: 295, y: 216 },
  { id: 'rozanaq',    label: 'Rozanaq',    x: 316, y: 208 },
  { id: 'islam-qala', label: 'Islam Qala', x: 205, y: 238 },
  { id: 'tor-ghondi', label: 'Tor Ghondi', x: 238, y: 228 },
]

const ROUTE_PATHS = [
  'M238,36  C250,128 278,174 295,216',
  'M238,36  C262,124 308,168 316,208',
  'M100,52  C148,128 228,178 295,216',
  'M132,126 C148,176 176,214 205,238',
  'M112,194 C138,208 168,224 205,238',
  'M292,126 C274,166 256,196 238,228',
  'M292,126 C292,168 292,194 295,216',
  'M310,78  C308,148 298,184 295,216',
  'M310,78  C316,142 318,174 316,208',
  'M295,216 C292,246 282,266 268,286',
  'M316,208 C308,240 288,266 268,286',
  'M205,238 C220,258 248,274 268,286',
  'M238,228 C246,252 256,270 268,286',
]

/* opacity[type][phase] */
const OPC = {
  source:   [1.00, 0.30, 0.40],
  route:    [0.12, 0.90, 0.50],
  crossing: [0.20, 1.00, 0.45],
  dest:     [0.10, 0.30, 1.00],
} as const

type OpcKey = keyof typeof OPC
const opc = (key: OpcKey, phase: number) => OPC[key][phase] ?? 1

/* ─── Journey SVG ────────────────────────────────────────────── */

function JourneyViz({ phase }: { phase: number }) {
  const tr = 'opacity 0.7s ease'

  return (
    <svg
      viewBox="0 0 480 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full"
    >
      <defs>
        <radialGradient id="jdest-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
        <filter id="jglow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Afghanistan territory */}
      <path
        d="M190,220 L318,202 L360,228 L368,282 L338,312 L274,318 L208,292 L192,262 Z"
        fill="#C9A84C"
        stroke="#C9A84C"
        strokeWidth="1"
        strokeDasharray="4 6"
        style={{ fillOpacity: opc('dest', phase) * 0.06, strokeOpacity: opc('dest', phase) * 0.18, transition: tr }}
      />

      {/* Destination glow aura */}
      <circle
        cx={268} cy={286} r={55}
        fill="url(#jdest-glow)"
        style={{ opacity: opc('dest', phase), transition: tr }}
      />

      {/* Route paths */}
      {ROUTE_PATHS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 10"
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'linear', delay: i * 0.1 }}
          style={{ opacity: opc('route', phase), transition: tr }}
        />
      ))}

      {/* Source country nodes */}
      {SOURCE_NODES.map(node => (
        <g key={node.id} style={{ opacity: opc('source', phase), transition: tr }}>
          {/* Pulse ring — only visible in phase 0 */}
          <motion.circle
            cx={node.x} cy={node.y} r={10}
            stroke="#C9A84C" strokeWidth="1" fill="none"
            animate={{ scale: [0.8, 1.8], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut', delay: Math.random() * 1.5 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px`, display: phase === 0 ? 'block' : 'none' }}
          />
          <circle cx={node.x} cy={node.y} r={6} stroke="#C9A84C" strokeWidth="1.5" fill="#0C0C0A" />
          <circle cx={node.x} cy={node.y} r={2.5} fill="#C9A84C" />
          {/* Flag */}
          <text x={node.x} y={node.y - 13} textAnchor="middle" fontSize="10" style={{ fontFamily: 'sans-serif' }}>
            {node.flag}
          </text>
          {/* Name */}
          <text
            x={node.x} y={node.y + 17}
            textAnchor="middle"
            fill="white" fillOpacity="0.55"
            fontSize="7.5"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.06em' }}
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Border crossing nodes */}
      {CROSSING_NODES.map(node => (
        <g key={node.id} style={{ opacity: opc('crossing', phase), transition: tr }}>
          <rect
            x={node.x - 5} y={node.y - 5} width={10} height={10}
            transform={`rotate(45 ${node.x} ${node.y})`}
            fill="#C9A84C" fillOpacity="0.9"
            filter={phase === 1 ? 'url(#jglow)' : undefined}
          />
          <text
            x={node.x + 9} y={node.y + 3}
            fill="#C9A84C" fillOpacity="0.9"
            fontSize="7.5"
            style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.05em' }}
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Afghanistan destination */}
      <g style={{ opacity: opc('dest', phase), transition: tr }}>
        {phase === 2 && (
          <>
            <motion.circle
              cx={268} cy={286} r={24} stroke="#C9A84C" strokeWidth="0.8" fill="none"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ transformOrigin: '268px 286px' }}
            />
            <motion.circle
              cx={268} cy={286} r={16} stroke="#C9A84C" strokeWidth="1" fill="none"
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.5 }}
              style={{ transformOrigin: '268px 286px' }}
            />
          </>
        )}
        <circle cx={268} cy={286} r={10} fill="#C9A84C" fillOpacity="0.15" filter="url(#jglow)" />
        <circle cx={268} cy={286} r={8}  fill="#C9A84C" />
        <circle cx={268} cy={286} r={3.5} fill="white" />
        <text x={268} y={268} textAnchor="middle" fontSize="13" style={{ fontFamily: 'sans-serif' }}>🇦🇫</text>
        <text
          x={268} y={304}
          textAnchor="middle" fill="#E8C96A" fontSize="9"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}
        >
          Afghanistan
        </text>
      </g>

      {/* Legend */}
      <text x={8} y={326} fill="white" fillOpacity="0.25" fontSize="7" style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.1em' }}>
        6 SOURCE NATIONS · 4 ENTRY POINTS · 1 DESTINATION
      </text>
    </svg>
  )
}

/* ─── Phase text content ─────────────────────────────────────── */

function PhaseContent({ phase }: { phase: number }) {
  const p = PHASES[phase]
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        className="flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* Step + tag */}
        <div className="mb-4 flex items-center gap-3">
          <span
            className="text-white/30"
            style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: '1.1rem', letterSpacing: '0.1em' }}
          >
            {p.step}
          </span>
          <span className="h-px w-6 bg-white/20" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
            {p.tag}
          </span>
        </div>

        {/* Headline */}
        <h3
          className="text-white"
          style={{
            fontFamily: 'var(--font-bebas-neue)',
            fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
            lineHeight: 0.95,
            letterSpacing: '0.02em',
            whiteSpace: 'pre-line',
          }}
        >
          {p.headline}
        </h3>

        {/* Gold rule */}
        <div className="my-6 h-px w-10 bg-gold opacity-60" />

        {/* Body */}
        <p className="max-w-xs text-[14px] leading-7 text-white/55">
          {p.body}
        </p>

        {/* Detail list */}
        <ul className="mt-8 space-y-2.5">
          {p.items.map(item => (
            <li key={item.label} className="flex items-center gap-3">
              <span className="text-base leading-none">{item.flag}</span>
              <span className="text-[12px] font-medium text-white/80">{item.label}</span>
              <span className="ml-auto text-[11px] text-white/35">{item.detail}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─── Section ────────────────────────────────────────────────── */

export default function JourneyMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)
  const [mobilePhase, setMobilePhase] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (v < 0.38)      setPhase(0)
    else if (v < 0.72) setPhase(1)
    else               setPhase(2)
  })

  return (
    <section id="journey" aria-label="The supply chain journey">

      {/* ── Desktop — sticky scroll ───────────────────────────── */}
      <div
        ref={containerRef}
        className="relative hidden h-[300vh] lg:block"
        style={{ background: '#0C0C0A' }}
      >
        <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">

          {/* Section header */}
          <div className="flex items-end justify-between border-b border-white/8 px-10 pb-5 pt-10">
            <div>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold">
                The Journey
              </p>
              <h2
                className="text-white"
                style={{
                  fontFamily: 'var(--font-bebas-neue)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                  letterSpacing: '0.04em',
                }}
              >
                From Source to Destination
              </h2>
            </div>

            {/* Phase progress dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Journey phases">
              {PHASES.map((p, i) => (
                <button
                  key={p.step}
                  role="tab"
                  aria-selected={phase === i}
                  aria-label={p.tag}
                  onClick={() => setPhase(i)}
                  className="flex items-center gap-2 transition-opacity duration-300"
                  style={{ opacity: phase === i ? 1 : 0.35 }}
                >
                  <span
                    className="transition-all duration-500"
                    style={{
                      display: 'block',
                      width: phase === i ? '24px' : '6px',
                      height: '2px',
                      background: 'var(--color-gold)',
                      borderRadius: '99px',
                    }}
                  />
                  <span className="text-[9px] uppercase tracking-wider text-white/60">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="grid flex-1 grid-cols-[38%_62%] overflow-hidden">

            {/* Left — phase text */}
            <div className="flex flex-col justify-center border-r border-white/8 px-10 py-8">
              <PhaseContent phase={phase} />
            </div>

            {/* Right — visualization */}
            <div className="flex items-center justify-center px-8 py-6">
              <div className="w-full max-w-[520px]">
                <JourneyViz phase={phase} />
              </div>
            </div>
          </div>

          {/* Scroll progress bar */}
          <motion.div
            className="h-0.5 bg-gold"
            style={{ scaleX: scrollYProgress, transformOrigin: 'left', opacity: 0.6 }}
          />

          {/* Scroll hint — fades out after first phase */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30"
            animate={{ opacity: phase === 0 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-[8px] uppercase tracking-[0.35em]">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v8M3 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Mobile — tabbed layout ────────────────────────────── */}
      <div className="lg:hidden" style={{ background: '#0C0C0A' }}>
        {/* Header */}
        <div className="border-b border-white/8 px-6 pb-5 pt-10">
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold">
            The Journey
          </p>
          <h2
            className="text-white"
            style={{ fontFamily: 'var(--font-bebas-neue)', fontSize: '2rem', letterSpacing: '0.04em' }}
          >
            From Source to Destination
          </h2>
        </div>

        {/* Visualization */}
        <div className="px-6 py-8">
          <JourneyViz phase={mobilePhase} />
        </div>

        {/* Phase tabs */}
        <div className="flex border-b border-white/8">
          {PHASES.map((p, i) => (
            <button
              key={p.step}
              onClick={() => setMobilePhase(i)}
              className="flex-1 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300"
              style={{
                color: mobilePhase === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.35)',
                borderBottom: mobilePhase === i ? '2px solid var(--color-gold)' : '2px solid transparent',
              }}
            >
              {p.tag}
            </button>
          ))}
        </div>

        {/* Mobile phase content */}
        <div className="px-6 py-8">
          <PhaseContent phase={mobilePhase} />
        </div>
      </div>

    </section>
  )
}
