/* ============================================================================
 * seed-cities.ts — one-time seeding utility.
 *
 * Expands a compact table of ILLUSTRATIVE values into full per-city authoring
 * files under data/cities/. These values are approximate seed data meant to
 * exercise the engine — verify & refine each against the cited source before
 * treating any number as authoritative. After seeding, the JSON files are the
 * hand-editable source of truth; this script is just a generator.
 *
 * Run: `npx tsx scripts/seed-cities.ts`
 * ========================================================================== */

import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  CitySchema,
  type City,
  type Confidence,
  type GaWCClass,
  type TaxRegime,
  type Hazard,
} from '../src/data/schema.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const CITIES_DIR = join(HERE, '..', 'data', 'cities')

/** [now, 2050, 2080] risk 0-100 (higher = worse). */
type Triple = [number, number, number]

interface Row {
  id: string
  name: string
  country: string
  cc: string
  region: string
  lat: number
  lng: number
  pop: number
  blurb: string
  gawc: GaWCClass
  iata: string
  dest: number
  buy: number
  rent: number
  income: number
  capgains: number
  regime: TaxRegime
  expatRegime: boolean
  expat: number
  col: number
  health: number
  safety: number
  stability: number
  english: number
  visa: number
  // climate hazards: heat, drought, flood, wildfire, waterStress
  heat: Triple
  drought: Triple
  flood: Triple
  wildfire: Triple
  water: Triple
}

const ROWS: Row[] = [
  {
    id: 'lisbon-pt', name: 'Lisbon', country: 'Portugal', cc: 'PT', region: 'Southern Europe',
    lat: 38.72, lng: -9.14, pop: 2960000,
    blurb: 'Atlantic-tempered capital with mild winters, but a drying, fire-prone Iberian summer ahead.',
    gawc: 'Alpha-', iata: 'LIS', dest: 150, buy: 5500, rent: 1400,
    income: 48, capgains: 28, regime: 'worldwide', expatRegime: true,
    expat: 78, col: 50, health: 72, safety: 75, stability: 0.9, english: 80, visa: 80,
    heat: [45, 60, 70], drought: [50, 62, 72], flood: [30, 38, 45], wildfire: [40, 52, 60], water: [55, 68, 78],
  },
  {
    id: 'singapore-sg', name: 'Singapore', country: 'Singapore', cc: 'SG', region: 'Southeast Asia',
    lat: 1.35, lng: 103.82, pop: 5920000,
    blurb: 'Hyper-connected city-state engineering against heat and sea-level rise; water largely imported.',
    gawc: 'Alpha+', iata: 'SIN', dest: 160, buy: 18000, rent: 2800,
    income: 24, capgains: 0, regime: 'territorial', expatRegime: false,
    expat: 60, col: 85, health: 86, safety: 95, stability: 1.3, english: 85, visa: 45,
    heat: [60, 72, 80], drought: [25, 30, 35], flood: [45, 55, 63], wildfire: [5, 8, 10], water: [45, 52, 58],
  },
  {
    id: 'toronto-ca', name: 'Toronto', country: 'Canada', cc: 'CA', region: 'North America',
    lat: 43.65, lng: -79.38, pop: 6200000,
    blurb: 'Great-Lakes water security and mild climate exposure make it a frequent climate-haven pick.',
    gawc: 'Alpha', iata: 'YYZ', dest: 180, buy: 9000, rent: 1800,
    income: 53, capgains: 27, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 70, health: 75, safety: 72, stability: 0.9, english: 100, visa: 70,
    heat: [25, 38, 48], drought: [20, 28, 35], flood: [30, 38, 45], wildfire: [12, 20, 28], water: [12, 15, 18],
  },
  {
    id: 'madrid-es', name: 'Madrid', country: 'Spain', cc: 'ES', region: 'Southern Europe',
    lat: 40.42, lng: -3.70, pop: 6750000,
    blurb: 'Inland capital facing intensifying heat and water stress, balanced by deep amenities.',
    gawc: 'Alpha', iata: 'MAD', dest: 180, buy: 5200, rent: 1300,
    income: 47, capgains: 28, regime: 'worldwide', expatRegime: true,
    expat: 80, col: 48, health: 78, safety: 70, stability: 0.5, english: 60, visa: 72,
    heat: [50, 64, 74], drought: [55, 68, 78], flood: [18, 24, 30], wildfire: [35, 46, 55], water: [60, 72, 82],
  },
  {
    id: 'tokyo-jp', name: 'Tokyo', country: 'Japan', cc: 'JP', region: 'East Asia',
    lat: 35.68, lng: 139.69, pop: 37000000,
    blurb: 'Vast, orderly megacity with rising heat and typhoon-driven flood exposure.',
    gawc: 'Alpha+', iata: 'HND', dest: 120, buy: 12000, rent: 1300,
    income: 56, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 55, col: 60, health: 84, safety: 88, stability: 1.0, english: 45, visa: 40,
    heat: [48, 60, 68], drought: [22, 28, 34], flood: [50, 58, 65], wildfire: [8, 12, 16], water: [28, 34, 40],
  },
  {
    id: 'dubai-ae', name: 'Dubai', country: 'United Arab Emirates', cc: 'AE', region: 'Middle East',
    lat: 25.20, lng: 55.27, pop: 3600000,
    blurb: 'Tax-free global hub, but among the most heat- and water-stressed cities on the list.',
    gawc: 'Alpha+', iata: 'DXB', dest: 260, buy: 4500, rent: 1700,
    income: 0, capgains: 0, regime: 'none', expatRegime: false,
    expat: 65, col: 62, health: 70, safety: 85, stability: 0.6, english: 65, visa: 75,
    heat: [75, 85, 92], drought: [70, 78, 85], flood: [22, 30, 38], wildfire: [2, 3, 4], water: [88, 92, 95],
  },
  {
    id: 'mexico-city-mx', name: 'Mexico City', country: 'Mexico', cc: 'MX', region: 'Latin America',
    lat: 19.43, lng: -99.13, pop: 21800000,
    blurb: 'High-altitude mild temperatures offset by an acute, worsening water crisis and subsidence.',
    gawc: 'Alpha', iata: 'MEX', dest: 110, buy: 3000, rent: 900,
    income: 35, capgains: 10, regime: 'worldwide', expatRegime: false,
    expat: 75, col: 40, health: 62, safety: 38, stability: -0.6, english: 50, visa: 78,
    heat: [38, 50, 60], drought: [50, 62, 72], flood: [48, 56, 64], wildfire: [20, 28, 35], water: [70, 82, 90],
  },
  {
    id: 'berlin-de', name: 'Berlin', country: 'Germany', cc: 'DE', region: 'Western Europe',
    lat: 52.52, lng: 13.40, pop: 3680000,
    blurb: 'Temperate and water-secure for now, with gradually rising heat and drought summers.',
    gawc: 'Alpha-', iata: 'BER', dest: 150, buy: 7500, rent: 1400,
    income: 47, capgains: 26, regime: 'worldwide', expatRegime: false,
    expat: 58, col: 62, health: 80, safety: 62, stability: 0.6, english: 72, visa: 65,
    heat: [30, 44, 54], drought: [35, 46, 55], flood: [22, 28, 34], wildfire: [15, 22, 28], water: [30, 38, 45],
  },
  {
    id: 'melbourne-au', name: 'Melbourne', country: 'Australia', cc: 'AU', region: 'Oceania',
    lat: -37.81, lng: 144.96, pop: 5150000,
    blurb: 'Livable and stable, but exposed to heatwaves, drought cycles and regional bushfire smoke.',
    gawc: 'Alpha', iata: 'MEL', dest: 90, buy: 8000, rent: 1600,
    income: 45, capgains: 23, regime: 'worldwide', expatRegime: false,
    expat: 72, col: 72, health: 80, safety: 70, stability: 0.9, english: 100, visa: 55,
    heat: [42, 54, 63], drought: [45, 56, 65], flood: [25, 32, 40], wildfire: [45, 56, 64], water: [40, 50, 58],
  },
  {
    id: 'austin-us', name: 'Austin', country: 'United States', cc: 'US', region: 'North America',
    lat: 30.27, lng: -97.74, pop: 2300000,
    blurb: 'No state income tax and strong job market, but fast-rising heat, drought and flash-flood risk.',
    gawc: 'Gamma-', iata: 'AUS', dest: 95, buy: 4200, rent: 1600,
    income: 37, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 68, col: 68, health: 70, safety: 60, stability: 0.2, english: 100, visa: 35,
    heat: [55, 68, 77], drought: [50, 62, 72], flood: [40, 48, 56], wildfire: [35, 45, 53], water: [48, 60, 68],
  },
  {
    id: 'zurich-ch', name: 'Zurich', country: 'Switzerland', cc: 'CH', region: 'Western Europe',
    lat: 47.37, lng: 8.54, pop: 1430000,
    blurb: 'Cool alpine climate and abundant freshwater make it one of the most climate-insulated cities.',
    gawc: 'Alpha-', iata: 'ZRH', dest: 170, buy: 17000, rent: 2300,
    income: 40, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 115, health: 88, safety: 88, stability: 1.3, english: 70, visa: 40,
    heat: [22, 34, 44], drought: [18, 26, 33], flood: [28, 34, 40], wildfire: [6, 10, 14], water: [10, 13, 16],
  },
  {
    id: 'montevideo-uy', name: 'Montevideo', country: 'Uruguay', cc: 'UY', region: 'Latin America',
    lat: -34.90, lng: -56.16, pop: 1740000,
    blurb: 'Stable, temperate Atlantic capital with an easy residency path and modest climate exposure.',
    gawc: 'Gamma-', iata: 'MVD', dest: 20, buy: 2800, rent: 800,
    income: 36, capgains: 12, regime: 'territorial', expatRegime: true,
    expat: 70, col: 45, health: 70, safety: 55, stability: 1.0, english: 58, visa: 80,
    heat: [28, 38, 46], drought: [30, 38, 45], flood: [30, 38, 45], wildfire: [10, 15, 20], water: [25, 30, 36],
  },
  {
    id: 'london-uk', name: 'London', country: 'United Kingdom', cc: 'GB', region: 'Western Europe',
    lat: 51.51, lng: -0.13, pop: 9540000,
    blurb: 'Top-tier global hub with mild, water-secure climate; main exposure is tidal and surface flooding.',
    gawc: 'Alpha++', iata: 'LHR', dest: 190, buy: 13000, rent: 2200,
    income: 45, capgains: 24, regime: 'worldwide', expatRegime: false,
    expat: 62, col: 85, health: 78, safety: 65, stability: 0.4, english: 100, visa: 45,
    heat: [28, 40, 50], drought: [25, 34, 42], flood: [35, 44, 52], wildfire: [8, 12, 16], water: [35, 44, 52],
  },
  {
    id: 'new-york-us', name: 'New York', country: 'United States', cc: 'US', region: 'North America',
    lat: 40.71, lng: -74.01, pop: 18800000,
    blurb: 'The benchmark global city, with serious coastal-storm and flood exposure on a warming Atlantic.',
    gawc: 'Alpha++', iata: 'JFK', dest: 180, buy: 16000, rent: 3500,
    income: 45, capgains: 28, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 100, health: 72, safety: 60, stability: 0.2, english: 100, visa: 35,
    heat: [38, 50, 60], drought: [25, 32, 40], flood: [50, 62, 72], wildfire: [8, 12, 16], water: [25, 32, 40],
  },
  {
    id: 'paris-fr', name: 'Paris', country: 'France', cc: 'FR', region: 'Western Europe',
    lat: 48.86, lng: 2.35, pop: 11100000,
    blurb: 'Dense cultural capital facing sharper heatwaves, with moderate Seine flood risk.',
    gawc: 'Alpha+', iata: 'CDG', dest: 200, buy: 14000, rent: 1900,
    income: 49, capgains: 30, regime: 'worldwide', expatRegime: false,
    expat: 58, col: 80, health: 82, safety: 60, stability: 0.3, english: 55, visa: 55,
    heat: [40, 54, 64], drought: [35, 46, 55], flood: [30, 38, 46], wildfire: [10, 16, 22], water: [35, 45, 54],
  },
  {
    id: 'amsterdam-nl', name: 'Amsterdam', country: 'Netherlands', cc: 'NL', region: 'Western Europe',
    lat: 52.37, lng: 4.90, pop: 1170000,
    blurb: 'Highly livable and expat-friendly, but largely below sea level — flood defense is existential.',
    gawc: 'Alpha', iata: 'AMS', dest: 200, buy: 9000, rent: 2100,
    income: 49, capgains: 32, regime: 'worldwide', expatRegime: true,
    expat: 68, col: 82, health: 82, safety: 75, stability: 0.9, english: 90, visa: 55,
    heat: [26, 38, 48], drought: [25, 33, 41], flood: [55, 65, 74], wildfire: [6, 10, 14], water: [30, 38, 46],
  },
  {
    id: 'barcelona-es', name: 'Barcelona', country: 'Spain', cc: 'ES', region: 'Southern Europe',
    lat: 41.39, lng: 2.17, pop: 5600000,
    blurb: 'Mediterranean magnet with rising heat, drought and water stress on a crowded coast.',
    gawc: 'Alpha-', iata: 'BCN', dest: 160, buy: 5000, rent: 1400,
    income: 47, capgains: 28, regime: 'worldwide', expatRegime: true,
    expat: 78, col: 55, health: 80, safety: 62, stability: 0.5, english: 58, visa: 72,
    heat: [48, 60, 70], drought: [55, 66, 76], flood: [30, 38, 46], wildfire: [35, 45, 54], water: [60, 72, 82],
  },
  {
    id: 'vienna-at', name: 'Vienna', country: 'Austria', cc: 'AT', region: 'Western Europe',
    lat: 48.21, lng: 16.37, pop: 1980000,
    blurb: 'Perennially high on livability rankings, temperate and water-secure with managed Danube flood risk.',
    gawc: 'Alpha-', iata: 'VIE', dest: 180, buy: 8000, rent: 1300,
    income: 50, capgains: 27.5, regime: 'worldwide', expatRegime: false,
    expat: 64, col: 70, health: 85, safety: 85, stability: 1.0, english: 73, visa: 50,
    heat: [30, 42, 52], drought: [28, 36, 44], flood: [24, 30, 37], wildfire: [8, 12, 16], water: [25, 32, 40],
  },
  {
    id: 'copenhagen-dk', name: 'Copenhagen', country: 'Denmark', cc: 'DK', region: 'Northern Europe',
    lat: 55.68, lng: 12.57, pop: 1370000,
    blurb: 'Cool, stable and well-governed; coastal and cloudburst flooding are the main climate watch-items.',
    gawc: 'Beta+', iata: 'CPH', dest: 150, buy: 8500, rent: 1800,
    income: 56, capgains: 42, regime: 'worldwide', expatRegime: true,
    expat: 60, col: 90, health: 84, safety: 82, stability: 1.0, english: 88, visa: 50,
    heat: [22, 32, 42], drought: [22, 30, 38], flood: [40, 48, 56], wildfire: [4, 7, 10], water: [20, 27, 34],
  },
  {
    id: 'stockholm-se', name: 'Stockholm', country: 'Sweden', cc: 'SE', region: 'Northern Europe',
    lat: 59.33, lng: 18.07, pop: 1660000,
    blurb: 'Cool northern capital with abundant water and low overall hazard, though wildfire summers are emerging.',
    gawc: 'Alpha-', iata: 'ARN', dest: 160, buy: 8000, rent: 1500,
    income: 52, capgains: 30, regime: 'worldwide', expatRegime: false,
    expat: 58, col: 80, health: 82, safety: 70, stability: 1.0, english: 90, visa: 50,
    heat: [20, 30, 40], drought: [20, 28, 36], flood: [25, 32, 40], wildfire: [10, 16, 22], water: [15, 20, 26],
  },
  {
    id: 'vancouver-ca', name: 'Vancouver', country: 'Canada', cc: 'CA', region: 'North America',
    lat: 49.28, lng: -123.12, pop: 2640000,
    blurb: 'Mild Pacific climate prized as a haven, but heat domes and wildfire smoke now reach it regularly.',
    gawc: 'Beta', iata: 'YVR', dest: 130, buy: 11000, rent: 2200,
    income: 53, capgains: 27, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 85, health: 76, safety: 68, stability: 0.9, english: 100, visa: 70,
    heat: [22, 36, 48], drought: [25, 34, 42], flood: [30, 38, 46], wildfire: [30, 42, 52], water: [18, 24, 30],
  },
  {
    id: 'buenos-aires-ar', name: 'Buenos Aires', country: 'Argentina', cc: 'AR', region: 'Latin America',
    lat: -34.60, lng: -58.38, pop: 15600000,
    blurb: 'Temperate, affordable and culturally deep, shadowed by economic and political volatility.',
    gawc: 'Alpha', iata: 'EZE', dest: 90, buy: 2500, rent: 600,
    income: 35, capgains: 15, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 38, health: 68, safety: 50, stability: -0.1, english: 55, visa: 70,
    heat: [35, 46, 55], drought: [35, 44, 53], flood: [35, 44, 52], wildfire: [12, 18, 24], water: [25, 32, 40],
  },
  {
    id: 'santiago-cl', name: 'Santiago', country: 'Chile', cc: 'CL', region: 'Latin America',
    lat: -33.45, lng: -70.67, pop: 6900000,
    blurb: 'Stable and modern by regional standards, but locked in a long megadrought with heavy water stress.',
    gawc: 'Alpha-', iata: 'SCL', dest: 80, buy: 3000, rent: 700,
    income: 40, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 65, col: 50, health: 70, safety: 55, stability: 0.3, english: 52, visa: 65,
    heat: [40, 52, 62], drought: [60, 70, 80], flood: [18, 24, 30], wildfire: [40, 50, 58], water: [62, 72, 82],
  },
  {
    id: 'auckland-nz', name: 'Auckland', country: 'New Zealand', cc: 'NZ', region: 'Oceania',
    lat: -36.85, lng: 174.76, pop: 1650000,
    blurb: 'Mild oceanic climate and political stability make it a classic climate haven — at a distance from everywhere.',
    gawc: 'Beta', iata: 'AKL', dest: 70, buy: 8500, rent: 1700,
    income: 39, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 72, col: 80, health: 78, safety: 72, stability: 1.1, english: 100, visa: 60,
    heat: [22, 32, 42], drought: [25, 34, 42], flood: [30, 38, 46], wildfire: [12, 18, 24], water: [18, 24, 30],
  },
  {
    id: 'bangkok-th', name: 'Bangkok', country: 'Thailand', cc: 'TH', region: 'Southeast Asia',
    lat: 13.76, lng: 100.50, pop: 10700000,
    blurb: 'Affordable, well-connected hub, but hot, low-lying and sinking — among the most flood-exposed cities here.',
    gawc: 'Alpha', iata: 'BKK', dest: 140, buy: 4000, rent: 700,
    income: 35, capgains: 0, regime: 'territorial', expatRegime: false,
    expat: 60, col: 48, health: 74, safety: 62, stability: -0.2, english: 45, visa: 60,
    heat: [65, 76, 84], drought: [35, 44, 52], flood: [60, 72, 82], wildfire: [8, 12, 16], water: [45, 54, 62],
  },
  {
    id: 'kuala-lumpur-my', name: 'Kuala Lumpur', country: 'Malaysia', cc: 'MY', region: 'Southeast Asia',
    lat: 3.14, lng: 101.69, pop: 8200000,
    blurb: 'Low-cost, English-capable tropical hub with easy long-stay visas; heat and flash floods are the trade-off.',
    gawc: 'Alpha', iata: 'KUL', dest: 130, buy: 2500, rent: 600,
    income: 30, capgains: 0, regime: 'territorial', expatRegime: false,
    expat: 65, col: 45, health: 76, safety: 60, stability: 0.2, english: 65, visa: 62,
    heat: [60, 72, 80], drought: [25, 32, 40], flood: [45, 55, 63], wildfire: [10, 16, 22], water: [35, 42, 50],
  },
  {
    id: 'cape-town-za', name: 'Cape Town', country: 'South Africa', cc: 'ZA', region: 'Africa',
    lat: -33.92, lng: 18.42, pop: 4800000,
    blurb: 'Stunning and affordable, but a "Day Zero" water city with mounting drought and wildfire risk.',
    gawc: 'Beta', iata: 'CPT', dest: 70, buy: 2500, rent: 700,
    income: 45, capgains: 18, regime: 'worldwide', expatRegime: false,
    expat: 68, col: 45, health: 64, safety: 40, stability: -0.1, english: 70, visa: 58,
    heat: [40, 52, 62], drought: [62, 74, 84], flood: [25, 32, 40], wildfire: [45, 56, 65], water: [65, 78, 88],
  },
  {
    id: 'tbilisi-ge', name: 'Tbilisi', country: 'Georgia', cc: 'GE', region: 'Western Asia',
    lat: 41.72, lng: 44.79, pop: 1180000,
    blurb: 'Cheap, low-tax and visa-easy for long stays; smaller global footprint and continental summers.',
    gawc: 'Sufficiency', iata: 'TBS', dest: 50, buy: 1500, rent: 600,
    income: 20, capgains: 5, regime: 'territorial', expatRegime: true,
    expat: 68, col: 38, health: 60, safety: 65, stability: -0.3, english: 40, visa: 90,
    heat: [38, 50, 60], drought: [35, 44, 53], flood: [25, 32, 40], wildfire: [18, 26, 34], water: [30, 38, 46],
  },
  {
    id: 'medellin-co', name: 'Medellín', country: 'Colombia', cc: 'CO', region: 'Latin America',
    lat: 6.24, lng: -75.58, pop: 4100000,
    blurb: 'The "city of eternal spring" — mild year-round and inexpensive, with landslide and safety caveats.',
    gawc: 'Gamma', iata: 'MDE', dest: 45, buy: 1800, rent: 550,
    income: 39, capgains: 15, regime: 'worldwide', expatRegime: false,
    expat: 72, col: 38, health: 66, safety: 48, stability: -0.4, english: 48, visa: 72,
    heat: [30, 40, 49], drought: [30, 38, 46], flood: [35, 44, 52], wildfire: [12, 18, 24], water: [25, 32, 40],
  },
  {
    id: 'dublin-ie', name: 'Dublin', country: 'Ireland', cc: 'IE', region: 'Western Europe',
    lat: 53.35, lng: -6.26, pop: 1460000,
    blurb: 'Mild, wet and water-secure with strong stability; coastal and rainfall flooding are the main risks.',
    gawc: 'Alpha-', iata: 'DUB', dest: 120, buy: 9000, rent: 2400,
    income: 48, capgains: 33, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 85, health: 72, safety: 66, stability: 0.9, english: 100, visa: 50,
    heat: [18, 28, 38], drought: [20, 28, 36], flood: [32, 40, 48], wildfire: [4, 7, 10], water: [20, 26, 32],
  },
]

/* ---- Metric helpers ------------------------------------------------------ */

const m = <T,>(value: T, source: string, asOf: string, confidence: Confidence, note?: string) =>
  note ? { value, source, asOf, confidence, note } : { value, source, asOf, confidence }

const HAZARD_SOURCE: Record<Hazard, string> = {
  heat: 'worldbank-cckp',
  drought: 'wri-aqueduct-40',
  flood: 'wri-aqueduct-40',
  wildfire: 'bellwether-rubric',
  waterStress: 'wri-aqueduct-40',
}

const hazard = (src: string, [now, y2050, y2080]: Triple) => ({
  now: m(now, src, '2024', 'medium' as Confidence),
  y2050: m(y2050, src, '2050', 'low' as Confidence),
  y2080: m(y2080, src, '2080', 'low' as Confidence),
  scenario: 'SSP2-4.5' as const,
})

function toCity(r: Row): City {
  return {
    id: r.id,
    name: r.name,
    country: r.country,
    countryCode: r.cc,
    region: r.region,
    coords: { lat: r.lat, lng: r.lng },
    population: m(r.pop, 'un-wup-2018', '2020', 'medium'),
    blurb: r.blurb,
    factors: {
      importance: m(r.gawc, 'gawc-2024', '2024', 'high'),
      climate: {
        hazards: {
          heat: hazard(HAZARD_SOURCE.heat, r.heat),
          drought: hazard(HAZARD_SOURCE.drought, r.drought),
          flood: hazard(HAZARD_SOURCE.flood, r.flood),
          wildfire: hazard(HAZARD_SOURCE.wildfire, r.wildfire),
          waterStress: hazard(HAZARD_SOURCE.waterStress, r.water),
        },
      },
      airport: {
        primaryIata: r.iata,
        directDestinations: m(r.dest, 'openflights-2024', '2024', 'medium'),
      },
      realEstate: {
        buyPricePerSqmUsd: m(r.buy, 'numbeo-2025', '2025', 'medium'),
        rent1brCenterUsd: m(r.rent, 'numbeo-2025', '2025', 'medium'),
      },
      taxation: {
        topIncomeRatePct: m(r.income, 'pwc-tax-2025', '2025', 'high'),
        capitalGainsRatePct: m(r.capgains, 'pwc-tax-2025', '2025', 'medium'),
        regime: m(r.regime, 'pwc-tax-2025', '2025', 'medium'),
        hasExpatRegime: m(r.expatRegime, 'pwc-tax-2025', '2025', 'medium'),
      },
      expat: m(r.expat, 'internations-2024', '2024', 'low', 'Country-level survey; city value estimated.'),
      costOfLiving: m(r.col, 'numbeo-2025', '2025', 'medium'),
      healthcare: m(r.health, 'numbeo-2025', '2025', 'medium'),
      safety: {
        crimeSafetyIndex: m(r.safety, 'numbeo-2025', '2025', 'medium'),
        politicalStability: m(r.stability, 'worldbank-wgi-2023', '2023', 'high'),
      },
      accessibility: {
        englishProficiency: m(
          r.english,
          r.english === 100 ? 'bellwether-rubric' : 'ef-epi-2024',
          '2024',
          r.english === 100 ? 'high' : 'medium',
          r.english === 100 ? 'Majority-English-speaking city.' : undefined,
        ),
        visaEaseIndex: m(r.visa, 'bellwether-rubric', '2026', 'low', 'Curated residency-pathway estimate.'),
      },
    },
  }
}

/* ---- Emit ---------------------------------------------------------------- */

mkdirSync(CITIES_DIR, { recursive: true })
let ok = 0
for (const row of ROWS) {
  const city = toCity(row)
  const parsed = CitySchema.safeParse(city)
  if (!parsed.success) {
    console.error(`✗ ${row.id} invalid:`)
    console.error(parsed.error.issues.map((i) => `    ${i.path.join('.')}: ${i.message}`).join('\n'))
    process.exit(1)
  }
  writeFileSync(join(CITIES_DIR, `${row.id}.json`), JSON.stringify(parsed.data, null, 2) + '\n')
  ok++
}
console.log(`✓ seeded ${ok} city files → data/cities/`)
