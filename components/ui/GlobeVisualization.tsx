'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

/* ─── Lazy-load — WebGL requires browser APIs, no SSR ───────── */
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

/* ─── Geographic data ────────────────────────────────────────── */

interface Marker {
  lat: number
  lng: number
  label: string
  size: number
  color: string
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

const GOLD = '#C9A84C'
const GOLD_BRIGHT = '#E8C96A'
const GOLD_DIM = 'rgba(201,168,76,0.6)'

const MARKERS: Marker[] = [
  // Source countries
  { lat: 55.75, lng: 37.62, label: 'Russia',       size: 0.55, color: GOLD_DIM   },
  { lat: 53.90, lng: 27.57, label: 'Belarus',      size: 0.45, color: GOLD_DIM   },
  { lat: 40.41, lng: 49.87, label: 'Azerbaijan',   size: 0.45, color: GOLD_DIM   },
  { lat: 33.34, lng: 44.40, label: 'Iraq',         size: 0.45, color: GOLD_DIM   },
  { lat: 37.95, lng: 58.38, label: 'Turkmenistan', size: 0.45, color: GOLD_DIM   },
  { lat: 41.30, lng: 69.24, label: 'Uzbekistan',   size: 0.45, color: GOLD_DIM   },
  // Border crossings
  { lat: 37.20, lng: 67.44, label: 'Hairatan',     size: 0.35, color: GOLD       },
  { lat: 37.04, lng: 67.53, label: 'Rozanaq',      size: 0.35, color: GOLD       },
  { lat: 34.68, lng: 61.27, label: 'Islam Qala',   size: 0.35, color: GOLD       },
  { lat: 35.16, lng: 61.56, label: 'Tor Ghondi',   size: 0.35, color: GOLD       },
  // Destination
  { lat: 34.53, lng: 69.17, label: 'Kabul',        size: 0.75, color: GOLD_BRIGHT },
]

// animateTime embedded in each arc so ObjAccessor can read it without an index
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

/* ─── Component ──────────────────────────────────────────────── */

export default function GlobeVisualization() {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)

  // Measure container — globe needs explicit px dimensions
  useEffect(() => {
    if (!containerRef.current) return

    const measure = () => {
      const rect = containerRef.current!.getBoundingClientRect()
      setSize(Math.round(rect.width))
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // After globe is ready: orient to Central Asia + enable auto-rotation
  const onGlobeReady = useCallback(() => {
    if (!globeRef.current) return

    // Fly to Central Asia region — centered between Afghanistan and source countries
    globeRef.current.pointOfView({ lat: 40, lng: 58, altitude: 1.75 }, 800)

    const controls = globeRef.current.controls()
    if (controls) {
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.35
      controls.enableZoom = false
      controls.enablePan = false
      controls.enableDamping = true
      controls.dampingFactor = 0.1
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ aspectRatio: '1 / 1' }}
      aria-label="Rotating globe showing petroleum supply routes from source nations to Afghanistan"
      role="img"
    >
      {size > 0 && (
        <Globe
          ref={globeRef}
          width={size}
          height={size}
          // Globe appearance
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          atmosphereColor={GOLD}
          atmosphereAltitude={0.2}
          // Supply route arcs
          arcsData={ARCS}
          arcColor={() => GOLD}
          arcDashLength={0.28}
          arcDashGap={0.12}
          arcDashAnimateTime={(d: object) => (d as Arc).animateTime}
          arcStroke={0.45}
          arcAltitudeAutoScale={0.38}
          // Location markers
          pointsData={MARKERS}
          pointColor={(d: object) => (d as Marker).color}
          pointRadius={(d: object) => (d as Marker).size}
          pointAltitude={0.01}
          pointsMerge={false}
          // Pulsing rings at key locations
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
