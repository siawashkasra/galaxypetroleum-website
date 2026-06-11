import { NextResponse } from 'next/server'

/* ─── Types ──────────────────────────────────────────────────── */

interface EIADataPoint {
  period: string
  value: number | string
}

interface EIAResponse {
  response?: {
    data?: EIADataPoint[]
  }
}

export interface CommodityPrice {
  label: string
  price: number
  prevPrice: number
  change: number
  changePct: number
  unit: string
  period: string
}

export interface PricesPayload {
  brent: CommodityPrice
  wti: CommodityPrice
  naturalGas: CommodityPrice
  updatedAt: string
  isDemo: boolean
}

/* ─── Demo data — shown when EIA_API_KEY is not configured ───── */

const DEMO: PricesPayload = {
  brent: {
    label: 'Brent Crude',
    price: 82.45,
    prevPrice: 81.60,
    change: 0.85,
    changePct: 1.04,
    unit: 'USD / bbl',
    period: 'Demo',
  },
  wti: {
    label: 'WTI Crude',
    price: 78.90,
    prevPrice: 78.30,
    change: 0.60,
    changePct: 0.77,
    unit: 'USD / bbl',
    period: 'Demo',
  },
  naturalGas: {
    label: 'Natural Gas',
    price: 2.95,
    prevPrice: 3.03,
    change: -0.08,
    changePct: -2.64,
    unit: 'USD / MMBtu',
    period: 'Demo',
  },
  updatedAt: new Date().toISOString(),
  isDemo: true,
}

/* ─── EIA API fetch helper ───────────────────────────────────── */

async function fetchCommodity(
  path: string,
  series: string,
  label: string,
  unit: string,
): Promise<CommodityPrice | null> {
  const key = process.env.EIA_API_KEY
  if (!key) return null

  const url =
    `https://api.eia.gov/v2${path}` +
    `?api_key=${key}` +
    `&data[0]=value` +
    `&facets[series][]=${series}` +
    `&frequency=daily` +
    `&sort[0][column]=period` +
    `&sort[0][direction]=desc` +
    `&length=2`

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const json: EIAResponse = await res.json()
    const data = json.response?.data

    if (!data || data.length < 1) return null

    const price = Number(data[0].value)
    const prevPrice = data.length > 1 ? Number(data[1].value) : price
    const change = Number((price - prevPrice).toFixed(2))
    const changePct = Number(((change / prevPrice) * 100).toFixed(2))

    return {
      label,
      price,
      prevPrice,
      change,
      changePct,
      unit,
      period: String(data[0].period),
    }
  } catch {
    return null
  }
}

/* ─── Route handler ──────────────────────────────────────────── */

export async function GET() {
  if (!process.env.EIA_API_KEY) {
    return NextResponse.json(DEMO, {
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const [brent, wti, naturalGas] = await Promise.all([
    fetchCommodity('/petroleum/pri/spt/data', 'RBRTE', 'Brent Crude',  'USD / bbl'),
    fetchCommodity('/petroleum/pri/spt/data', 'RWTC',  'WTI Crude',    'USD / bbl'),
    fetchCommodity('/natural-gas/pri/sum/data', 'RNGWHHD', 'Natural Gas', 'USD / MMBtu'),
  ])

  // If all three failed, fall back to demo rather than returning empty data
  if (!brent && !wti && !naturalGas) {
    return NextResponse.json(
      { ...DEMO, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const payload: PricesPayload = {
    brent:      brent      ?? DEMO.brent,
    wti:        wti        ?? DEMO.wti,
    naturalGas: naturalGas ?? DEMO.naturalGas,
    updatedAt:  new Date().toISOString(),
    isDemo:     false,
  }

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
  })
}
