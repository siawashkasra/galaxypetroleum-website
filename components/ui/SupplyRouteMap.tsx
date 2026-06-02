'use client'

import { useState, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from 'react-simple-maps'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Geography source ───────────────────────────────────────── */
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json'

/* ─── Country data ───────────────────────────────────────────── */
const SOURCE_COUNTRIES = [
  { name: 'Russia',       coords: [37.62,  55.75] as [number, number], flag: '🇷🇺', label: 'Russia'       },
  { name: 'Belarus',      coords: [27.57,  53.90] as [number, number], flag: '🇧🇾', label: 'Belarus'      },
  { name: 'Azerbaijan',   coords: [49.87,  40.41] as [number, number], flag: '🇦🇿', label: 'Azerbaijan'   },
  { name: 'Iraq',         coords: [44.40,  33.34] as [number, number], flag: '🇮🇶', label: 'Iraq'         },
  { name: 'Turkmenistan', coords: [58.38,  37.95] as [number, number], flag: '🇹🇲', label: 'Turkmenistan' },
  { name: 'Uzbekistan',   coords: [69.24,  41.30] as [number, number], flag: '🇺🇿', label: 'Uzbekistan'   },
]

const BORDER_CROSSINGS = [
  { id: 'hairatan',   label: 'Hairatan',   coords: [67.44, 37.20] as [number, number] },
  { id: 'rozanaq',    label: 'Rozanaq',    coords: [67.53, 37.04] as [number, number] },
  { id: 'islam-qala', label: 'Islam Qala', coords: [61.27, 34.68] as [number, number] },
  { id: 'tor-ghondi', label: 'Tor Ghondi', coords: [61.56, 35.16] as [number, number] },
]

const KABUL: [number, number] = [69.17, 34.53]

const SOURCE_NAMES = new Set(SOURCE_COUNTRIES.map(c => c.name))

/* Routes: source → nearest crossing */
const ROUTE_SEGMENTS = [
  { from: [37.62, 55.75] as [number, number], to: [67.44, 37.20] as [number, number], delay: 0 },
  { from: [37.62, 55.75] as [number, number], to: [67.53, 37.04] as [number, number], delay: 0.2 },
  { from: [27.57, 53.90] as [number, number], to: [67.44, 37.20] as [number, number], delay: 0.4 },
  { from: [49.87, 40.41] as [number, number], to: [61.27, 34.68] as [number, number], delay: 0.6 },
  { from: [44.40, 33.34] as [number, number], to: [61.27, 34.68] as [number, number], delay: 0.8 },
  { from: [58.38, 37.95] as [number, number], to: [61.56, 35.16] as [number, number], delay: 1.0 },
  { from: [58.38, 37.95] as [number, number], to: [67.44, 37.20] as [number, number], delay: 1.2 },
  { from: [69.24, 41.30] as [number, number], to: [67.44, 37.20] as [number, number], delay: 1.4 },
  { from: [69.24, 41.30] as [number, number], to: [67.53, 37.04] as [number, number], delay: 1.6 },
  /* Crossings → Kabul */
  { from: [67.44, 37.20] as [number, number], to: KABUL, delay: 2.2 },
  { from: [67.53, 37.04] as [number, number], to: KABUL, delay: 2.3 },
  { from: [61.27, 34.68] as [number, number], to: KABUL, delay: 2.4 },
  { from: [61.56, 35.16] as [number, number], to: KABUL, delay: 2.5 },
]

/* ─── Colour helpers ─────────────────────────────────────────── */
const GOLD        = '#C9A84C'
const GOLD_BRIGHT = '#E8C96A'
const GOLD_DIM    = 'rgba(201,168,76,0.18)'

/* ─── Curved SVG path between two projected points ───────────── */
function curvePath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.25
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`
}

/* ─── Animated route arc ─────────────────────────────────────── */
function RouteArc({
  path,
  delay,
  visible,
}: {
  path: string
  delay: number
  visible: boolean
}) {
  return (
    <motion.path
      d={path}
      fill="none"
      stroke={GOLD}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeDasharray="4 8"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={visible
        ? { pathLength: 1, opacity: 0.85 }
        : { pathLength: 0, opacity: 0 }
      }
      transition={{
        pathLength: { delay, duration: 1.2, ease: 'easeInOut' },
        opacity:    { delay, duration: 0.3 },
      }}
    />
  )
}

/* ─── Main component ─────────────────────────────────────────── */

interface Props {
  phase: number
}

export default function SupplyRouteMap({ phase }: Props) {
  const [projectedRoutes, setProjectedRoutes] = useState<
    { path: string; delay: number }[]
  >([])

  const showSources  = phase >= 0
  const showRoutes   = phase >= 1
  const showDest     = phase >= 2

  return (
    <div className="relative w-full select-none" style={{ background: 'transparent' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 420, center: [54, 43] }}
        width={520}
        height={340}
        style={{ width: '100%', height: 'auto' }}
      >
        {/* ── Countries ─────────────────────────────────────── */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const name = geo.properties.name as string
              const isSource = SOURCE_NAMES.has(name)
              const isDest   = name === 'Afghanistan'

              if (!isSource && !isDest) {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1A1A14"
                    stroke="#2A2A20"
                    strokeWidth={0.3}
                    style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                  />
                )
              }

              if (isSource) {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                    fill={showSources ? GOLD_DIM : '#1A1A14'}
                    stroke={showSources ? GOLD : '#2A2A20'}
                    strokeWidth={showSources ? 0.8 : 0.3}
                  />
                )
              }

              // Afghanistan
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                  fill={showDest ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.08)'}
                  stroke={GOLD}
                  strokeWidth={showDest ? 1.2 : 0.5}
                />
              )
            })
          }
        </Geographies>

        {/* ── Animated route arcs ───────────────────────────── */}
        {showRoutes && ROUTE_SEGMENTS.map((seg, i) => (
          <Annotation
            key={i}
            subject={seg.to}
            dx={0} dy={0}
            connectorProps={{}}
          >
            {/* We use a custom SVG path via foreignObject trick won't work,
                so we overlay paths using a separate SVG layer below */}
            <g />
          </Annotation>
        ))}

        {/* ── Source country markers ────────────────────────── */}
        {SOURCE_COUNTRIES.map((country, i) => (
          <Marker key={country.name} coordinates={country.coords}>
            <motion.g
              initial={{ opacity: 0, scale: 0.3 }}
              animate={showSources
                ? { opacity: 1, scale: 1 }
                : { opacity: 0.3, scale: 0.7 }
              }
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Pulse ring */}
              {phase === 0 && (
                <motion.circle r={10} fill="none" stroke={GOLD} strokeWidth={0.8}
                  animate={{ scale: [0.8, 2], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut', delay: i * 0.3 }}
                  style={{ transformOrigin: '0px 0px' }}
                />
              )}
              {/* Outer ring */}
              <circle r={7} fill="none" stroke={GOLD} strokeWidth={1} opacity={0.5} />
              {/* Core */}
              <circle r={4} fill={GOLD} />
              <circle r={2} fill="#0C0C0A" />
              {/* Flag */}
              <text y={-13} textAnchor="middle" fontSize={11} style={{ fontFamily: 'sans-serif' }}>
                {country.flag}
              </text>
              {/* Name */}
              <text y={15} textAnchor="middle" fill="white" fillOpacity={0.7} fontSize={7}
                style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.06em' }}
              >
                {country.label}
              </text>
            </motion.g>
          </Marker>
        ))}

        {/* ── Border crossing markers ───────────────────────── */}
        {BORDER_CROSSINGS.map((crossing, i) => (
          <Marker key={crossing.id} coordinates={crossing.coords}>
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={showRoutes
                ? { opacity: 1, scale: 1 }
                : { opacity: 0.1, scale: 0.5 }
              }
              transition={{ delay: 1.8 + i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <rect x={-5} y={-5} width={10} height={10}
                transform="rotate(45)"
                fill={GOLD} opacity={0.9}
              />
              <rect x={-2.5} y={-2.5} width={5} height={5}
                transform="rotate(45)"
                fill={GOLD_BRIGHT}
              />
              <text x={10} y={3} fill={GOLD_BRIGHT} fontSize={6.5}
                style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.05em' }}
              >
                {crossing.label}
              </text>
            </motion.g>
          </Marker>
        ))}

        {/* ── Afghanistan destination marker ────────────────── */}
        <Marker coordinates={KABUL}>
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={showDest ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.6 }}
            transition={{ delay: 2.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Expanding rings */}
            {showDest && ([20, 14, 9] as const).map((r, i) => (
              <motion.circle key={r} r={r} fill="none" stroke={GOLD}
                strokeWidth={i === 0 ? 0.5 : 0.8}
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: i * 0.8 }}
                style={{ transformOrigin: '0px 0px' }}
              />
            ))}
            <circle r={8} fill={GOLD} opacity={0.2} />
            <circle r={6} fill={GOLD} />
            <circle r={3} fill="white" />
            <text y={-16} textAnchor="middle" fontSize={13} style={{ fontFamily: 'sans-serif' }}>🇦🇫</text>
            <text y={16} textAnchor="middle" fill={GOLD_BRIGHT} fontSize={7.5}
              style={{ fontFamily: 'var(--font-inter),sans-serif', fontWeight: 600, letterSpacing: '0.12em' }}
            >AFGHANISTAN</text>
            {showDest && (
              <text y={25} textAnchor="middle" fill={GOLD} fillOpacity={0.6} fontSize={6}
                style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.18em' }}
              >FINAL DESTINATION</text>
            )}
          </motion.g>
        </Marker>

      </ComposableMap>

      {/* ── Route arcs — rendered as an SVG overlay ────────── */}
      <RoutesOverlay phase={phase} />
    </div>
  )
}

/* ─── Routes overlay ─────────────────────────────────────────── */
/*
 * react-simple-maps projects coordinates internally. To draw curved
 * animated arcs we replicate the same geoMercator projection in a
 * matching-size overlay SVG that sits on top of the map.
 */
function RoutesOverlay({ phase }: { phase: number }) {
  const [paths, setPaths] = useState<{ d: string; delay: number }[]>([])

  useEffect(() => {
    /* Mirror the ComposableMap projection */
    import('d3-geo').then(({ geoMercator }) => {
      const proj = geoMercator().scale(420).center([54, 43]).translate([260, 170])
      const computed = ROUTE_SEGMENTS.map(seg => {
        const [x1, y1] = proj(seg.from) ?? [0, 0]
        const [x2, y2] = proj(seg.to)   ?? [0, 0]
        return { d: curvePath(x1, y1, x2, y2), delay: seg.delay }
      })
      setPaths(computed)
    })
  }, [])

  const visible = phase >= 1

  return (
    <svg
      viewBox="0 0 520 340"
      className="pointer-events-none absolute inset-0 w-full"
      style={{ height: 'auto' }}
    >
      {paths.map((p, i) => (
        <RouteArc key={i} path={p.d} delay={p.delay} visible={visible} />
      ))}
    </svg>
  )
}
