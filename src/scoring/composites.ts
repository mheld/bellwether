/* ============================================================================
 * composites.ts — derive each of the 10 factor goodness scores (0-100, higher
 * is always better) for every city in a cohort.
 *
 * Single-signal factors are a direction-adjusted percentile. Composite factors
 * (climate, housing, taxation, safety, accessibility) combine sub-signals — the
 * climate fold over hazards × horizons is the centerpiece.
 * ========================================================================== */

import {
  GAWC_ORDINAL,
  REGIME_GOODNESS,
  HAZARDS,
  HORIZONS,
  type City,
  type FactorKey,
  type Hazard,
  type Horizon,
} from '../data/schema'
import { percentileRanks, invert, meanDefined } from './normalize'

export interface ClimateWeights {
  /** how much each time slice counts — relative weights, normalized internally */
  horizon: Record<Horizon, number>
  /** how much each hazard counts — relative weights, normalized internally */
  hazard: Record<Hazard, number>
}

/** Default leans toward the future — that is Bellwether's thesis. */
export const DEFAULT_CLIMATE_WEIGHTS: ClimateWeights = {
  horizon: { now: 0.2, y2050: 0.4, y2080: 0.4 },
  hazard: { heat: 1, drought: 1, flood: 1, wildfire: 1, waterStress: 1 },
}

function normalizeWeights<K extends string>(w: Record<K, number>): Record<K, number> {
  const keys = Object.keys(w) as K[]
  const total = keys.reduce((s, k) => s + Math.max(0, w[k]), 0)
  const out = {} as Record<K, number>
  for (const k of keys) out[k] = total > 0 ? Math.max(0, w[k]) / total : 0
  return out
}

/**
 * Composite climate RISK (0-100, higher = worse) for one city:
 *   risk = Σ_hazard hazardWeight · ( Σ_horizon horizonWeight · risk[hazard][horizon] )
 */
export function climateRiskRaw(city: City, weights: ClimateWeights): number {
  const hw = normalizeWeights(weights.horizon)
  const zw = normalizeWeights(weights.hazard)
  let risk = 0
  for (const { key: h } of HAZARDS) {
    const proj = city.factors.climate.hazards[h]
    let hazardRisk = 0
    for (const { key: hz } of HORIZONS) {
      hazardRisk += hw[hz] * proj[hz].value
    }
    risk += zw[h] * hazardRisk
  }
  return risk
}

/** Per-city goodness (0-100) for every factor, aligned to the input order. */
export function computeFactorScores(
  cities: ReadonlyArray<City>,
  climateWeights: ClimateWeights = DEFAULT_CLIMATE_WEIGHTS,
): Record<FactorKey, number>[] {
  // --- gather raw signal columns ---
  const importanceRaw = cities.map((c) => GAWC_ORDINAL[c.factors.importance.value])
  const airportRaw = cities.map((c) => c.factors.airport.directDestinations.value)
  const buyRaw = cities.map((c) => c.factors.realEstate.buyPricePerSqmUsd.value)
  const rentRaw = cities.map((c) => c.factors.realEstate.rent1brCenterUsd.value)
  const incomeRaw = cities.map((c) => c.factors.taxation.topIncomeRatePct.value)
  const capgainsRaw = cities.map((c) => c.factors.taxation.capitalGainsRatePct.value)
  const expatRaw = cities.map((c) => c.factors.expat.value)
  const colRaw = cities.map((c) => c.factors.costOfLiving.value)
  const healthRaw = cities.map((c) => c.factors.healthcare.value)
  const crimeRaw = cities.map((c) => c.factors.safety.crimeSafetyIndex.value)
  const stabilityRaw = cities.map((c) => c.factors.safety.politicalStability.value)
  const englishRaw = cities.map((c) => c.factors.accessibility.englishProficiency.value)
  const visaRaw = cities.map((c) => c.factors.accessibility.visaEaseIndex.value)
  const climateRiskCol = cities.map((c) => climateRiskRaw(c, climateWeights))

  // --- percentile columns (higher = bigger raw) ---
  const importancePct = percentileRanks(importanceRaw)
  const airportPct = percentileRanks(airportRaw)
  const buyPct = percentileRanks(buyRaw)
  const rentPct = percentileRanks(rentRaw)
  const incomePct = percentileRanks(incomeRaw)
  const capgainsPct = percentileRanks(capgainsRaw)
  const expatPct = percentileRanks(expatRaw)
  const colPct = percentileRanks(colRaw)
  const healthPct = percentileRanks(healthRaw)
  const crimePct = percentileRanks(crimeRaw)
  const stabilityPct = percentileRanks(stabilityRaw)
  const englishPct = percentileRanks(englishRaw)
  const visaPct = percentileRanks(visaRaw)
  const climatePct = percentileRanks(climateRiskCol)

  // --- assemble per-city factor goodness ---
  return cities.map((c, i) => {
    const regimeGoodness = REGIME_GOODNESS[c.factors.taxation.regime.value]
    const expatBonus = c.factors.taxation.hasExpatRegime.value ? 8 : 0

    const scores: Record<FactorKey, number> = {
      importance: importancePct[i]!,
      climate: invert(climatePct[i])!, // higher risk → lower goodness
      airport: airportPct[i]!,
      realEstate: meanDefined([invert(buyPct[i]), invert(rentPct[i])])!,
      taxation: Math.min(
        100,
        0.4 * regimeGoodness +
          0.3 * invert(incomePct[i])! +
          0.3 * invert(capgainsPct[i])! +
          expatBonus,
      ),
      expat: expatPct[i]!,
      costOfLiving: invert(colPct[i])!,
      healthcare: healthPct[i]!,
      safety: meanDefined([crimePct[i], stabilityPct[i]])!,
      accessibility: meanDefined([englishPct[i], visaPct[i]])!,
    }
    return scores
  })
}
