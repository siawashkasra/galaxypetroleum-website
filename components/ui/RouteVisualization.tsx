'use client'

import { motion, useReducedMotion } from 'framer-motion'

/* ─── Data ────────────────────────────────────────────────────────────── */

type NodeType = 'source' | 'crossing' | 'destination'

interface MapNode {
  id: string
  label: string
  x: number
  y: number
  type: NodeType
}

interface RouteEdge {
  id: string
  d: string       // SVG path (bezier)
  delay: number   // stagger delay for draw-in
  dur: string     // particle travel duration
}

const NODES: MapNode[] = [
  // Source countries
  { id: 'russia',       label: 'Russia',       x: 238, y: 36,  type: 'source' },
  { id: 'belarus',      label: 'Belarus',      x: 100, y: 52,  type: 'source' },
  { id: 'azerbaijan',   label: 'Azerbaijan',   x: 132, y: 126, type: 'source' },
  { id: 'iraq',         label: 'Iraq',         x: 112, y: 194, type: 'source' },
  { id: 'turkmenistan', label: 'Turkmenistan', x: 292, y: 126, type: 'source' },
  { id: 'uzbekistan',   label: 'Uzbekistan',   x: 310, y: 78,  type: 'source' },
  // Border crossings
  { id: 'hairatan',   label: 'Hairatan',   x: 295, y: 216, type: 'crossing' },
  { id: 'rozanaq',    label: 'Rozanaq',    x: 316, y: 208, type: 'crossing' },
  { id: 'islam-qala', label: 'Islam Qala', x: 205, y: 238, type: 'crossing' },
  { id: 'tor-ghondi', label: 'Tor Ghondi', x: 238, y: 228, type: 'crossing' },
  // Destination
  { id: 'kabul', label: 'Afghanistan', x: 268, y: 286, type: 'destination' },
]

const ROUTES: RouteEdge[] = [
  // Source → border crossings
  { id: 'r-rus-hair',   d: 'M238,36  C250,128 278,174 295,216', delay: 0.2, dur: '3.0s' },
  { id: 'r-rus-roz',    d: 'M238,36  C262,124 308,168 316,208', delay: 0.4, dur: '3.2s' },
  { id: 'r-bel-hair',   d: 'M100,52  C148,128 228,178 295,216', delay: 0.6, dur: '3.8s' },
  { id: 'r-aze-isl',    d: 'M132,126 C148,176 176,214 205,238', delay: 0.8, dur: '2.8s' },
  { id: 'r-ira-isl',    d: 'M112,194 C138,208 168,224 205,238', delay: 1.0, dur: '2.4s' },
  { id: 'r-tkm-tor',    d: 'M292,126 C274,166 256,196 238,228', delay: 1.2, dur: '2.6s' },
  { id: 'r-tkm-hair',   d: 'M292,126 C292,168 292,194 295,216', delay: 1.3, dur: '2.5s' },
  { id: 'r-uzb-hair',   d: 'M310,78  C308,148 298,184 295,216', delay: 1.5, dur: '2.9s' },
  { id: 'r-uzb-roz',    d: 'M310,78  C316,142 318,174 316,208', delay: 1.6, dur: '3.1s' },
  // Border crossings → Afghanistan
  { id: 'r-hair-kab',  d: 'M295,216 C292,246 282,266 268,286', delay: 2.2, dur: '2.0s' },
  { id: 'r-roz-kab',   d: 'M316,208 C308,240 288,266 268,286', delay: 2.3, dur: '2.1s' },
  { id: 'r-isl-kab',   d: 'M205,238 C220,258 248,274 268,286', delay: 2.4, dur: '2.2s' },
  { id: 'r-tor-kab',   d: 'M238,228 C246,252 256,270 268,286', delay: 2.5, dur: '2.0s' },
]

/* ─── Easing ──────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* ─── Sub-components ──────────────────────────────────────────────────── */

function SourceNode({ node }: { node: MapNode }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
    >
      {/* Outer pulse ring */}
      <motion.circle
        cx={node.x} cy={node.y} r={9}
        stroke="#C9A84C" strokeWidth="1" fill="none"
        initial={{ scale: 0.8, opacity: 0.7 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
      />
      {/* Ring */}
      <circle cx={node.x} cy={node.y} r={6} stroke="#C9A84C" strokeWidth="1.5" fill="#0C0C0A" />
      {/* Core dot */}
      <circle cx={node.x} cy={node.y} r={2.5} fill="#C9A84C" />
      {/* Label */}
      <text
        x={node.x} y={node.y - 13}
        textAnchor="middle"
        fill="white" fillOpacity="0.55"
        fontSize="8.5"
        style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.06em' }}
      >
        {node.label}
      </text>
    </motion.g>
  )
}

function CrossingNode({ node }: { node: MapNode }) {
  const size = 7
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.0, duration: 0.5, ease: EASE }}
    >
      {/* Diamond */}
      <rect
        x={node.x - size / 2} y={node.y - size / 2}
        width={size} height={size}
        transform={`rotate(45 ${node.x} ${node.y})`}
        fill="#C9A84C" fillOpacity="0.85"
      />
      {/* Label — offset right for most, left for Hairatan/Rozanaq */}
      <text
        x={node.x + 10} y={node.y + 3}
        fill="#C9A84C" fillOpacity="0.9"
        fontSize="8"
        style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.05em' }}
      >
        {node.label}
      </text>
    </motion.g>
  )
}

function DestinationNode({ node }: { node: MapNode }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2.7, duration: 0.9, ease: EASE }}
    >
      {/* Outer pulse rings */}
      <motion.circle
        cx={node.x} cy={node.y} r={22}
        stroke="#C9A84C" strokeWidth="0.8"
        fill="none"
        animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
      />
      <motion.circle
        cx={node.x} cy={node.y} r={15}
        stroke="#C9A84C" strokeWidth="1"
        fill="none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.05, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
      />
      {/* Glow fill */}
      <circle cx={node.x} cy={node.y} r={11} fill="#C9A84C" fillOpacity="0.12" />
      {/* Core */}
      <circle cx={node.x} cy={node.y} r={8} fill="#C9A84C" />
      <circle cx={node.x} cy={node.y} r={3.5} fill="white" />
      {/* Label */}
      <text
        x={node.x} y={node.y + 22}
        textAnchor="middle"
        fill="#C9A84C"
        fontSize="9.5"
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {node.label}
      </text>
    </motion.g>
  )
}

/* ─── Main component ──────────────────────────────────────────────────── */

export default function RouteVisualization() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <svg
      viewBox="0 0 480 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Animated supply route map: petroleum flows from six source nations through four Afghan border crossings to destination"
    >
      <defs>
        {/* Invisible path copies for animateMotion reference */}
        {ROUTES.map(r => (
          <path key={`def-${r.id}`} id={r.id} d={r.d} />
        ))}

        {/* Radial glow for destination */}
        <radialGradient id="dest-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>

        {/* Gradient along route direction */}
        <linearGradient id="route-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* Subtle Afghanistan territory polygon */}
      <path
        d="M190,220 L318,202 L360,228 L368,282 L338,312 L274,318 L208,292 L192,262 Z"
        fill="#C9A84C"
        fillOpacity="0.04"
        stroke="#C9A84C"
        strokeOpacity="0.1"
        strokeWidth="1"
        strokeDasharray="4 6"
      />

      {/* Destination glow aura */}
      <circle cx={268} cy={286} r={50} fill="url(#dest-glow)" />

      {/* Route paths — draw-in animation */}
      {ROUTES.map(r => (
        <motion.path
          key={r.id}
          d={r.d}
          stroke="url(#route-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              delay: prefersReducedMotion ? 0 : r.delay,
              duration: prefersReducedMotion ? 0.01 : 1.6,
              ease: 'easeInOut',
            },
            opacity: {
              delay: prefersReducedMotion ? 0 : r.delay,
              duration: 0.3,
            },
          }}
        />
      ))}

      {/* Flowing particles along each route */}
      {!prefersReducedMotion &&
        ROUTES.map(r => (
          <circle key={`dot-${r.id}`} r="2.5" fill="#E8C96A" opacity="0.9">
            <animateMotion dur={r.dur} repeatCount="indefinite" begin={`${r.delay + 1.8}s`}>
              <mpath href={`#${r.id}`} />
            </animateMotion>
          </circle>
        ))}

      {/* Source country nodes */}
      {NODES.filter(n => n.type === 'source').map(n => (
        <SourceNode key={n.id} node={n} />
      ))}

      {/* Border crossing nodes */}
      {NODES.filter(n => n.type === 'crossing').map(n => (
        <CrossingNode key={n.id} node={n} />
      ))}

      {/* Afghanistan destination */}
      {NODES.filter(n => n.type === 'destination').map(n => (
        <DestinationNode key={n.id} node={n} />
      ))}

      {/* Legend */}
      <text
        x={8} y={324}
        fill="white" fillOpacity="0.28"
        fontSize="7.5"
        style={{ fontFamily: 'var(--font-inter), sans-serif', letterSpacing: '0.1em' }}
      >
        6 SOURCE NATIONS · 4 ENTRY POINTS · 1 DESTINATION
      </text>
    </svg>
  )
}
