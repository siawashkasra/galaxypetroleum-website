'use client'

import { useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { motion } from 'framer-motion'

/* ─── Config ─────────────────────────────────────────────────── */
const GEO_URL   = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json'
const W         = 720
const H         = 500
const SCALE     = 520
const CENTER_LNG = 55
const CENTER_LAT = 42

const GOLD       = '#C9A84C'
const GOLD_LIGHT = '#E8C96A'
const GOLD_DIM   = 'rgba(201,168,76,0.22)'

/* ─── Geographic data ────────────────────────────────────────── */
const SOURCE_COUNTRIES = [
  { name: 'Russia',       coords: [37.62,  55.75] as [number,number], flag: '🇷🇺' },
  { name: 'Belarus',      coords: [27.57,  53.90] as [number,number], flag: '🇧🇾' },
  { name: 'Azerbaijan',   coords: [49.87,  40.41] as [number,number], flag: '🇦🇿' },
  { name: 'Iraq',         coords: [44.40,  33.34] as [number,number], flag: '🇮🇶' },
  { name: 'Turkmenistan', coords: [58.38,  37.95] as [number,number], flag: '🇹🇲' },
  { name: 'Uzbekistan',   coords: [69.24,  41.30] as [number,number], flag: '🇺🇿' },
]
const SOURCE_NAMES = new Set(SOURCE_COUNTRIES.map(c => c.name))

const CROSSINGS = [
  { id: 'hairatan',   label: 'Hairatan',   coords: [67.44, 37.20] as [number,number] },
  { id: 'rozanaq',    label: 'Rozanaq',    coords: [67.53, 37.04] as [number,number] },
  { id: 'islam-qala', label: 'Islam Qala', coords: [61.27, 34.68] as [number,number] },
  { id: 'tor-ghondi', label: 'Tor Ghondi', coords: [61.56, 35.16] as [number,number] },
]
const KABUL: [number,number] = [69.17, 34.53]

/* Routes: [from_lng, from_lat] → [to_lng, to_lat], draw delay, truck dur */
interface RouteSpec {
  id: string
  from: [number,number]
  to:   [number,number]
  delay: number
  truckDur: number
  truckBegin: number
}
const ROUTE_SPECS: RouteSpec[] = [
  { id: 'r0',  from:[37.62,55.75], to:[67.44,37.20], delay:0.0, truckDur:5.5, truckBegin:1.6 },
  { id: 'r1',  from:[37.62,55.75], to:[67.53,37.04], delay:0.2, truckDur:5.8, truckBegin:2.0 },
  { id: 'r2',  from:[27.57,53.90], to:[67.44,37.20], delay:0.4, truckDur:6.2, truckBegin:2.2 },
  { id: 'r3',  from:[49.87,40.41], to:[61.27,34.68], delay:0.6, truckDur:4.2, truckBegin:2.4 },
  { id: 'r4',  from:[44.40,33.34], to:[61.27,34.68], delay:0.8, truckDur:4.0, truckBegin:2.6 },
  { id: 'r5',  from:[58.38,37.95], to:[61.56,35.16], delay:1.0, truckDur:3.5, truckBegin:2.8 },
  { id: 'r6',  from:[58.38,37.95], to:[67.44,37.20], delay:1.2, truckDur:3.8, truckBegin:3.0 },
  { id: 'r7',  from:[69.24,41.30], to:[67.44,37.20], delay:1.4, truckDur:3.2, truckBegin:3.2 },
  { id: 'r8',  from:[69.24,41.30], to:[67.53,37.04], delay:1.6, truckDur:3.4, truckBegin:3.4 },
  /* Border crossings → Kabul */
  { id: 'r9',  from:[67.44,37.20], to:KABUL, delay:2.2, truckDur:2.2, truckBegin:3.8 },
  { id: 'r10', from:[67.53,37.04], to:KABUL, delay:2.3, truckDur:2.3, truckBegin:4.0 },
  { id: 'r11', from:[61.27,34.68], to:KABUL, delay:2.4, truckDur:2.5, truckBegin:4.2 },
  { id: 'r12', from:[61.56,35.16], to:KABUL, delay:2.5, truckDur:2.4, truckBegin:4.4 },
]

/* ─── Curved SVG path between two projected points ───────────── */
function arc(x1: number, y1: number, x2: number, y2: number): string {
  const cx = (x1 + x2) / 2
  const cy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.28
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
}

/* ─── Fuel tanker truck icon (faces +x / right) ──────────────── */
function TruckIcon() {
  return (
    <g>
      {/* Cylindrical tank body */}
      <rect x="-11" y="-5" width="15" height="7" rx="3.5" fill={GOLD} />
      {/* Cab */}
      <rect x="3" y="-6.5" width="8" height="8.5" rx="1.5" fill={GOLD_LIGHT} />
      {/* Windshield */}
      <rect x="3.8" y="-6" width="5" height="3.2" rx="0.8" fill="#0C0C0A" opacity="0.55" />
      {/* Grille */}
      <rect x="10.5" y="-3.5" width="1.5" height="5" rx="0.5" fill="#8A7030" />
      {/* Wheels */}
      <circle cx="-7" cy="3.2" r="2.5" fill="#1A1A14" />
      <circle cx="-7" cy="3.2" r="1"   fill="#555" />
      <circle cx="0"  cy="3.2" r="2.5" fill="#1A1A14" />
      <circle cx="0"  cy="3.2" r="1"   fill="#555" />
      <circle cx="7"  cy="3.2" r="2.2" fill="#1A1A14" />
      <circle cx="7"  cy="3.2" r="0.9" fill="#555" />
    </g>
  )
}

/* ─── RoutesOverlay ──────────────────────────────────────────── */
interface ComputedPath { id: string; d: string; spec: RouteSpec }

function RoutesOverlay({ phase }: { phase: number }) {
  const [paths, setPaths] = useState<ComputedPath[]>([])

  useEffect(() => {
    import('d3-geo').then(({ geoMercator }) => {
      const proj = geoMercator()
        .scale(SCALE)
        .center([CENTER_LNG, CENTER_LAT])
        .translate([W / 2, H / 2])

      setPaths(
        ROUTE_SPECS.map(spec => {
          const [x1, y1] = proj(spec.from) ?? [0, 0]
          const [x2, y2] = proj(spec.to)   ?? [0, 0]
          return { id: spec.id, d: arc(x1, y1, x2, y2), spec }
        })
      )
    })
  }, [])

  const routesVisible = phase >= 1
  const trucksVisible = phase >= 1

  if (paths.length === 0) return null

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="pointer-events-none absolute inset-0 w-full"
      style={{ height: 'auto' }}
      aria-hidden="true"
    >
      <defs>
        {/* Path definitions for animateMotion */}
        {paths.map(p => (
          <path key={`def-${p.id}`} id={p.id} d={p.d} />
        ))}

        <filter id="route-blur">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="truck-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Highway glow base ───────────────────────────────── */}
      {paths.map(p => (
        <path key={`glow-${p.id}`} d={p.d} fill="none"
          stroke={GOLD} strokeWidth={8} strokeLinecap="round"
          filter="url(#route-blur)"
          style={{ opacity: routesVisible ? 0.18 : 0, transition: 'opacity 0.6s ease' }}
        />
      ))}

      {/* ── Highway road lines (draw-in animation) ──────────── */}
      {paths.map(p => (
        <motion.path key={`road-${p.id}`} d={p.d} fill="none"
          stroke={GOLD} strokeWidth={2.4} strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={routesVisible
            ? { pathLength: 1, opacity: 0.78 }
            : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: { delay: p.spec.delay, duration: 1.5, ease: 'easeInOut' },
            opacity:    { delay: p.spec.delay, duration: 0.3 },
          }}
        />
      ))}

      {/* ── Centre dashes (white road markings) ─────────────── */}
      {paths.map(p => (
        <motion.path key={`dash-${p.id}`} d={p.d} fill="none"
          stroke="rgba(255,255,255,0.28)" strokeWidth={0.9}
          strokeDasharray="4 16" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={routesVisible
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: { delay: p.spec.delay + 0.3, duration: 1.5, ease: 'easeInOut' },
            opacity:    { delay: p.spec.delay + 0.3, duration: 0.3 },
          }}
        />
      ))}

      {/* ── Fuel tanker trucks ───────────────────────────────── */}
      {trucksVisible && paths.map(p => (
        <g key={`truck-${p.id}`} filter="url(#truck-glow)">
          <TruckIcon />
          <animateMotion
            dur={`${p.spec.truckDur}s`}
            repeatCount="indefinite"
            begin={`${p.spec.truckBegin}s`}
            rotate="auto"
          >
            <mpath href={`#${p.id}`} />
          </animateMotion>
        </g>
      ))}

      {/* Second trucks staggered on the longer routes */}
      {trucksVisible && paths.slice(0, 7).map(p => (
        <g key={`truck2-${p.id}`} filter="url(#truck-glow)">
          <TruckIcon />
          <animateMotion
            dur={`${p.spec.truckDur}s`}
            repeatCount="indefinite"
            begin={`${p.spec.truckBegin + p.spec.truckDur * 0.5}s`}
            rotate="auto"
          >
            <mpath href={`#${p.id}`} />
          </animateMotion>
        </g>
      ))}
    </svg>
  )
}

/* ─── Main component ─────────────────────────────────────────── */

export default function SupplyRouteMap({ phase }: { phase: number }) {
  const showSources = phase >= 0
  const showDest    = phase >= 2

  return (
    <div className="relative w-full select-none" style={{ background: 'transparent' }}>
      {/* ── Geographic map ─────────────────────────────────── */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: SCALE, center: [CENTER_LNG, CENTER_LAT] }}
        width={W}
        height={H}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const name     = geo.properties.name as string
              const isSource = SOURCE_NAMES.has(name)
              const isDest   = name === 'Afghanistan'
              const base     = { default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }

              if (!isSource && !isDest) {
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    fill="#181812" stroke="#252520" strokeWidth={0.3} style={base}
                  />
                )
              }
              if (isSource) {
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    fill={showSources ? GOLD_DIM : '#181812'}
                    stroke={showSources ? GOLD : '#252520'}
                    strokeWidth={showSources ? 0.9 : 0.3}
                    style={base}
                  />
                )
              }
              // Afghanistan
              return (
                <Geography key={geo.rsmKey} geography={geo}
                  fill={showDest ? 'rgba(201,168,76,0.38)' : 'rgba(201,168,76,0.1)'}
                  stroke={GOLD}
                  strokeWidth={showDest ? 1.4 : 0.6}
                  style={base}
                />
              )
            })
          }
        </Geographies>

        {/* ── Source country markers ────────────────────────── */}
        {SOURCE_COUNTRIES.map((c, i) => (
          <Marker key={c.name} coordinates={c.coords}>
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={showSources ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.6 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {phase === 0 && (
                <motion.circle r={12} fill="none" stroke={GOLD} strokeWidth={0.8}
                  animate={{ scale: [0.8, 2.2], opacity: [0.55, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut', delay: i * 0.35 }}
                  style={{ transformOrigin: '0px 0px' }}
                />
              )}
              <circle r={8}   fill="none"   stroke={GOLD} strokeWidth={1} opacity={0.55} />
              <circle r={5}   fill={GOLD}   />
              <circle r={2.5} fill="#0C0C0A" />
              <text y={-15} textAnchor="middle" fontSize={13}
                style={{ fontFamily: 'sans-serif' }}>{c.flag}</text>
              <text y={18} textAnchor="middle" fill="white" fillOpacity={0.75} fontSize={8.5}
                style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.05em' }}
              >{c.name}</text>
            </motion.g>
          </Marker>
        ))}

        {/* ── Border crossing markers ───────────────────────── */}
        {CROSSINGS.map((cr, i) => (
          <Marker key={cr.id} coordinates={cr.coords}>
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0.1, scale: 0.3 }}
              transition={{ delay: 1.8 + i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Outer diamond */}
              <rect x={-7} y={-7} width={14} height={14}
                transform="rotate(45)" fill="none"
                stroke={GOLD} strokeWidth={0.9} opacity={0.5}
              />
              {/* Inner diamond */}
              <rect x={-5} y={-5} width={10} height={10}
                transform="rotate(45)" fill={GOLD} opacity={0.9}
              />
              <rect x={-2.5} y={-2.5} width={5} height={5}
                transform="rotate(45)" fill={GOLD_LIGHT}
              />
              <text x={12} y={4} fill={GOLD_LIGHT} fontSize={7.5}
                style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.05em', fontWeight: 500 }}
              >{cr.label}</text>
            </motion.g>
          </Marker>
        ))}

        {/* ── Afghanistan / Kabul destination ──────────────── */}
        <Marker coordinates={KABUL}>
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={showDest ? { opacity: 1, scale: 1 } : { opacity: phase >= 1 ? 0.3 : 0.1, scale: 0.5 }}
            transition={{ delay: 2.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {showDest && ([24, 17, 11] as const).map((r, i) => (
              <motion.circle key={r} r={r}
                fill="none" stroke={GOLD} strokeWidth={i === 0 ? 0.5 : 0.8}
                animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: i * 0.8 }}
                style={{ transformOrigin: '0px 0px' }}
              />
            ))}
            <circle r={9}  fill={GOLD} opacity={0.2} />
            <circle r={7}  fill={GOLD} />
            <circle r={3}  fill="white" />
            <text y={-20} textAnchor="middle" fontSize={16}
              style={{ fontFamily: 'sans-serif' }}>🇦🇫</text>
            <text y={20} textAnchor="middle" fill={GOLD_LIGHT} fontSize={9}
              style={{ fontFamily: 'var(--font-inter),sans-serif', fontWeight: 700, letterSpacing: '0.12em' }}
            >KABUL</text>
            {showDest && (
              <text y={30} textAnchor="middle" fill={GOLD} fillOpacity={0.65} fontSize={6.5}
                style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '0.18em' }}
              >FINAL DESTINATION</text>
            )}
          </motion.g>
        </Marker>
      </ComposableMap>

      {/* ── Route highways + truck animations ──────────────── */}
      <RoutesOverlay phase={phase} />
    </div>
  )
}
