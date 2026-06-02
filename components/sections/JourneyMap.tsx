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

interface RouteEdge { id: string; d: string; dur: string; begin: string }
const ROUTES: RouteEdge[] = [
  { id: 'jr0',  d: 'M238,36  C250,128 278,174 295,216', dur: '2.8s', begin: '0.0s' },
  { id: 'jr1',  d: 'M238,36  C262,124 308,168 316,208', dur: '2.9s', begin: '0.3s' },
  { id: 'jr2',  d: 'M100,52  C148,128 228,178 295,216', dur: '3.4s', begin: '0.6s' },
  { id: 'jr3',  d: 'M132,126 C148,176 176,214 205,238', dur: '2.5s', begin: '0.9s' },
  { id: 'jr4',  d: 'M112,194 C138,208 168,224 205,238', dur: '2.2s', begin: '1.2s' },
  { id: 'jr5',  d: 'M292,126 C274,166 256,196 238,228', dur: '2.4s', begin: '1.5s' },
  { id: 'jr6',  d: 'M292,126 C292,168 292,194 295,216', dur: '2.3s', begin: '1.8s' },
  { id: 'jr7',  d: 'M310,78  C308,148 298,184 295,216', dur: '2.7s', begin: '2.1s' },
  { id: 'jr8',  d: 'M310,78  C316,142 318,174 316,208', dur: '2.8s', begin: '2.4s' },
  { id: 'jr9',  d: 'M295,216 C292,246 282,266 268,286', dur: '1.6s', begin: '2.7s' },
  { id: 'jr10', d: 'M316,208 C308,240 288,266 268,286', dur: '1.7s', begin: '2.9s' },
  { id: 'jr11', d: 'M205,238 C220,258 248,274 268,286', dur: '1.8s', begin: '3.1s' },
  { id: 'jr12', d: 'M238,228 C246,252 256,270 268,286', dur: '1.7s', begin: '3.3s' },
]

/* Phase opacity table */
const OPC = {
  source:   [1.00, 0.22, 0.35],
  route:    [0.10, 1.00, 0.55],
  crossing: [0.14, 1.00, 0.42],
  dest:     [0.08, 0.28, 1.00],
} as const

type OpcKey = keyof typeof OPC
const opc = (key: OpcKey, phase: number) => OPC[key][phase] ?? 1

/* ─── Premium Journey SVG ────────────────────────────────────── */

function JourneyViz({ phase }: { phase: number }) {
  const T = 'opacity 0.65s ease, filter 0.65s ease'

  return (
    <svg
      viewBox="0 0 480 342"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full"
    >
      <defs>
        {ROUTES.map(r => <path key={`def-${r.id}`} id={r.id} d={r.d} />)}

        <filter id="glow-lg" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-md" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-sm" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="blur-only"><feGaussianBlur stdDeviation="5" /></filter>

        <pattern id="jdots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="11" cy="11" r="0.7" fill="#C9A84C" opacity="0.12" />
        </pattern>

        <linearGradient id="rgrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.35" />
          <stop offset="65%"  stopColor="#C9A84C" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#E8C96A" stopOpacity="0.95" />
        </linearGradient>

        <radialGradient id="dest-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.45" />
          <stop offset="55%"  stopColor="#C9A84C" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Dot-grid texture */}
      <rect width="480" height="342" fill="url(#jdots)" />

      {/* Transit zone horizon line */}
      <line x1="0" y1="204" x2="480" y2="204"
        stroke="#C9A84C" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="6 14" />

      {/* Afghanistan territory polygon */}
      <path
        d="M188,218 L320,200 L362,226 L370,280 L340,312 L274,318 L206,292 L190,260 Z"
        fill="#C9A84C" stroke="#C9A84C" strokeWidth="1" strokeDasharray="5 8"
        style={{ fillOpacity: opc('dest', phase) * 0.07, strokeOpacity: opc('dest', phase) * 0.22, transition: T }}
      />

      {/* Route glow base */}
      {ROUTES.map(r => (
        <path key={`gb-${r.id}`} d={r.d}
          stroke="#C9A84C" strokeWidth="6" strokeLinecap="round"
          filter="url(#blur-only)"
          style={{ opacity: opc('route', phase) * 0.22, transition: T }}
        />
      ))}

      {/* Route dashed main lines */}
      {ROUTES.map(r => (
        <motion.path key={`ml-${r.id}`} d={r.d}
          stroke="url(#rgrad)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="5 13"
          animate={{ strokeDashoffset: [0, -18] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          style={{ opacity: opc('route', phase), transition: T }}
        />
      ))}

      {/* Flowing particles */}
      {ROUTES.map(r => (
        <circle key={`pt-${r.id}`} r="2.8" fill="#E8C96A"
          style={{ opacity: opc('route', phase) * 0.95, transition: T }}
        >
          <animateMotion dur={r.dur} repeatCount="indefinite" begin={r.begin}>
            <mpath href={`#${r.id}`} />
          </animateMotion>
        </circle>
      ))}

      {/* Source country nodes */}
      {SOURCE_NODES.map((node, i) => (
        <g key={node.id} style={{ opacity: opc('source', phase), transition: T }}>
          <motion.circle cx={node.x} cy={node.y} r={15}
            stroke="#C9A84C" strokeWidth="0.8" fill="none"
            animate={phase === 0 ? { scale: [0.9, 1.9], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut', delay: i * 0.35 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          />
          <circle cx={node.x} cy={node.y} r={11}
            stroke="#C9A84C" strokeWidth="1" fill="none" strokeOpacity="0.45"
            filter={phase === 0 ? 'url(#glow-sm)' : undefined}
          />
          <circle cx={node.x} cy={node.y} r={7} stroke="#C9A84C" strokeWidth="1.2" fill="#0C0C0A" />
          <circle cx={node.x} cy={node.y} r={3.5} fill="#C9A84C"
            filter={phase === 0 ? 'url(#glow-sm)' : undefined}
          />
          <text x={node.x} y={node.y - 18} textAnchor="middle" fontSize="11"
            style={{ fontFamily: 'sans-serif' }}>{node.flag}</text>
          <text x={node.x} y={node.y + 21} textAnchor="middle"
            fill="white" fillOpacity="0.65" fontSize="7.5"
            style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.07em' }}
          >{node.label}</text>
        </g>
      ))}

      {/* Border crossing nodes */}
      {CROSSING_NODES.map(node => (
        <g key={node.id} style={{ opacity: opc('crossing', phase), transition: T }}>
          <rect x={node.x - 9} y={node.y - 9} width={18} height={18}
            transform={`rotate(45 ${node.x} ${node.y})`}
            fill="none" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.4"
            filter={phase === 1 ? 'url(#glow-sm)' : undefined}
          />
          <rect x={node.x - 6} y={node.y - 6} width={12} height={12}
            transform={`rotate(45 ${node.x} ${node.y})`}
            fill="#C9A84C" fillOpacity="0.9"
            filter={phase === 1 ? 'url(#glow-sm)' : undefined}
          />
          <rect x={node.x - 3} y={node.y - 3} width={6} height={6}
            transform={`rotate(45 ${node.x} ${node.y})`}
            fill="#E8C96A"
          />
          <text x={node.x + 12} y={node.y + 3.5}
            fill="#E8C96A" fillOpacity="0.9" fontSize="7.5"
            style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.06em', fontWeight: 500 }}
          >{node.label}</text>
        </g>
      ))}

      {/* Phase zone labels */}
      <text x={468} y={96} textAnchor="end" fill="#C9A84C" fontSize="7" letterSpacing="0.14em"
        style={{ opacity: phase === 0 ? 0.7 : 0.1, transition: T, fontFamily: 'var(--font-inter),sans-serif' }}
      >SOURCE NATIONS ↓</text>
      <text x={468} y={206} textAnchor="end" fill="#C9A84C" fontSize="7" letterSpacing="0.14em"
        style={{ opacity: phase === 1 ? 0.7 : 0.1, transition: T, fontFamily: 'var(--font-inter),sans-serif' }}
      >TRANSIT ZONE ↓</text>

      {/* Afghanistan destination */}
      <g>
        {/* Massive aura */}
        <circle cx={268} cy={284} r={72} fill="url(#dest-aura)"
          style={{ opacity: opc('dest', phase), transition: T }}
        />

        {/* Expanding rings — phase 2 */}
        {([38, 28, 20] as const).map((r, i) => (
          <motion.circle key={r} cx={268} cy={284} r={r}
            stroke="#C9A84C" strokeWidth={i === 0 ? 0.6 : 0.9} fill="none"
            animate={phase === 2
              ? { scale: [1, 1 + 0.25 * (i + 1), 1], opacity: [0.35, 0, 0.35] }
              : { scale: 1, opacity: 0 }
            }
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: i * 0.7 }}
            style={{ transformOrigin: '268px 284px' }}
          />
        ))}

        {/* Static ring */}
        <circle cx={268} cy={284} r={16}
          stroke="#C9A84C" strokeWidth="1" fill="none"
          style={{ opacity: opc('dest', phase) * 0.6, transition: T }}
          filter={phase === 2 ? 'url(#glow-md)' : undefined}
        />

        {/* Glow fill */}
        <circle cx={268} cy={284} r={13} fill="#C9A84C"
          style={{ opacity: opc('dest', phase) * 0.18, transition: T }}
          filter="url(#glow-lg)"
        />

        {/* Core */}
        <circle cx={268} cy={284} r={10} fill="#C9A84C"
          style={{ opacity: opc('dest', phase), transition: T }}
          filter={phase === 2 ? 'url(#glow-md)' : undefined}
        />
        <circle cx={268} cy={284} r={4.5} fill="white"
          style={{ opacity: opc('dest', phase), transition: T }}
        />

        {/* Flag */}
        <text x={268} y={264} textAnchor="middle" fontSize="14"
          style={{ opacity: opc('dest', phase), transition: T, fontFamily: 'sans-serif' }}
        >🇦🇫</text>

        {/* AFGHANISTAN label */}
        <text x={268} y={305} textAnchor="middle" fill="#E8C96A" fontSize="9" letterSpacing="0.16em"
          style={{ opacity: opc('dest', phase), transition: T, fontFamily: 'var(--font-inter),sans-serif', fontWeight: 600 }}
        >AFGHANISTAN</text>

        {/* FINAL DESTINATION — phase 2 only */}
        <text x={268} y={318} textAnchor="middle" fill="#C9A84C" fontSize="6.5" letterSpacing="0.2em"
          style={{ opacity: phase === 2 ? 0.55 : 0, transition: T, fontFamily: 'var(--font-inter),sans-serif' }}
        >FINAL DESTINATION</text>
      </g>

      {/* Legend */}
      <text x={8} y={338} fill="white" fillOpacity="0.22" fontSize="6.5"
        style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.1em' }}
      >6 SOURCE NATIONS · 4 ENTRY POINTS · 1 DESTINATION</text>
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
