'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

/* ─── Lazy-load — WebGL requires browser APIs, no SSR ───────── */
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

/* ─── Types ──────────────────────────────────────────────────── */

interface Marker {
  lat: number
  lng: number
  label: string
  size: number
  color: string
  type: 'source' | 'crossing' | 'destination'
}

interface Label {
  lat: number
  lng: number
  flag: string
  name: string
  type: 'source' | 'destination'
}

interface Arc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  animateTime: number
}

interface Ring {
  lat: number
  lng: number
}

/* ─── Colors ─────────────────────────────────────────────────── */

const GOLD       = '#C9A84C'
const GOLD_BRIGHT = '#E8C96A'
const GOLD_DIM   = 'rgba(201,168,76,0.6)'

/* ─── Data ───────────────────────────────────────────────────── */

const MARKERS: Marker[] = [
  { lat: 55.75, lng: 37.62, label: 'Russia',       size: 0.55, color: GOLD_DIM,   type: 'source'      },
  { lat: 53.90, lng: 27.57, label: 'Belarus',      size: 0.45, color: GOLD_DIM,   type: 'source'      },
  { lat: 40.41, lng: 49.87, label: 'Azerbaijan',   size: 0.45, color: GOLD_DIM,   type: 'source'      },
  { lat: 33.34, lng: 44.40, label: 'Iraq',         size: 0.45, color: GOLD_DIM,   type: 'source'      },
  { lat: 37.95, lng: 58.38, label: 'Turkmenistan', size: 0.45, color: GOLD_DIM,   type: 'source'      },
  { lat: 41.30, lng: 69.24, label: 'Uzbekistan',   size: 0.45, color: GOLD_DIM,   type: 'source'      },
  { lat: 37.20, lng: 67.44, label: 'Hairatan',     size: 0.35, color: GOLD,       type: 'crossing'    },
  { lat: 37.04, lng: 67.53, label: 'Rozanaq',      size: 0.35, color: GOLD,       type: 'crossing'    },
  { lat: 34.68, lng: 61.27, label: 'Islam Qala',   size: 0.35, color: GOLD,       type: 'crossing'    },
  { lat: 35.16, lng: 61.56, label: 'Tor Ghondi',   size: 0.35, color: GOLD,       type: 'crossing'    },
  { lat: 34.53, lng: 69.17, label: 'Afghanistan',  size: 0.75, color: GOLD_BRIGHT, type: 'destination' },
]

// HTML labels — source countries + destination only (crossings are too close together)
const LABELS: Label[] = [
  { lat: 55.75, lng: 37.62, flag: '🇷🇺', name: 'Russia',       type: 'source'      },
  { lat: 53.90, lng: 27.57, flag: '🇧🇾', name: 'Belarus',      type: 'source'      },
  { lat: 40.41, lng: 49.87, flag: '🇦🇿', name: 'Azerbaijan',   type: 'source'      },
  { lat: 33.34, lng: 44.40, flag: '🇮🇶', name: 'Iraq',         type: 'source'      },
  { lat: 37.95, lng: 58.38, flag: '🇹🇲', name: 'Turkmenistan', type: 'source'      },
  { lat: 41.30, lng: 69.24, flag: '🇺🇿', name: 'Uzbekistan',   type: 'source'      },
  { lat: 34.53, lng: 69.17, flag: '🇦🇫', name: 'Afghanistan',  type: 'destination' },
]

const ARCS: Arc[] = [
  { startLat: 55.75, startLng: 37.62, endLat: 37.20, endLng: 67.44, animateTime: 1600 },
  { startLat: 55.75, startLng: 37.62, endLat: 37.04, endLng: 67.53, animateTime: 1720 },
  { startLat: 53.90, startLng: 27.57, endLat: 37.20, endLng: 67.44, animateTime: 1840 },
  { startLat: 40.41, startLng: 49.87, endLat: 34.68, endLng: 61.27, animateTime: 1960 },
  { startLat: 33.34, startLng: 44.40, endLat: 34.68, endLng: 61.27, animateTime: 2080 },
  { startLat: 37.95, startLng: 58.38, endLat: 35.16, endLng: 61.56, animateTime: 2200 },
  { startLat: 37.95, startLng: 58.38, endLat: 37.20, endLng: 67.44, animateTime: 2320 },
  { startLat: 41.30, startLng: 69.24, endLat: 37.20, endLng: 67.44, animateTime: 2440 },
  { startLat: 41.30, startLng: 69.24, endLat: 37.04, endLng: 67.53, animateTime: 2560 },
  { startLat: 37.20, startLng: 67.44, endLat: 34.53, endLng: 69.17, animateTime: 1400 },
  { startLat: 37.04, startLng: 67.53, endLat: 34.53, endLng: 69.17, animateTime: 1500 },
  { startLat: 34.68, startLng: 61.27, endLat: 34.53, endLng: 69.17, animateTime: 1450 },
  { startLat: 35.16, startLng: 61.56, endLat: 34.53, endLng: 69.17, animateTime: 1550 },
]

const RINGS: Ring[] = [
  { lat: 34.53, lng: 69.17 },
  { lat: 37.20, lng: 67.44 },
  { lat: 34.68, lng: 61.27 },
]

/* ─── HTML label factory ─────────────────────────────────────── */

function buildLabelElement(label: Label): HTMLElement {
  const isDestination = label.type === 'destination'

  const el = document.createElement('div')
  el.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    transform: translate(-50%, -130%);
    text-align: center;
    gap: 3px;
  `

  const flag = document.createElement('div')
  flag.style.cssText = `
    font-size: ${isDestination ? '18px' : '14px'};
    line-height: 1;
    filter: drop-shadow(0 0 4px rgba(201,168,76,0.5));
  `
  flag.textContent = label.flag

  const name = document.createElement('div')
  name.style.cssText = `
    font-size: ${isDestination ? '8px' : '7px'};
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: ${isDestination ? '600' : '400'};
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${isDestination ? '#E8C96A' : 'rgba(201,168,76,0.85)'};
    white-space: nowrap;
    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  `
  name.textContent = label.name

  el.appendChild(flag)
  el.appendChild(name)

  return el
}

/* ─── Component ──────────────────────────────────────────────── */

export default function GlobeVisualization() {
  const globeRef   = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const measure = () => {
      setSize(Math.round(containerRef.current!.getBoundingClientRect().width))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
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

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ aspectRatio: '1 / 1' }}
      role="img"
      aria-label="Rotating globe — petroleum supply routes from 6 source nations to Afghanistan"
    >
      {size > 0 && (
        <Globe
          ref={globeRef}
          width={size}
          height={size}
          // Appearance
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          atmosphereColor={GOLD}
          atmosphereAltitude={0.2}
          // Arcs
          arcsData={ARCS}
          arcColor={() => GOLD}
          arcDashLength={0.28}
          arcDashGap={0.12}
          arcDashAnimateTime={(d: object) => (d as Arc).animateTime}
          arcStroke={0.45}
          arcAltitudeAutoScale={0.38}
          // Dot markers
          pointsData={MARKERS}
          pointColor={(d: object) => (d as Marker).color}
          pointRadius={(d: object) => (d as Marker).size}
          pointAltitude={0.01}
          pointsMerge={false}
          // Country flag + name labels
          htmlElementsData={LABELS}
          htmlElement={(d: object) => buildLabelElement(d as Label)}
          htmlAltitude={0.04}
          htmlTransitionDuration={300}
          // Pulsing rings
          ringsData={RINGS}
          ringColor={() => (t: number) => `rgba(201,168,76,${(1 - t) * 0.85})`}
          ringMaxRadius={3.5}
          ringPropagationSpeed={1.8}
          ringRepeatPeriod={1400}
          onGlobeReady={onGlobeReady}
        />
      )}
    </div>
  )
}
