import { useMemo } from 'react'
import { cities } from '../data/dataset'
import { scoreCities, type ScoredCity } from '../scoring/score'
import { useWeights, toWeights } from './useWeights'

/** Reactively re-rank the cohort whenever any weight changes. */
export function useScored(): ScoredCity[] {
  const factors = useWeights((s) => s.factors)
  const horizon = useWeights((s) => s.horizon)
  const hazard = useWeights((s) => s.hazard)
  return useMemo(
    () => scoreCities(cities, toWeights({ factors, horizon, hazard })),
    [factors, horizon, hazard],
  )
}
