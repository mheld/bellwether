import { useEffect, useRef } from 'react'
import { FACTORS, HORIZONS, HAZARDS, type FactorKey, type Hazard, type Horizon } from '../data/schema'
import { useWeights, type WeightsState } from './useWeights'

export const SHARE_VERSION = 1

type Slice = Pick<WeightsState, 'factors' | 'horizon' | 'hazard'>

const round2 = (n: number) => Math.round(n * 100) / 100
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))

/** Encode the weights into a compact, versioned query string. */
export function encodeWeights(s: Slice): string {
  const f = FACTORS.map((x) => Math.round(s.factors[x.key])).join(',')
  const h = HORIZONS.map((x) => round2(s.horizon[x.key])).join(',')
  const z = HAZARDS.map((x) => round2(s.hazard[x.key])).join(',')
  return new URLSearchParams({ v: String(SHARE_VERSION), f, h, z }).toString()
}

/** Build a full shareable URL for the current weights. */
export function buildShareUrl(s: Slice): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}?${encodeWeights(s)}`
}

/** Parse weights from URL params; returns null if absent or unrecognized. */
export function decodeWeights(params: URLSearchParams): Slice | null {
  if (params.get('v') !== String(SHARE_VERSION)) return null
  const f = numbers(params.get('f'), FACTORS.length)
  const h = numbers(params.get('h'), HORIZONS.length)
  const z = numbers(params.get('z'), HAZARDS.length)
  if (!f || !h || !z) return null

  const factors = {} as Record<FactorKey, number>
  FACTORS.forEach((x, i) => (factors[x.key] = clamp(f[i], 0, 100)))
  const horizon = {} as Record<Horizon, number>
  HORIZONS.forEach((x, i) => (horizon[x.key] = clamp(h[i], 0, 1)))
  const hazard = {} as Record<Hazard, number>
  HAZARDS.forEach((x, i) => (hazard[x.key] = clamp(z[i], 0, 4)))

  return { factors, horizon, hazard }
}

function numbers(raw: string | null, len: number): number[] | null {
  if (!raw) return null
  const parts = raw.split(',').map(Number)
  if (parts.length !== len || parts.some((n) => !Number.isFinite(n))) return null
  return parts
}

/**
 * On first mount, if the URL carries shared weights, apply them (URL wins over
 * the locally-persisted state) and clean the params from the address bar.
 */
export function useApplySharedWeights() {
  const setAll = useWeights((s) => s.setAll)
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current) return
    applied.current = true
    const params = new URLSearchParams(window.location.search)
    const decoded = decodeWeights(params)
    if (decoded) {
      setAll(decoded)
      const clean = window.location.pathname + window.location.hash
      window.history.replaceState(null, '', clean)
    }
  }, [setAll])
}
