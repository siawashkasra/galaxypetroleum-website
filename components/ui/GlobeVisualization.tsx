'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

/* ─── Lazy-load — WebGL requires browser APIs, no SSR ───────── */
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

/* ─── Types ──────────────────────────────────────────────────── */

interface HtmlMarker {
  lat: number
  lng: number
  label: string
  flag: string
  type: 'source' | 'crossing' | 'destination'
  products: string
}

interface Arc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  animateTime: number
}

interface Tooltip {
  x: number
  y: number
  label: string
  flag: string
  products: string
}

/* ─── Country sets for polygon highlighting ─────────────────── */

const SOURCE_NATIONS = new Set([
  'Russia', 'Belarus', 'Azerbaijan', 'Iraq', 'Turkmenistan', 'Uzbekistan',
])
const DEST_NATIONS = new Set(['Afghanistan'])

/* ─── Exact coordinates (number literals, lat/lng named props) ─ */

const RU  = { lat: 55.7558, lng: 37.6173 }
const BY  = { lat: 53.9045, lng: 27.5615 }
const AZ  = { lat: 40.4093, lng: 49.8671 }
const IQ  = { lat: 30.5085, lng: 47.7834 }   // Basra oil hub
const TM  = { lat: 37.9601, lng: 58.3261 }
const UZ  = { lat: 41.2995, lng: 69.2401 }
const KBL = { lat: 34.5553, lng: 69.2075 }   // Kabul destination

const HAIRATAN   = { lat: 37.2000, lng: 67.4500 }
const ISLAM_QALA = { lat: 34.6803, lng: 61.2725 }
const TOR_GHONDI = { lat: 35.1667, lng: 62.2833 }
const ROZANAQ    = { lat: 36.8500, lng: 66.9000 }

/* ─── Marker data ────────────────────────────────────────────── */

const HTML_MARKERS: HtmlMarker[] = [
  { ...RU,  label: 'Russia',       flag: '🇷🇺', type: 'source',      products: 'Diesel · AI-92 · LPG'          },
  { ...BY,  label: 'Belarus',      flag: '🇧🇾', type: 'source',      products: 'Diesel · Bitumen'               },
  { ...AZ,  label: 'Azerbaijan',   flag: '🇦🇿', type: 'source',      products: 'Diesel · Jet Fuel'              },
  { ...IQ,  label: 'Iraq',         flag: '🇮🇶', type: 'source',      products: 'Diesel · Fuel Oil'              },
  { ...TM,  label: 'Turkmenistan', flag: '🇹🇲', type: 'source',      products: 'Diesel · LPG · Petrochemicals'  },
  { ...UZ,  label: 'Uzbekistan',   flag: '🇺🇿', type: 'source',      products: 'Diesel · AI-92'                 },
  { ...HAIRATAN,   label: 'Hairatan',   flag: '◆', type: 'crossing', products: 'Border Crossing — Hairatan'    },
  { ...ISLAM_QALA, label: 'Islam Qala', flag: '◆', type: 'crossing', products: 'Border Crossing — Islam Qala'  },
  { ...TOR_GHONDI, label: 'Tor Ghondi', flag: '◆', type: 'crossing', products: 'Border Crossing — Tor Ghondi'  },
  { ...ROZANAQ,    label: 'Rozanaq',    flag: '◆', type: 'crossing', products: 'Border Crossing — Rozanaq'     },
  { ...KBL, label: 'Afghanistan',  flag: '🇦🇫', type: 'destination', products: 'Fuel Destination — Kabul'      },
]

/* ─── Arc data (source → crossing → Kabul) ───────────────────── */

const ARCS: Arc[] = [
  { startLat: RU.lat,  startLng: RU.lng,  endLat: HAIRATAN.lat,   endLng: HAIRATAN.lng,   animateTime: 1600 },
  { startLat: RU.lat,  startLng: RU.lng,  endLat: ROZANAQ.lat,    endLng: ROZANAQ.lng,    animateTime: 2100 },
  { startLat: BY.lat,  startLng: BY.lng,  endLat: HAIRATAN.lat,   endLng: HAIRATAN.lng,   animateTime: 1750 },
  { startLat: AZ.lat,  startLng: AZ.lng,  endLat: ISLAM_QALA.lat, endLng: ISLAM_QALA.lng, animateTime: 1900 },
  { startLat: IQ.lat,  startLng: IQ.lng,  endLat: ISLAM_QALA.lat, endLng: ISLAM_QALA.lng, animateTime: 2050 },
  { startLat: TM.lat,  startLng: TM.lng,  endLat: TOR_GHONDI.lat, endLng: TOR_GHONDI.lng, animateTime: 2200 },
  { startLat: TM.lat,  startLng: TM.lng,  endLat: HAIRATAN.lat,   endLng: HAIRATAN.lng,   animateTime: 2350 },
  { startLat: UZ.lat,  startLng: UZ.lng,  endLat: HAIRATAN.lat,   endLng: HAIRATAN.lng,   animateTime: 2500 },
  { startLat: UZ.lat,  startLng: UZ.lng,  endLat: ROZANAQ.lat,    endLng: ROZANAQ.lng,    animateTime: 2650 },
  { startLat: HAIRATAN.lat,   startLng: HAIRATAN.lng,   endLat: KBL.lat, endLng: KBL.lng, animateTime: 1400 },
  { startLat: ROZANAQ.lat,    startLng: ROZANAQ.lng,    endLat: KBL.lat, endLng: KBL.lng, animateTime: 1500 },
  { startLat: ISLAM_QALA.lat, startLng: ISLAM_QALA.lng, endLat: KBL.lat, endLng: KBL.lng, animateTime: 1450 },
  { startLat: TOR_GHONDI.lat, startLng: TOR_GHONDI.lng, endLat: KBL.lat, endLng: KBL.lng, animateTime: 1550 },
]

/* ─── Polygon color helpers (applied to GeoJSON features) ────── */

function polyCapColor(d: object): string {
  const name: string = (d as any).properties?.ADMIN ?? (d as any).properties?.NAME ?? ''
  if (DEST_NATIONS.has(name))   return 'rgba(61,31,0,0.82)'
  if (SOURCE_NATIONS.has(name)) return 'rgba(42,92,63,0.72)'
  return 'rgba(27,58,45,0.42)'
}

function polySideColor(d: object): string {
  const name: string = (d as any).properties?.ADMIN ?? (d as any).properties?.NAME ?? ''
  if (DEST_NATIONS.has(name))   return 'rgba(201,168,76,1.0)'
  if (SOURCE_NATIONS.has(name)) return 'rgba(201,168,76,0.8)'
  return 'rgba(46,107,79,0.5)'
}

function polyStrokeColor(d: object): string {
  const name: string = (d as any).properties?.ADMIN ?? (d as any).properties?.NAME ?? ''
  if (DEST_NATIONS.has(name))   return '#C9A84C'
  if (SOURCE_NATIONS.has(name)) return 'rgba(201,168,76,0.65)'
  return 'rgba(46,107,79,0.38)'
}

function polyAltitude(d: object): number {
  const name: string = (d as any).properties?.ADMIN ?? (d as any).properties?.NAME ?? ''
  if (DEST_NATIONS.has(name))   return 0.012
  if (SOURCE_NATIONS.has(name)) return 0.008
  return 0.004
}

/* ─── CSS keyframes — injected once into <head> ─────────────── */

const PULSE_CSS = `
@keyframes gp-ring-source {
  0%   { transform: scale(1);   opacity: 0.75; }
  100% { transform: scale(2.8); opacity: 0;    }
}
@keyframes gp-ring-crossing {
  0%   { transform: scale(1);   opacity: 0.65; }
  100% { transform: scale(2.4); opacity: 0;    }
}
@keyframes gp-ring-dest {
  0%   { transform: scale(1);   opacity: 0.9;  }
  100% { transform: scale(3.4); opacity: 0;    }
}
`

function injectPulseCss() {
  if (document.getElementById('gp-pulse-css')) return
  const s = document.createElement('style')
  s.id = 'gp-pulse-css'
  s.textContent = PULSE_CSS
  document.head.appendChild(s)
}

/* ─── HTML marker element factory ───────────────────────────── */

function buildMarkerElement(
  m: HtmlMarker,
  onClickFn: (m: HtmlMarker, e: MouseEvent) => void,
): HTMLElement {
  const isSrc  = m.type === 'source'
  const isDest = m.type === 'destination'
  const isCros = m.type === 'crossing'

  const outerPx   = isDest ? 28 : isSrc ? 20 : 12
  const innerPx   = isDest ? 10 : isSrc ? 8  : 5
  const ringColor = isDest
    ? 'rgba(255,255,255,0.55)'
    : isSrc
      ? 'rgba(201,168,76,0.4)'
      : 'rgba(232,201,122,0.45)'
  const dotColor  = isDest ? '#FFFFFF' : isSrc ? '#C9A84C' : '#E8C97A'
  const dotGlow   = isDest
    ? 'drop-shadow(0 0 7px rgba(201,168,76,1)) drop-shadow(0 0 14px rgba(201,168,76,0.6))'
    : isSrc
      ? 'drop-shadow(0 0 5px rgba(201,168,76,0.85))'
      : 'drop-shadow(0 0 3px rgba(232,201,122,0.6))'
  const animName  = isDest ? 'gp-ring-dest'    : isSrc ? 'gp-ring-source'  : 'gp-ring-crossing'
  const animDur   = isDest ? '1.6s'            : isSrc ? '2.2s'            : '1.4s'
  const animDurMs = isDest ? 1600              : isSrc ? 2200              : 1400

  // Root wrapper — acts as the click target
  const root = document.createElement('div')
  root.style.cssText = [
    'position:relative',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    `width:${outerPx}px`,
    `height:${outerPx}px`,
    'transform:translate(-50%,-50%)',
    'pointer-events:auto',
    'cursor:pointer',
  ].join(';')
  root.addEventListener('click', (e) => {
    e.stopPropagation()
    onClickFn(m, e as MouseEvent)
  })

  // Two staggered pulse rings
  for (let i = 0; i < 2; i++) {
    const ring = document.createElement('div')
    ring.style.cssText = [
      'position:absolute',
      `width:${outerPx}px`,
      `height:${outerPx}px`,
      'border-radius:50%',
      `border:1.5px solid ${ringColor}`,
      `animation:${animName} ${animDur} ease-out infinite`,
      `animation-delay:${(animDurMs * i * 0.5) / 1000}s`,
    ].join(';')
    root.appendChild(ring)
  }

  // Solid inner dot
  const dot = document.createElement('div')
  dot.style.cssText = [
    'position:relative',
    'z-index:2',
    `width:${innerPx}px`,
    `height:${innerPx}px`,
    'border-radius:50%',
    `background:${dotColor}`,
    `filter:${dotGlow}`,
  ].join(';')
  root.appendChild(dot)

  // Label (source countries + destination only — crossings are too close together)
  if (!isCros) {
    const label = document.createElement('div')
    label.style.cssText = [
      'position:absolute',
      `bottom:calc(100% + ${isDest ? 7 : 5}px)`,
      'left:50%',
      'transform:translateX(-50%)',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'gap:2px',
      'pointer-events:none',
      'white-space:nowrap',
    ].join(';')

    const flagEl = document.createElement('span')
    flagEl.style.cssText = [
      `font-size:${isDest ? '18px' : '14px'}`,
      'line-height:1',
      'filter:drop-shadow(0 0 4px rgba(0,0,0,1))',
    ].join(';')
    flagEl.textContent = m.flag

    const nameEl = document.createElement('span')
    nameEl.style.cssText = [
      `font-size:${isDest ? '8px' : '7px'}`,
      'font-family:Inter,system-ui,sans-serif',
      `font-weight:${isDest ? '600' : '400'}`,
      'letter-spacing:0.12em',
      'text-transform:uppercase',
      `color:${isDest ? '#E8C96A' : 'rgba(201,168,76,0.9)'}`,
      'text-shadow:0 1px 6px rgba(0,0,0,1),0 0 16px rgba(0,0,0,0.9)',
    ].join(';')
    nameEl.textContent = m.label

    label.appendChild(flagEl)
    label.appendChild(nameEl)
    root.appendChild(label)
  }

  return root
}

/* ─── Tooltip component ──────────────────────────────────────── */

function MarkerTooltip({ tip, onClose }: { tip: Tooltip; onClose: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: tip.x,
        top: tip.y,
        transform: 'translate(-50%, calc(-100% - 18px))',
        zIndex: 50,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          background: 'rgba(10,10,8,0.97)',
          border: '1px solid rgba(201,168,76,0.45)',
          borderRadius: '6px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          boxShadow: '0 0 28px rgba(201,168,76,0.18)',
          minWidth: '170px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>{tip.flag}</span>
          <span style={{
            flex: 1,
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#E8C96A',
          }}>
            {tip.label}
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
              fontSize: '12px',
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Close tooltip"
          >
            ✕
          </button>
        </div>
        <p style={{
          margin: 0,
          fontSize: '10px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.04em',
        }}>
          {tip.products}
        </p>
      </div>
      {/* Caret arrow */}
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid rgba(201,168,76,0.45)',
        margin: '0 auto',
      }} />
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────── */

export default function GlobeVisualization() {
  const globeRef     = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Ref keeps the click handler fresh without invalidating buildElement's closure
  const clickHandlerRef = useRef<(m: HtmlMarker, e: MouseEvent) => void>(() => {})

  const [size, setSize]         = useState(0)
  const [countries, setCountries] = useState<object[]>([])
  const [tooltip, setTooltip]   = useState<Tooltip | null>(null)

  // Always keep the latest click handler in the ref
  clickHandlerRef.current = (m: HtmlMarker, event: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      label: m.label,
      flag: m.flag,
      products: m.products,
    })
  }

  // Stable builder — references the ref so no dep on setTooltip
  const buildElement = useCallback((d: object) => {
    return buildMarkerElement(d as HtmlMarker, (m, e) => clickHandlerRef.current(m, e))
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const measure = () =>
      setSize(Math.round(containerRef.current!.getBoundingClientRect().width))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    injectPulseCss()
    // Natural Earth 110m country polygons — standard dataset used by globe.gl examples
    fetch(
      'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson',
    )
      .then((r) => r.json())
      .then((data) => setCountries(data.features as object[]))
      .catch(() => {
        // Polygons won't render, but globe still works
      })
  }, [])

  const onGlobeReady = useCallback(() => {
    if (!globeRef.current) return
    globeRef.current.pointOfView({ lat: 40, lng: 58, altitude: 1.75 }, 800)
    const controls = globeRef.current.controls()
    if (controls) {
      controls.autoRotate      = true
      controls.autoRotateSpeed = 0.35
      controls.enableZoom      = false
      controls.enablePan       = false
      controls.enableDamping   = true
      controls.dampingFactor   = 0.1
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    const c = globeRef.current?.controls()
    if (c) c.autoRotate = false
  }, [])

  const handleMouseLeave = useCallback(() => {
    const c = globeRef.current?.controls()
    if (c) c.autoRotate = true
    setTooltip(null)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ aspectRatio: '1 / 1' }}
      role="img"
      aria-label="Rotating globe — petroleum supply routes from 6 source nations to Afghanistan"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {size > 0 && (
        <Globe
          ref={globeRef}
          width={size}
          height={size}
          // ── Appearance ─────────────────────────────────────
          backgroundColor="rgba(0,0,0,0)"
          // NASA night-earth: visible city lights, blue ocean, discernible continents
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          // Topology bump gives visible mountain / terrain relief
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#4A90D9"
          atmosphereAltitude={0.15}
          // ── Country polygons (GeoJSON) ──────────────────────
          polygonsData={countries}
          polygonCapColor={polyCapColor}
          polygonSideColor={polySideColor}
          polygonStrokeColor={polyStrokeColor}
          polygonAltitude={polyAltitude}
          polygonsTransitionDuration={400}
          // ── Route arcs ──────────────────────────────────────
          arcsData={ARCS}
          arcColor={() => 'rgba(201,168,76,0.7)'}
          arcDashLength={0.3}
          arcDashGap={0.1}
          arcDashAnimateTime={(d: object) => (d as Arc).animateTime}
          arcStroke={1.5}
          arcAltitude={0.4}
          // ── Pulsing HTML markers ─────────────────────────────
          htmlElementsData={HTML_MARKERS}
          htmlElement={buildElement}
          htmlAltitude={0.02}
          htmlTransitionDuration={300}
          onGlobeReady={onGlobeReady}
        />
      )}

      {tooltip && (
        <MarkerTooltip tip={tooltip} onClose={() => setTooltip(null)} />
      )}
    </div>
  )
}
