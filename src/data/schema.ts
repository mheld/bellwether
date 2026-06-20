import { z } from 'zod'

/* ============================================================================
 * Bellwether data schema
 * ----------------------------------------------------------------------------
 * The single source of truth for the shape of curated city data, shared by:
 *   - scripts/build-data.ts  (validates per-city authoring files at build time)
 *   - the runtime app         (re-validates the compiled dataset on load)
 *
 * Design rule: store RAW real-world values (USD, %, counts, 0-100 indices),
 * never pre-normalized scores. Normalization happens in the scoring layer so it
 * can be re-tuned without re-editing data, and humans can sanity-check values.
 * Every datum is wrapped in `Metric` so it always travels with a citation,
 * an as-of date, and a confidence level.
 * ========================================================================== */

export const SCHEMA_VERSION = 1
export const BASELINE_YEAR = 2025

/* ---- Provenance ---------------------------------------------------------- */

export const Confidence = z.enum(['high', 'medium', 'low'])
export type Confidence = z.infer<typeof Confidence>

/** A single curated value with its provenance. */
export const metric = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    value,
    /** id referencing an entry in the dataset `sources` registry */
    source: z.string().min(1),
    /** ISO date or year the value reflects, e.g. "2024" or "2024-03" */
    asOf: z.string().min(1),
    confidence: Confidence,
    /** optional human caveat shown in the source popover */
    note: z.string().optional(),
  })

export type Metric<T> = {
  value: T
  source: string
  asOf: string
  confidence: Confidence
  note?: string
}

export const SourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1),
  accessedOn: z.string().min(1),
})
export type Source = z.infer<typeof SourceSchema>

/* ---- Climate (the temporal dimension) ------------------------------------ */

export const HAZARDS = [
  { key: 'heat', label: 'Extreme heat' },
  { key: 'drought', label: 'Drought' },
  { key: 'flood', label: 'Flooding' },
  { key: 'wildfire', label: 'Wildfire' },
  { key: 'waterStress', label: 'Water stress' },
] as const
export type Hazard = (typeof HAZARDS)[number]['key']

/** Time slices aligned to WRI Aqueduct + IPCC AR6 published horizons. */
export const HORIZONS = [
  { key: 'now', label: 'Today', year: BASELINE_YEAR },
  { key: 'y2050', label: '2050', year: 2050 },
  { key: 'y2080', label: '2080', year: 2080 },
] as const
export type Horizon = (typeof HORIZONS)[number]['key']

export const EmissionsScenario = z.enum(['SSP2-4.5', 'SSP5-8.5'])
export type EmissionsScenario = z.infer<typeof EmissionsScenario>

/** 0-100 RISK (higher = worse) per horizon, on a documented rubric. */
const riskMetric = metric(z.number().min(0).max(100))

export const HazardProjectionSchema = z.object({
  now: riskMetric,
  y2050: riskMetric,
  y2080: riskMetric,
  scenario: EmissionsScenario,
})
export type HazardProjection = z.infer<typeof HazardProjectionSchema>

export const ClimateProfileSchema = z.object({
  hazards: z.object({
    heat: HazardProjectionSchema,
    drought: HazardProjectionSchema,
    flood: HazardProjectionSchema,
    wildfire: HazardProjectionSchema,
    waterStress: HazardProjectionSchema,
  }),
})
export type ClimateProfile = z.infer<typeof ClimateProfileSchema>

/* ---- Categorical vocabularies -------------------------------------------- */

/** GaWC world-city classification — public stand-in for GCIM tiers. */
export const GaWCClass = z.enum([
  'Alpha++',
  'Alpha+',
  'Alpha',
  'Alpha-',
  'Beta+',
  'Beta',
  'Beta-',
  'Gamma+',
  'Gamma',
  'Gamma-',
  'Sufficiency',
])
export type GaWCClass = z.infer<typeof GaWCClass>

export const TaxRegime = z.enum(['none', 'territorial', 'hybrid', 'worldwide'])
export type TaxRegime = z.infer<typeof TaxRegime>

/* ---- A single city ------------------------------------------------------- */

const index0to100 = z.number().min(0).max(100)

export const CitySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'id must be kebab-case'),
  name: z.string().min(1),
  country: z.string().min(1),
  countryCode: z.string().length(2),
  region: z.string().min(1),
  coords: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
  population: metric(z.number().int().positive()),
  blurb: z.string().optional(),

  factors: z.object({
    /** 1. Importance tier (categorical → ordinal in scoring) */
    importance: metric(GaWCClass),

    /** 2. Climate — per hazard × per horizon */
    climate: ClimateProfileSchema,

    /** 3. Airport connectivity */
    airport: z.object({
      primaryIata: z.string().length(3),
      directDestinations: metric(z.number().int().nonnegative()),
      hubRank: metric(z.number().int().positive()).optional(),
    }),

    /** 4. Real estate (lower = better) */
    realEstate: z.object({
      buyPricePerSqmUsd: metric(z.number().positive()),
      rent1brCenterUsd: metric(z.number().positive()),
    }),

    /** 5. Taxation (rates lower = better; regime mapped in scoring) */
    taxation: z.object({
      topIncomeRatePct: metric(z.number().min(0).max(100)),
      capitalGainsRatePct: metric(z.number().min(0).max(100)),
      regime: metric(TaxRegime),
      hasExpatRegime: metric(z.boolean()),
    }),

    /** 6. Expat friendliness (0-100, higher = better) */
    expat: metric(index0to100),

    /** 7. Cost of living index (lower = better; anchored to a reference city) */
    costOfLiving: metric(z.number().positive()),

    /** 8. Healthcare (0-100, higher = better) */
    healthcare: metric(index0to100),

    /** 9. Safety & political stability */
    safety: z.object({
      crimeSafetyIndex: metric(index0to100), // city-level, higher = safer
      politicalStability: metric(z.number().min(-2.5).max(2.5)), // World Bank WGI
    }),

    /** 10. Language & visa/residency ease */
    accessibility: z.object({
      englishProficiency: metric(index0to100),
      visaEaseIndex: metric(index0to100),
    }),
  }),
})
export type City = z.infer<typeof CitySchema>

/* ---- The compiled dataset ------------------------------------------------ */

export const DatasetSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  baselineYear: z.literal(BASELINE_YEAR),
  generatedAt: z.string(),
  sources: z.array(SourceSchema),
  cities: z.array(CitySchema),
})
export type Dataset = z.infer<typeof DatasetSchema>

/* ============================================================================
 * Factor registry — drives the weights panel, scoring, and detail views.
 * `dir` is the natural direction of the RAW underlying signal:
 *   'higher' = bigger raw value is better, 'lower' = smaller raw value is better,
 *   'composite' = derived from multiple sub-signals (see scoring/composites).
 * ========================================================================== */

export type FactorKey =
  | 'importance'
  | 'climate'
  | 'airport'
  | 'realEstate'
  | 'taxation'
  | 'expat'
  | 'costOfLiving'
  | 'healthcare'
  | 'safety'
  | 'accessibility'

export interface FactorMeta {
  key: FactorKey
  label: string
  blurb: string
  dir: 'higher' | 'lower' | 'composite'
  /** default weight 0-100 in the UI */
  defaultWeight: number
}

export const FACTORS: readonly FactorMeta[] = [
  {
    key: 'climate',
    label: 'Climate resilience',
    blurb: 'Low projected heat, drought, flood, wildfire & water-stress risk through 2080.',
    dir: 'composite',
    defaultWeight: 80,
  },
  {
    key: 'importance',
    label: 'City importance',
    blurb: 'Global standing & opportunity (GaWC world-city tier).',
    dir: 'higher',
    defaultWeight: 40,
  },
  {
    key: 'airport',
    label: 'Connectivity',
    blurb: 'Direct flight destinations from the city’s main airport.',
    dir: 'higher',
    defaultWeight: 50,
  },
  {
    key: 'realEstate',
    label: 'Housing cost',
    blurb: 'Affordability to buy or rent in the city center.',
    dir: 'composite',
    defaultWeight: 55,
  },
  {
    key: 'taxation',
    label: 'Taxation',
    blurb: 'Income & capital-gains burden plus regime friendliness.',
    dir: 'composite',
    defaultWeight: 45,
  },
  {
    key: 'expat',
    label: 'Expat friendliness',
    blurb: 'How welcoming & easy to settle for newcomers.',
    dir: 'higher',
    defaultWeight: 50,
  },
  {
    key: 'costOfLiving',
    label: 'Cost of living',
    blurb: 'Everyday affordability beyond housing.',
    dir: 'lower',
    defaultWeight: 50,
  },
  {
    key: 'healthcare',
    label: 'Healthcare',
    blurb: 'Quality & accessibility of medical care.',
    dir: 'higher',
    defaultWeight: 55,
  },
  {
    key: 'safety',
    label: 'Safety & stability',
    blurb: 'Personal safety and political stability.',
    dir: 'composite',
    defaultWeight: 60,
  },
  {
    key: 'accessibility',
    label: 'Language & visa',
    blurb: 'English ease and residency-pathway accessibility.',
    dir: 'composite',
    defaultWeight: 45,
  },
] as const

/** GaWC class → 0-100 ordinal anchor (documented design choice). */
export const GAWC_ORDINAL: Record<GaWCClass, number> = {
  'Alpha++': 100,
  'Alpha+': 92,
  Alpha: 84,
  'Alpha-': 76,
  'Beta+': 66,
  Beta: 58,
  'Beta-': 50,
  'Gamma+': 40,
  Gamma: 32,
  'Gamma-': 24,
  Sufficiency: 12,
}

/** Tax regime → base goodness 0-100 (combined with rate sub-scores). */
export const REGIME_GOODNESS: Record<TaxRegime, number> = {
  none: 100,
  territorial: 80,
  hybrid: 55,
  worldwide: 30,
}
