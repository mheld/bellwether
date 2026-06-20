import { describe, it, expect } from 'vitest'
import { FACTORS, type City, type FactorKey } from '../data/schema'
import { aggregateScore, scoreCities, DEFAULT_WEIGHTS } from './score'
import { climateRiskRaw, type ClimateWeights } from './composites'
import { cities } from '../data/dataset'

const allFactors = (v: number | undefined): Record<FactorKey, number | undefined> =>
  Object.fromEntries(FACTORS.map((f) => [f.key, v])) as Record<FactorKey, number | undefined>

const equalWeights: Record<FactorKey, number> = Object.fromEntries(
  FACTORS.map((f) => [f.key, 10]),
) as Record<FactorKey, number>

describe('aggregateScore', () => {
  it('returns the common value when all factor scores are equal', () => {
    const { score, presentFactors } = aggregateScore(allFactors(50), equalWeights)
    expect(score).toBe(50)
    expect(presentFactors).toBe(FACTORS.length)
  })

  it('stays within 0-100', () => {
    const r1 = aggregateScore(allFactors(0), equalWeights)
    const r2 = aggregateScore(allFactors(100), equalWeights)
    expect(r1.score).toBe(0)
    expect(r2.score).toBe(100)
  })

  it('redistributes weight across present factors (missing excluded, not zeroed)', () => {
    const scores = allFactors(undefined)
    scores.importance = 80
    scores.climate = 40
    const { score, presentFactors } = aggregateScore(scores, equalWeights)
    expect(presentFactors).toBe(2)
    // equal weights → simple mean of the two present factors
    expect(score).toBe(60)
  })

  it('ignores factors whose weight is zero', () => {
    const scores = allFactors(50)
    scores.climate = 0
    const weights = { ...equalWeights, climate: 0 }
    const { score } = aggregateScore(scores, weights)
    // climate (0) excluded by zero weight → remaining all 50
    expect(score).toBe(50)
  })

  it('returns 0 when no factor carries weight', () => {
    const zero = Object.fromEntries(FACTORS.map((f) => [f.key, 0])) as Record<FactorKey, number>
    expect(aggregateScore(allFactors(50), zero).score).toBe(0)
  })

  it('weights factors proportionally', () => {
    const scores = allFactors(undefined)
    scores.importance = 100
    scores.climate = 0
    const weights = { ...equalWeights, importance: 30, climate: 10 }
    const { score } = aggregateScore(scores, weights)
    // (30*100 + 10*0) / 40 = 75
    expect(score).toBe(75)
  })
})

describe('climateRiskRaw (horizon fold)', () => {
  const city = makeClimateCity([10, 50, 90])

  it('uses only the present horizon when its weight is 1', () => {
    const now: ClimateWeights = { horizon: { now: 1, y2050: 0, y2080: 0 }, hazard: even() }
    const far: ClimateWeights = { horizon: { now: 0, y2050: 0, y2080: 1 }, hazard: even() }
    expect(climateRiskRaw(city, now)).toBeCloseTo(10)
    expect(climateRiskRaw(city, far)).toBeCloseTo(90)
  })

  it('blends horizons by their (normalized) weights', () => {
    const w: ClimateWeights = { horizon: { now: 0.2, y2050: 0.4, y2080: 0.4 }, hazard: even() }
    // 0.2*10 + 0.4*50 + 0.4*90 = 58
    expect(climateRiskRaw(city, w)).toBeCloseTo(58)
  })

  it('normalizes arbitrary-scale horizon weights', () => {
    const w: ClimateWeights = { horizon: { now: 2, y2050: 4, y2080: 4 }, hazard: even() }
    expect(climateRiskRaw(city, w)).toBeCloseTo(58)
  })
})

describe('scoreCities (integration with the real dataset)', () => {
  it('ranks every city with a 0-100 score, sorted descending', () => {
    const ranked = scoreCities(cities, DEFAULT_WEIGHTS)
    expect(ranked).toHaveLength(cities.length)
    for (const r of ranked) {
      expect(r.score).toBeGreaterThanOrEqual(0)
      expect(r.score).toBeLessThanOrEqual(100)
      expect(r.completeness).toBe(1) // seed data is complete
    }
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].score).toBeGreaterThanOrEqual(ranked[i].score)
    }
  })

  it('responds to weights: maxing climate surfaces climate-resilient cities', () => {
    const climateOnly = {
      ...DEFAULT_WEIGHTS,
      factors: Object.fromEntries(
        FACTORS.map((f) => [f.key, f.key === 'climate' ? 100 : 0]),
      ) as Record<FactorKey, number>,
    }
    const top = scoreCities(cities, climateOnly)[0]
    // The winner should be one of the cool, water-secure, low-hazard cities.
    expect(['oslo-no', 'helsinki-fi', 'zurich-ch', 'stockholm-se', 'toronto-ca']).toContain(
      top.city.id,
    )
  })
})

/* ---- helpers ---- */

function even() {
  return { heat: 1, drought: 1, flood: 1, wildfire: 1, waterStress: 1 }
}

function makeClimateCity([now, y2050, y2080]: [number, number, number]): City {
  const proj = {
    now: { value: now, source: 's', asOf: '2024', confidence: 'low' as const },
    y2050: { value: y2050, source: 's', asOf: '2050', confidence: 'low' as const },
    y2080: { value: y2080, source: 's', asOf: '2080', confidence: 'low' as const },
    scenario: 'SSP2-4.5' as const,
  }
  return {
    factors: {
      climate: {
        hazards: { heat: proj, drought: proj, flood: proj, wildfire: proj, waterStress: proj },
      },
    },
  } as unknown as City
}
