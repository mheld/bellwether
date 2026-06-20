/* ============================================================================
 * score.ts — combine factor goodness scores into a single weighted ranking.
 *
 * finalScore = Σ (wᵢ / Σ present wⱼ) · factorScoreᵢ   over factors present for a city.
 * Missing factors are EXCLUDED and their weight redistributed across present
 * ones, so a city is never silently punished (or rewarded) for a data gap.
 * ========================================================================== */

import {
  FACTORS,
  GAWC_ORDINAL,
  type City,
  type FactorKey,
} from '../data/schema'
import {
  computeFactorScores,
  DEFAULT_CLIMATE_WEIGHTS,
  type ClimateWeights,
} from './composites'

export type FactorWeights = Record<FactorKey, number>

export interface Weights {
  factors: FactorWeights
  climate: ClimateWeights
}

export const DEFAULT_FACTOR_WEIGHTS: FactorWeights = Object.fromEntries(
  FACTORS.map((f) => [f.key, f.defaultWeight]),
) as FactorWeights

export const DEFAULT_WEIGHTS: Weights = {
  factors: DEFAULT_FACTOR_WEIGHTS,
  climate: DEFAULT_CLIMATE_WEIGHTS,
}

export interface ScoredCity {
  city: City
  /** final weighted score, 0-100 */
  score: number
  /** per-factor goodness, 0-100 (undefined if that factor's data is missing) */
  factorScores: Record<FactorKey, number | undefined>
  /** count of factors with data present, 0-10 */
  presentFactors: number
  /** presentFactors / total factors, 0-1 */
  completeness: number
}

const FACTOR_COUNT = FACTORS.length

/**
 * Weighted aggregate over present factors with weight redistribution.
 * Pure and cohort-independent — the unit of truth for the scoring math.
 */
export function aggregateScore(
  factorScores: Record<FactorKey, number | undefined>,
  weights: FactorWeights,
): { score: number; presentFactors: number } {
  let num = 0
  let denom = 0
  let presentFactors = 0

  for (const { key } of FACTORS) {
    const s = factorScores[key]
    if (s == null) continue
    presentFactors++
    const w = Math.max(0, weights[key] ?? 0)
    if (w === 0) continue
    num += w * s
    denom += w
  }

  return { score: denom > 0 ? num / denom : 0, presentFactors }
}

/**
 * Score and rank every city for the given weights. Returns a new array sorted
 * by score descending; ties broken by city importance then population.
 */
export function scoreCities(
  cities: ReadonlyArray<City>,
  weights: Weights = DEFAULT_WEIGHTS,
): ScoredCity[] {
  const factorScoresArr = computeFactorScores(cities, weights.climate)

  const scored: ScoredCity[] = cities.map((city, i) => {
    const factorScores = factorScoresArr[i] as Record<FactorKey, number | undefined>
    const { score, presentFactors } = aggregateScore(factorScores, weights.factors)
    return {
      city,
      score,
      factorScores,
      presentFactors,
      completeness: presentFactors / FACTOR_COUNT,
    }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    const ia = GAWC_ORDINAL[a.city.factors.importance.value]
    const ib = GAWC_ORDINAL[b.city.factors.importance.value]
    if (ib !== ia) return ib - ia
    return b.city.population.value - a.city.population.value
  })

  return scored
}
