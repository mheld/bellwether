import { describe, it, expect } from 'vitest'
import { encodeWeights, decodeWeights } from './urlState'
import { DEFAULT_FACTOR_WEIGHTS } from '../scoring/score'
import { DEFAULT_CLIMATE_WEIGHTS } from '../scoring/composites'

const slice = {
  factors: { ...DEFAULT_FACTOR_WEIGHTS, climate: 73, taxation: 12 },
  horizon: { ...DEFAULT_CLIMATE_WEIGHTS.horizon, now: 0.15 },
  hazard: { ...DEFAULT_CLIMATE_WEIGHTS.hazard, heat: 2 },
}

describe('url state', () => {
  it('roundtrips weights through encode → decode', () => {
    const decoded = decodeWeights(new URLSearchParams(encodeWeights(slice)))
    expect(decoded).not.toBeNull()
    expect(decoded!.factors.climate).toBe(73)
    expect(decoded!.factors.taxation).toBe(12)
    expect(decoded!.horizon.now).toBeCloseTo(0.15)
    expect(decoded!.hazard.heat).toBe(2)
  })

  it('returns null when the version is absent or unknown', () => {
    expect(decodeWeights(new URLSearchParams(''))).toBeNull()
    expect(decodeWeights(new URLSearchParams('v=99&f=1'))).toBeNull()
  })

  it('returns null on a malformed payload (wrong length)', () => {
    expect(decodeWeights(new URLSearchParams('v=1&f=1,2,3&h=0.2,0.4,0.4&z=1,1,1,1,1'))).toBeNull()
  })

  it('clamps out-of-range values', () => {
    const enc = 'v=1&f=' + ['999', ...Array(9).fill('50')].join(',') + '&h=0.2,0.4,0.4&z=1,1,1,1,1'
    const decoded = decodeWeights(new URLSearchParams(enc))
    expect(decoded).not.toBeNull()
    // first factor (climate) clamped to 100
    expect(decoded!.factors.climate).toBe(100)
  })
})
