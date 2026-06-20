import type { FactorKey, Hazard, Horizon } from '../data/schema'
import { DEFAULT_FACTOR_WEIGHTS } from '../scoring/score'
import { DEFAULT_CLIMATE_WEIGHTS } from '../scoring/composites'

export interface Preset {
  id: string
  label: string
  blurb: string
  factors: Record<FactorKey, number>
  horizon: Record<Horizon, number>
  hazard: Record<Hazard, number>
}

const base = DEFAULT_FACTOR_WEIGHTS
const evenHazard = DEFAULT_CLIMATE_WEIGHTS.hazard

/** Named starting points so users aren't staring at ten cold sliders. */
export const PRESETS: Preset[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    blurb: 'A sensible all-round starting point.',
    factors: { ...base },
    horizon: { ...DEFAULT_CLIMATE_WEIGHTS.horizon },
    hazard: { ...evenHazard },
  },
  {
    id: 'climate-first',
    label: 'Climate-first',
    blurb: 'Long-horizon climate resilience above all.',
    factors: {
      climate: 100,
      safety: 70,
      healthcare: 60,
      costOfLiving: 50,
      realEstate: 45,
      importance: 35,
      airport: 40,
      taxation: 30,
      expat: 40,
      accessibility: 40,
    },
    horizon: { now: 0.1, y2050: 0.4, y2080: 0.5 },
    hazard: { ...evenHazard },
  },
  {
    id: 'low-tax',
    label: 'Low-tax',
    blurb: 'Minimize tax and cost, keep it livable.',
    factors: {
      taxation: 100,
      costOfLiving: 75,
      realEstate: 65,
      climate: 50,
      safety: 55,
      healthcare: 50,
      importance: 45,
      airport: 50,
      accessibility: 55,
      expat: 45,
    },
    horizon: { now: 0.25, y2050: 0.4, y2080: 0.35 },
    hazard: { ...evenHazard },
  },
  {
    id: 'quality-of-life',
    label: 'Quality of life',
    blurb: 'Health, safety, and a stable climate.',
    factors: {
      healthcare: 85,
      safety: 80,
      climate: 70,
      costOfLiving: 55,
      expat: 60,
      importance: 45,
      airport: 45,
      realEstate: 50,
      taxation: 35,
      accessibility: 45,
    },
    horizon: { now: 0.2, y2050: 0.4, y2080: 0.4 },
    hazard: { ...evenHazard },
  },
  {
    id: 'nomad',
    label: 'Digital nomad',
    blurb: 'Easy entry, low cost, well connected.',
    factors: {
      accessibility: 90,
      costOfLiving: 85,
      expat: 75,
      airport: 65,
      climate: 60,
      taxation: 60,
      safety: 55,
      healthcare: 50,
      realEstate: 55,
      importance: 35,
    },
    horizon: { now: 0.4, y2050: 0.4, y2080: 0.2 },
    hazard: { ...evenHazard },
  },
]
