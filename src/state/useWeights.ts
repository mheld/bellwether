import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FactorKey, Hazard, Horizon } from '../data/schema'
import {
  DEFAULT_FACTOR_WEIGHTS,
  type FactorWeights,
  type Weights,
} from '../scoring/score'
import { DEFAULT_CLIMATE_WEIGHTS } from '../scoring/composites'

export interface WeightsState {
  factors: FactorWeights
  horizon: Record<Horizon, number>
  hazard: Record<Hazard, number>

  setFactor: (key: FactorKey, value: number) => void
  setHorizon: (key: Horizon, value: number) => void
  setHazard: (key: Hazard, value: number) => void
  setAll: (next: Partial<Pick<WeightsState, 'factors' | 'horizon' | 'hazard'>>) => void
  reset: () => void
}

const initial = {
  factors: { ...DEFAULT_FACTOR_WEIGHTS },
  horizon: { ...DEFAULT_CLIMATE_WEIGHTS.horizon },
  hazard: { ...DEFAULT_CLIMATE_WEIGHTS.hazard },
}

export const useWeights = create<WeightsState>()(
  persist(
    (set) => ({
      ...initial,
      setFactor: (key, value) =>
        set((s) => ({ factors: { ...s.factors, [key]: value } })),
      setHorizon: (key, value) =>
        set((s) => ({ horizon: { ...s.horizon, [key]: value } })),
      setHazard: (key, value) =>
        set((s) => ({ hazard: { ...s.hazard, [key]: value } })),
      setAll: (next) => set((s) => ({ ...s, ...next })),
      reset: () => set({ ...initial, factors: { ...DEFAULT_FACTOR_WEIGHTS } }),
    }),
    { name: 'bellwether-weights', version: 1 },
  ),
)

/** Assemble the scoring `Weights` object from the current store slice. */
export function toWeights(s: Pick<WeightsState, 'factors' | 'horizon' | 'hazard'>): Weights {
  return {
    factors: s.factors,
    climate: { horizon: s.horizon, hazard: s.hazard },
  }
}
