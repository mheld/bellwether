import { HAZARDS, HORIZONS, type City, type Hazard, type Horizon } from '../data/schema'

/** Risk 0-100 for one hazard at each horizon. */
export function hazardTrajectory(city: City, hazard: Hazard): Record<Horizon, number> {
  const proj = city.factors.climate.hazards[hazard]
  return { now: proj.now.value, y2050: proj.y2050.value, y2080: proj.y2080.value }
}

/** Mean risk across all hazards at each horizon — the city's overall climate arc. */
export function overallTrajectory(city: City): Record<Horizon, number> {
  const out = { now: 0, y2050: 0, y2080: 0 } as Record<Horizon, number>
  for (const { key: hz } of HORIZONS) {
    let sum = 0
    for (const { key: h } of HAZARDS) sum += city.factors.climate.hazards[h][hz].value
    out[hz] = sum / HAZARDS.length
  }
  return out
}
