import type { City, FactorKey, Metric } from '../data/schema'
import * as f from './format'

export interface Fact {
  label: string
  display: string
  metric: Metric<unknown>
}

export interface FactorDetail {
  key: FactorKey
  label: string
  facts: Fact[]
}

/**
 * Human-readable raw values per factor, each paired with its provenance metric.
 * Climate is intentionally excluded here — it has its own per-hazard section.
 */
export function cityFactorDetails(city: City): FactorDetail[] {
  const x = city.factors
  return [
    {
      key: 'importance',
      label: 'City importance',
      facts: [{ label: 'GaWC world-city tier', display: x.importance.value, metric: x.importance }],
    },
    {
      key: 'airport',
      label: 'Connectivity',
      facts: [
        {
          label: `Direct destinations (${x.airport.primaryIata})`,
          display: f.index(x.airport.directDestinations.value),
          metric: x.airport.directDestinations,
        },
      ],
    },
    {
      key: 'realEstate',
      label: 'Housing cost',
      facts: [
        {
          label: 'Buy, city center',
          display: f.usdPerSqm(x.realEstate.buyPricePerSqmUsd.value),
          metric: x.realEstate.buyPricePerSqmUsd,
        },
        {
          label: 'Rent, 1-bed center',
          display: f.usdPerMonth(x.realEstate.rent1brCenterUsd.value),
          metric: x.realEstate.rent1brCenterUsd,
        },
      ],
    },
    {
      key: 'taxation',
      label: 'Taxation',
      facts: [
        { label: 'Top income rate', display: f.pct(x.taxation.topIncomeRatePct.value), metric: x.taxation.topIncomeRatePct },
        { label: 'Capital gains rate', display: f.pct(x.taxation.capitalGainsRatePct.value), metric: x.taxation.capitalGainsRatePct },
        { label: 'Regime', display: f.regimeLabel(x.taxation.regime.value), metric: x.taxation.regime },
        { label: 'Expat tax regime', display: x.taxation.hasExpatRegime.value ? 'Yes' : 'No', metric: x.taxation.hasExpatRegime },
      ],
    },
    {
      key: 'expat',
      label: 'Expat friendliness',
      facts: [{ label: 'Expat index (0–100)', display: f.index(x.expat.value), metric: x.expat }],
    },
    {
      key: 'costOfLiving',
      label: 'Cost of living',
      facts: [{ label: 'Cost-of-living index', display: f.index(x.costOfLiving.value), metric: x.costOfLiving }],
    },
    {
      key: 'healthcare',
      label: 'Healthcare',
      facts: [{ label: 'Healthcare index (0–100)', display: f.index(x.healthcare.value), metric: x.healthcare }],
    },
    {
      key: 'safety',
      label: 'Safety & stability',
      facts: [
        { label: 'Safety index (0–100)', display: f.index(x.safety.crimeSafetyIndex.value), metric: x.safety.crimeSafetyIndex },
        { label: 'Political stability (−2.5…2.5)', display: f.signed(x.safety.politicalStability.value), metric: x.safety.politicalStability },
      ],
    },
    {
      key: 'accessibility',
      label: 'Language & visa',
      facts: [
        { label: 'English proficiency (0–100)', display: f.index(x.accessibility.englishProficiency.value), metric: x.accessibility.englishProficiency },
        { label: 'Visa/residency ease (0–100)', display: f.index(x.accessibility.visaEaseIndex.value), metric: x.accessibility.visaEaseIndex },
      ],
    },
  ]
}
