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
  {
    id: 'hong-kong-hk', name: 'Hong Kong', country: 'Hong Kong', cc: 'HK', region: 'East Asia',
    lat: 22.32, lng: 114.17, pop: 7500000,
    blurb: 'Dense, low-tax financial gateway; rising heat, humidity and typhoon-driven flooding.',
    gawc: 'Alpha+', iata: 'HKG', dest: 160, buy: 28000, rent: 2200,
    income: 17, capgains: 0, regime: 'territorial', expatRegime: false,
    expat: 58, col: 95, health: 84, safety: 80, stability: 0.5, english: 62, visa: 45,
    heat: [60, 72, 80], drought: [25, 32, 40], flood: [50, 60, 68], wildfire: [8, 12, 16], water: [40, 48, 56],
  },
  {
    id: 'sydney-au', name: 'Sydney', country: 'Australia', cc: 'AU', region: 'Oceania',
    lat: -33.87, lng: 151.21, pop: 5300000,
    blurb: 'Coastal and highly livable, with bushfire smoke, heatwaves and drought cycles to weigh.',
    gawc: 'Alpha+', iata: 'SYD', dest: 100, buy: 9500, rent: 1900,
    income: 45, capgains: 23, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 82, health: 80, safety: 72, stability: 0.9, english: 100, visa: 55,
    heat: [42, 54, 63], drought: [45, 56, 65], flood: [30, 38, 46], wildfire: [48, 58, 66], water: [40, 50, 58],
  },
  {
    id: 'seoul-kr', name: 'Seoul', country: 'South Korea', cc: 'KR', region: 'East Asia',
    lat: 37.57, lng: 126.98, pop: 9900000,
    blurb: 'Tech-forward megacity with excellent healthcare; hot humid summers and monsoon flooding.',
    gawc: 'Alpha+', iata: 'ICN', dest: 130, buy: 13000, rent: 1100,
    income: 49, capgains: 22, regime: 'worldwide', expatRegime: false,
    expat: 55, col: 78, health: 86, safety: 78, stability: 0.6, english: 50, visa: 45,
    heat: [48, 60, 68], drought: [25, 32, 40], flood: [45, 54, 62], wildfire: [10, 15, 20], water: [30, 38, 46],
  },
  {
    id: 'shanghai-cn', name: 'Shanghai', country: 'China', cc: 'CN', region: 'East Asia',
    lat: 31.23, lng: 121.47, pop: 29000000,
    blurb: 'China’s commercial capital on a sinking coastal delta — flood, subsidence and typhoon exposed.',
    gawc: 'Alpha+', iata: 'PVG', dest: 140, buy: 12000, rent: 1300,
    income: 45, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 50, col: 70, health: 76, safety: 80, stability: 0.4, english: 40, visa: 35,
    heat: [50, 62, 70], drought: [25, 32, 40], flood: [55, 65, 73], wildfire: [6, 10, 14], water: [40, 48, 56],
  },
  {
    id: 'los-angeles-us', name: 'Los Angeles', country: 'United States', cc: 'US', region: 'North America',
    lat: 34.05, lng: -118.24, pop: 12500000,
    blurb: 'Sprawling Pacific metro facing wildfire, drought, heat and chronic water stress.',
    gawc: 'Alpha', iata: 'LAX', dest: 160, buy: 8500, rent: 2400,
    income: 50, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 62, col: 90, health: 72, safety: 55, stability: 0.2, english: 100, visa: 35,
    heat: [50, 62, 70], drought: [58, 68, 78], flood: [18, 24, 30], wildfire: [55, 66, 74], water: [60, 70, 80],
  },
  {
    id: 'chicago-us', name: 'Chicago', country: 'United States', cc: 'US', region: 'North America',
    lat: 41.88, lng: -87.63, pop: 8900000,
    blurb: 'Great-Lakes water security and a frequent climate-haven pick; cold, with rising heat and flooding.',
    gawc: 'Alpha', iata: 'ORD', dest: 170, buy: 4500, rent: 1900,
    income: 42, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 75, health: 74, safety: 52, stability: 0.2, english: 100, visa: 35,
    heat: [32, 44, 54], drought: [22, 30, 38], flood: [35, 42, 50], wildfire: [10, 15, 20], water: [12, 16, 20],
  },
  {
    id: 'san-francisco-us', name: 'San Francisco', country: 'United States', cc: 'US', region: 'North America',
    lat: 37.77, lng: -122.42, pop: 4700000,
    blurb: 'Tech capital with mild temperatures, but wildfire smoke, drought and bay sea-level rise.',
    gawc: 'Alpha', iata: 'SFO', dest: 130, buy: 12000, rent: 2900,
    income: 50, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 100, health: 76, safety: 50, stability: 0.2, english: 100, visa: 35,
    heat: [30, 42, 52], drought: [55, 65, 75], flood: [28, 36, 44], wildfire: [45, 56, 64], water: [55, 65, 74],
  },
  {
    id: 'miami-us', name: 'Miami', country: 'United States', cc: 'US', region: 'North America',
    lat: 25.76, lng: -80.19, pop: 6200000,
    blurb: 'No state income tax — but ground zero for sea-level rise, hurricanes and extreme heat.',
    gawc: 'Beta', iata: 'MIA', dest: 140, buy: 6000, rent: 2600,
    income: 37, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 65, col: 80, health: 70, safety: 55, stability: 0.2, english: 100, visa: 35,
    heat: [60, 72, 80], drought: [20, 26, 32], flood: [70, 82, 92], wildfire: [8, 12, 16], water: [35, 44, 52],
  },
  {
    id: 'boston-us', name: 'Boston', country: 'United States', cc: 'US', region: 'North America',
    lat: 42.36, lng: -71.06, pop: 4900000,
    blurb: 'Northern, water-secure and world-class for healthcare; coastal flooding is the main risk.',
    gawc: 'Beta+', iata: 'BOS', dest: 120, buy: 8000, rent: 2800,
    income: 42, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 88, health: 82, safety: 62, stability: 0.2, english: 100, visa: 35,
    heat: [28, 40, 50], drought: [22, 30, 38], flood: [42, 52, 60], wildfire: [8, 12, 16], water: [18, 24, 30],
  },
  {
    id: 'sao-paulo-br', name: 'São Paulo', country: 'Brazil', cc: 'BR', region: 'Latin America',
    lat: -23.55, lng: -46.63, pop: 22400000,
    blurb: 'Latin America’s economic engine; heat, recurring water crises and urban flooding.',
    gawc: 'Alpha', iata: 'GRU', dest: 110, buy: 2800, rent: 700,
    income: 27.5, capgains: 15, regime: 'worldwide', expatRegime: false,
    expat: 62, col: 45, health: 66, safety: 45, stability: -0.3, english: 48, visa: 60,
    heat: [40, 52, 62], drought: [48, 58, 68], flood: [40, 48, 56], wildfire: [18, 26, 34], water: [50, 60, 70],
  },
  {
    id: 'milan-it', name: 'Milan', country: 'Italy', cc: 'IT', region: 'Southern Europe',
    lat: 45.46, lng: 9.19, pop: 3200000,
    blurb: 'Italy’s business capital with a flat-tax regime for newcomers; Po Valley heat, drought and smog.',
    gawc: 'Alpha', iata: 'MXP', dest: 150, buy: 6500, rent: 1500,
    income: 43, capgains: 26, regime: 'worldwide', expatRegime: true,
    expat: 64, col: 70, health: 80, safety: 62, stability: 0.4, english: 55, visa: 60,
    heat: [44, 56, 66], drought: [45, 56, 66], flood: [28, 36, 44], wildfire: [18, 26, 34], water: [45, 55, 64],
  },
  {
    id: 'frankfurt-de', name: 'Frankfurt', country: 'Germany', cc: 'DE', region: 'Western Europe',
    lat: 50.11, lng: 8.68, pop: 2300000,
    blurb: 'Europe’s financial and aviation hub; temperate with moderate, manageable climate risk.',
    gawc: 'Alpha', iata: 'FRA', dest: 220, buy: 8000, rent: 1400,
    income: 47, capgains: 26, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 72, health: 82, safety: 70, stability: 0.6, english: 72, visa: 55,
    heat: [30, 42, 52], drought: [32, 42, 52], flood: [26, 33, 40], wildfire: [12, 18, 24], water: [28, 36, 44],
  },
  {
    id: 'brussels-be', name: 'Brussels', country: 'Belgium', cc: 'BE', region: 'Western Europe',
    lat: 50.85, lng: 4.35, pop: 2100000,
    blurb: 'The EU’s administrative capital; mild, temperate and low-hazard.',
    gawc: 'Alpha', iata: 'BRU', dest: 180, buy: 6000, rent: 1300,
    income: 50, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 72, health: 80, safety: 60, stability: 0.6, english: 65, visa: 55,
    heat: [26, 38, 48], drought: [28, 36, 44], flood: [30, 38, 46], wildfire: [6, 10, 14], water: [28, 35, 42],
  },
  {
    id: 'istanbul-tr', name: 'Istanbul', country: 'Türkiye', cc: 'TR', region: 'Western Asia',
    lat: 41.01, lng: 28.98, pop: 15600000,
    blurb: 'Transcontinental megacity; earthquake risk layered on heat, drought and water stress.',
    gawc: 'Alpha', iata: 'IST', dest: 230, buy: 3500, rent: 800,
    income: 40, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 58, col: 50, health: 72, safety: 60, stability: -0.6, english: 45, visa: 60,
    heat: [45, 57, 66], drought: [50, 60, 70], flood: [25, 32, 40], wildfire: [30, 40, 48], water: [55, 65, 74],
  },
  {
    id: 'mumbai-in', name: 'Mumbai', country: 'India', cc: 'IN', region: 'South Asia',
    lat: 19.08, lng: 72.88, pop: 21000000,
    blurb: 'India’s financial capital; extreme monsoon flooding, heat and sea-level exposure.',
    gawc: 'Alpha', iata: 'BOM', dest: 100, buy: 9000, rent: 900,
    income: 36, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 48, col: 50, health: 60, safety: 55, stability: -0.4, english: 60, visa: 45,
    heat: [62, 74, 82], drought: [35, 44, 52], flood: [65, 76, 85], wildfire: [5, 8, 12], water: [45, 54, 62],
  },
  {
    id: 'jakarta-id', name: 'Jakarta', country: 'Indonesia', cc: 'ID', region: 'Southeast Asia',
    lat: -6.21, lng: 106.85, pop: 11000000,
    blurb: 'A sinking capital — among the most flood- and subsidence-threatened cities on Earth.',
    gawc: 'Alpha', iata: 'CGK', dest: 90, buy: 3500, rent: 700,
    income: 35, capgains: 10, regime: 'worldwide', expatRegime: false,
    expat: 52, col: 45, health: 64, safety: 55, stability: -0.2, english: 45, visa: 50,
    heat: [62, 74, 82], drought: [30, 38, 46], flood: [75, 86, 94], wildfire: [8, 12, 16], water: [50, 60, 70],
  },
  {
    id: 'taipei-tw', name: 'Taipei', country: 'Taiwan', cc: 'TW', region: 'East Asia',
    lat: 25.03, lng: 121.57, pop: 7000000,
    blurb: 'High-tech island capital with great healthcare; typhoons, heat and flooding.',
    gawc: 'Alpha', iata: 'TPE', dest: 100, buy: 11000, rent: 900,
    income: 40, capgains: 0, regime: 'territorial', expatRegime: false,
    expat: 65, col: 65, health: 86, safety: 82, stability: 0.6, english: 50, visa: 50,
    heat: [55, 66, 74], drought: [28, 35, 43], flood: [50, 60, 68], wildfire: [8, 12, 16], water: [35, 43, 51],
  },
  {
    id: 'tel-aviv-il', name: 'Tel Aviv', country: 'Israel', cc: 'IL', region: 'Middle East',
    lat: 32.07, lng: 34.78, pop: 4000000,
    blurb: 'Mediterranean tech hub reliant on desalination; heat, drought and security risk.',
    gawc: 'Beta+', iata: 'TLV', dest: 130, buy: 11000, rent: 2000,
    income: 50, capgains: 25, regime: 'worldwide', expatRegime: true,
    expat: 55, col: 95, health: 82, safety: 50, stability: -0.6, english: 70, visa: 50,
    heat: [50, 62, 70], drought: [55, 65, 75], flood: [22, 28, 35], wildfire: [25, 34, 42], water: [50, 58, 66],
  },
  {
    id: 'munich-de', name: 'Munich', country: 'Germany', cc: 'DE', region: 'Western Europe',
    lat: 48.14, lng: 11.58, pop: 1600000,
    blurb: 'Prosperous, safe and alpine-adjacent; moderate, manageable climate exposure.',
    gawc: 'Beta+', iata: 'MUC', dest: 200, buy: 11000, rent: 1600,
    income: 47, capgains: 26, regime: 'worldwide', expatRegime: false,
    expat: 64, col: 80, health: 84, safety: 80, stability: 0.6, english: 72, visa: 55,
    heat: [28, 40, 50], drought: [30, 40, 50], flood: [26, 33, 40], wildfire: [10, 16, 22], water: [24, 31, 38],
  },
  {
    id: 'prague-cz', name: 'Prague', country: 'Czechia', cc: 'CZ', region: 'Central Europe',
    lat: 50.08, lng: 14.44, pop: 1300000,
    blurb: 'Affordable, safe central-European capital; temperate with low overall hazard.',
    gawc: 'Beta+', iata: 'PRG', dest: 150, buy: 5500, rent: 1100,
    income: 23, capgains: 15, regime: 'worldwide', expatRegime: false,
    expat: 64, col: 60, health: 78, safety: 78, stability: 0.9, english: 60, visa: 55,
    heat: [30, 42, 52], drought: [32, 42, 52], flood: [28, 35, 42], wildfire: [10, 16, 22], water: [28, 35, 42],
  },
  {
    id: 'warsaw-pl', name: 'Warsaw', country: 'Poland', cc: 'PL', region: 'Central Europe',
    lat: 52.23, lng: 21.01, pop: 1800000,
    blurb: 'Fast-growing and affordable; continental climate with modest hazard.',
    gawc: 'Alpha-', iata: 'WAW', dest: 130, buy: 4500, rent: 1000,
    income: 32, capgains: 19, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 55, health: 74, safety: 75, stability: 0.5, english: 62, visa: 55,
    heat: [28, 40, 50], drought: [35, 45, 54], flood: [25, 32, 40], wildfire: [12, 18, 24], water: [30, 38, 46],
  },
  {
    id: 'athens-gr', name: 'Athens', country: 'Greece', cc: 'GR', region: 'Southern Europe',
    lat: 37.98, lng: 23.73, pop: 3200000,
    blurb: 'Sunny and affordable with tax breaks for newcomers; severe heat, drought and wildfire.',
    gawc: 'Beta', iata: 'ATH', dest: 130, buy: 3500, rent: 900,
    income: 44, capgains: 15, regime: 'worldwide', expatRegime: true,
    expat: 66, col: 55, health: 72, safety: 62, stability: 0.1, english: 55, visa: 65,
    heat: [55, 67, 76], drought: [58, 68, 78], flood: [22, 28, 35], wildfire: [50, 60, 68], water: [60, 70, 80],
  },
  {
    id: 'rome-it', name: 'Rome', country: 'Italy', cc: 'IT', region: 'Southern Europe',
    lat: 41.90, lng: 12.50, pop: 4300000,
    blurb: 'Historic capital with a flat-tax option; Mediterranean heat, drought and water stress.',
    gawc: 'Alpha-', iata: 'FCO', dest: 160, buy: 5000, rent: 1200,
    income: 43, capgains: 26, regime: 'worldwide', expatRegime: true,
    expat: 66, col: 65, health: 78, safety: 60, stability: 0.4, english: 50, visa: 60,
    heat: [50, 62, 72], drought: [52, 62, 72], flood: [24, 30, 37], wildfire: [35, 45, 54], water: [52, 62, 72],
  },
  {
    id: 'helsinki-fi', name: 'Helsinki', country: 'Finland', cc: 'FI', region: 'Northern Europe',
    lat: 60.17, lng: 24.94, pop: 1300000,
    blurb: 'Cool, stable and water-rich northern capital with very low climate hazard.',
    gawc: 'Beta', iata: 'HEL', dest: 130, buy: 7000, rent: 1300,
    income: 51, capgains: 34, regime: 'worldwide', expatRegime: false,
    expat: 56, col: 78, health: 82, safety: 82, stability: 1.1, english: 85, visa: 50,
    heat: [18, 28, 38], drought: [18, 26, 34], flood: [22, 28, 35], wildfire: [8, 14, 20], water: [14, 19, 25],
  },
  {
    id: 'oslo-no', name: 'Oslo', country: 'Norway', cc: 'NO', region: 'Northern Europe',
    lat: 59.91, lng: 10.75, pop: 1100000,
    blurb: 'Wealthy, cool and water-secure; among the lowest-hazard cities here, but costly.',
    gawc: 'Beta', iata: 'OSL', dest: 120, buy: 9000, rent: 1700,
    income: 47, capgains: 38, regime: 'worldwide', expatRegime: false,
    expat: 58, col: 95, health: 84, safety: 82, stability: 1.1, english: 88, visa: 50,
    heat: [18, 28, 38], drought: [18, 26, 34], flood: [24, 30, 37], wildfire: [8, 14, 20], water: [12, 16, 22],
  },
  {
    id: 'bogota-co', name: 'Bogotá', country: 'Colombia', cc: 'CO', region: 'Latin America',
    lat: 4.71, lng: -74.07, pop: 11000000,
    blurb: 'High-altitude, mild capital; low heat but landslide, flooding and water variability.',
    gawc: 'Beta+', iata: 'BOG', dest: 70, buy: 1800, rent: 500,
    income: 39, capgains: 15, regime: 'worldwide', expatRegime: false,
    expat: 62, col: 40, health: 66, safety: 45, stability: -0.4, english: 48, visa: 70,
    heat: [26, 36, 45], drought: [35, 44, 53], flood: [38, 46, 54], wildfire: [14, 20, 26], water: [35, 43, 51],
  },
  {
    id: 'panama-city-pa', name: 'Panama City', country: 'Panama', cc: 'PA', region: 'Latin America',
    lat: 8.98, lng: -79.52, pop: 1900000,
    blurb: 'Territorial-tax hub of the Americas with easy residency; tropical heat and flooding.',
    gawc: 'Beta', iata: 'PTY', dest: 90, buy: 2500, rent: 1100,
    income: 25, capgains: 10, regime: 'territorial', expatRegime: true,
    expat: 68, col: 55, health: 70, safety: 58, stability: 0.1, english: 55, visa: 78,
    heat: [58, 70, 78], drought: [30, 38, 46], flood: [45, 55, 63], wildfire: [8, 12, 16], water: [35, 43, 51],
  },
  {
    id: 'doha-qa', name: 'Doha', country: 'Qatar', cc: 'QA', region: 'Middle East',
    lat: 25.29, lng: 51.53, pop: 2400000,
    blurb: 'Tax-free Gulf hub; extreme heat and water stress dominate, other hazards low.',
    gawc: 'Beta', iata: 'DOH', dest: 170, buy: 4000, rent: 1700,
    income: 0, capgains: 0, regime: 'none', expatRegime: false,
    expat: 60, col: 65, health: 74, safety: 88, stability: 0.7, english: 65, visa: 65,
    heat: [78, 88, 94], drought: [70, 78, 85], flood: [18, 24, 30], wildfire: [2, 3, 4], water: [88, 92, 95],
  },
  {
    id: 'bengaluru-in', name: 'Bengaluru', country: 'India', cc: 'IN', region: 'South Asia',
    lat: 12.97, lng: 77.59, pop: 13000000,
    blurb: 'India’s tech hub with a milder highland climate, but acute water stress and urban flooding.',
    gawc: 'Beta', iata: 'BLR', dest: 60, buy: 2500, rent: 500,
    income: 36, capgains: 20, regime: 'worldwide', expatRegime: false,
    expat: 52, col: 42, health: 64, safety: 58, stability: -0.4, english: 65, visa: 45,
    heat: [42, 54, 63], drought: [45, 56, 65], flood: [40, 48, 56], wildfire: [10, 16, 22], water: [60, 70, 80],
  },
  {
    id: 'ho-chi-minh-city-vn', name: 'Ho Chi Minh City', country: 'Vietnam', cc: 'VN', region: 'Southeast Asia',
    lat: 10.82, lng: 106.63, pop: 9300000,
    blurb: 'Fast-growing Mekong-delta megacity that is sinking — highly flood- and heat-exposed.',
    gawc: 'Beta', iata: 'SGN', dest: 80, buy: 4500, rent: 700,
    income: 35, capgains: 5, regime: 'worldwide', expatRegime: false,
    expat: 58, col: 45, health: 66, safety: 62, stability: 0.1, english: 45, visa: 55,
    heat: [62, 74, 82], drought: [30, 38, 46], flood: [65, 76, 85], wildfire: [5, 8, 12], water: [45, 54, 62],
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

/* ---- Verified country/city data (researched against authoritative sources) ----
 * GaWC 2024 roster · PwC Worldwide Tax Summaries · EF EPI 2024 · World Bank WGI.
 * These override the per-row seed guesses and travel at higher confidence. */

const TAX_BY_CC: Record<string, { income: number; capgains: number; regime: TaxRegime }> = {
  PT: { income: 53, capgains: 28, regime: 'worldwide' },
  SG: { income: 24, capgains: 0, regime: 'territorial' },
  CA: { income: 54.8, capgains: 27.4, regime: 'worldwide' },
  ES: { income: 47, capgains: 30, regime: 'worldwide' },
  JP: { income: 56, capgains: 20.3, regime: 'hybrid' },
  AE: { income: 0, capgains: 0, regime: 'none' },
  MX: { income: 35, capgains: 10, regime: 'worldwide' },
  DE: { income: 47.5, capgains: 26.4, regime: 'worldwide' },
  AU: { income: 47, capgains: 23.5, regime: 'worldwide' },
  US: { income: 37, capgains: 23.8, regime: 'worldwide' },
  CH: { income: 43.3, capgains: 0, regime: 'worldwide' },
  UY: { income: 36, capgains: 12, regime: 'hybrid' },
  GB: { income: 45, capgains: 24, regime: 'worldwide' },
  FR: { income: 49, capgains: 30, regime: 'worldwide' },
  NL: { income: 49.5, capgains: 31, regime: 'worldwide' },
  AT: { income: 55, capgains: 27.5, regime: 'worldwide' },
  DK: { income: 60.5, capgains: 42, regime: 'worldwide' },
  SE: { income: 52, capgains: 30, regime: 'worldwide' },
  AR: { income: 35, capgains: 15, regime: 'worldwide' },
  CL: { income: 35.5, capgains: 0, regime: 'worldwide' },
  NZ: { income: 39, capgains: 0, regime: 'worldwide' },
  TH: { income: 35, capgains: 0, regime: 'hybrid' },
  MY: { income: 30, capgains: 0, regime: 'hybrid' },
  ZA: { income: 45, capgains: 18, regime: 'worldwide' },
  GE: { income: 20, capgains: 5, regime: 'territorial' },
  CO: { income: 39, capgains: 15, regime: 'worldwide' },
  IE: { income: 52, capgains: 33, regime: 'worldwide' },
  HK: { income: 17, capgains: 0, regime: 'territorial' },
  KR: { income: 49.5, capgains: 27.5, regime: 'worldwide' },
  CN: { income: 45, capgains: 20, regime: 'worldwide' },
  BR: { income: 27.5, capgains: 22.5, regime: 'worldwide' },
  IT: { income: 46.2, capgains: 26, regime: 'worldwide' },
  BE: { income: 53.5, capgains: 0, regime: 'worldwide' },
  TR: { income: 40, capgains: 0, regime: 'worldwide' },
  IN: { income: 42.7, capgains: 12.5, regime: 'hybrid' },
  ID: { income: 35, capgains: 0, regime: 'hybrid' },
  TW: { income: 40, capgains: 0, regime: 'hybrid' },
  IL: { income: 50, capgains: 25, regime: 'worldwide' },
  CZ: { income: 23, capgains: 23, regime: 'worldwide' },
  PL: { income: 36, capgains: 19, regime: 'worldwide' },
  GR: { income: 44, capgains: 15, regime: 'worldwide' },
  FI: { income: 45, capgains: 34, regime: 'worldwide' },
  NO: { income: 39.8, capgains: 37.8, regime: 'worldwide' },
  PA: { income: 25, capgains: 10, regime: 'territorial' },
  QA: { income: 0, capgains: 0, regime: 'none' },
  VN: { income: 35, capgains: 20, regime: 'worldwide' },
}

/** EF EPI 2024 score, or 'native' for majority-English countries (not in EPI). */
const EPI_BY_CC: Record<string, number | 'native'> = {
  PT: 605, SG: 609, CA: 'native', ES: 538, JP: 454, AE: 489, MX: 459, DE: 598,
  AU: 'native', US: 'native', CH: 550, UY: 538, GB: 'native', FR: 524, NL: 636,
  AT: 600, DK: 603, SE: 608, AR: 562, CL: 525, NZ: 'native', TH: 415, MY: 566,
  ZA: 594, GE: 543, CO: 485, IE: 'native', HK: 549, KR: 523, CN: 455, BR: 466,
  IT: 528, BE: 592, TR: 497, IN: 490, ID: 468, IL: 522, CZ: 567, PL: 588,
  GR: 602, FI: 590, NO: 610, PA: 488, QA: 480, VN: 498,
  // TW omitted — no authoritative 2024 EPI score; falls back to the seed estimate.
}

/** World Bank WGI Political Stability estimate (~2024 release), −2.5…2.5. */
const WGI_BY_CC: Record<string, number> = {
  PT: 0.54, SG: 1.23, CA: 0.6, ES: 0.0, JP: 1.13, AE: 0.79, MX: -0.72, DE: 0.12,
  AU: 0.79, US: -0.1, CH: 0.98, UY: 1.28, GB: 0.26, FR: -0.24, NL: 0.43,
  AT: 0.49, DK: 0.77, SE: 0.6, AR: -0.17, CL: 0.12, NZ: 1.15, TH: -0.68,
  MY: 0.38, ZA: -0.62, GE: -0.61, CO: -0.97, IE: 0.71, HK: 0.63, KR: 0.64,
  CN: -0.15, BR: -0.52, IT: 0.31, BE: 0.12, TR: -0.97, IN: -0.79, ID: -0.61,
  TW: 0.92, IL: -1.04, CZ: 0.97, PL: 0.5, GR: 0.14, FI: 0.83, NO: 0.9,
  PA: 0.26, QA: 0.95, VN: 0.01,
}

/** GaWC 2024 world-city classification, by city id. */
const GAWC_BY_ID: Record<string, GaWCClass> = {
  'london-uk': 'Alpha++', 'new-york-us': 'Alpha++', 'hong-kong-hk': 'Alpha+',
  'singapore-sg': 'Alpha+', 'shanghai-cn': 'Alpha+', 'dubai-ae': 'Alpha+',
  'paris-fr': 'Alpha+', 'tokyo-jp': 'Alpha+', 'sydney-au': 'Alpha+',
  'los-angeles-us': 'Alpha', 'toronto-ca': 'Alpha', 'seoul-kr': 'Alpha',
  'madrid-es': 'Alpha', 'milan-it': 'Alpha', 'mexico-city-mx': 'Alpha',
  'sao-paulo-br': 'Alpha', 'mumbai-in': 'Alpha', 'amsterdam-nl': 'Alpha',
  'frankfurt-de': 'Alpha', 'brussels-be': 'Alpha-', 'chicago-us': 'Alpha',
  'istanbul-tr': 'Alpha', 'kuala-lumpur-my': 'Alpha', 'bangkok-th': 'Alpha',
  'jakarta-id': 'Alpha', 'taipei-tw': 'Alpha-', 'warsaw-pl': 'Alpha',
  'vienna-at': 'Alpha-', 'barcelona-es': 'Beta+', 'san-francisco-us': 'Alpha-',
  'buenos-aires-ar': 'Alpha-', 'santiago-cl': 'Alpha-', 'bogota-co': 'Beta+',
  'lisbon-pt': 'Alpha-', 'berlin-de': 'Alpha-', 'melbourne-au': 'Alpha-',
  'auckland-nz': 'Beta+', 'dublin-ie': 'Alpha-', 'prague-cz': 'Beta+',
  'athens-gr': 'Beta+', 'rome-it': 'Beta+', 'stockholm-se': 'Alpha-',
  'copenhagen-dk': 'Beta', 'helsinki-fi': 'Beta-', 'oslo-no': 'Beta',
  'munich-de': 'Alpha-', 'vancouver-ca': 'Beta-', 'boston-us': 'Alpha-',
  'miami-us': 'Beta+', 'tel-aviv-il': 'Beta', 'doha-qa': 'Beta+',
  'cape-town-za': 'Gamma+', 'montevideo-uy': 'Beta-', 'tbilisi-ge': 'Gamma',
  'medellin-co': 'Sufficiency', 'panama-city-pa': 'Beta-', 'bengaluru-in': 'Beta+',
  'ho-chi-minh-city-vn': 'Beta+', 'austin-us': 'Gamma+', 'zurich-ch': 'Alpha-',
}

const epiToScore = (epi: number) => Math.max(0, Math.min(100, Math.round((epi - 350) / 3.1)))

/** Verified per-city figures: nonstop destinations (FlightsFrom) + Numbeo indices
 * (cost-of-living, health care, safety) and property (USD buy/sqm, 1-bed rent).
 * [dest, col, health, safety, buy, rent] */
const CITY_DATA: Record<string, [number, number, number, number, number, number]> = {
  'lisbon-pt': [153, 54.2, 72.4, 67.4, 7891, 1642],
  'singapore-sg': [165, 87.7, 71.9, 77.5, 23509, 2878],
  'toronto-ca': [194, 67.5, 74.1, 56.5, 8927, 1642],
  'madrid-es': [239, 60.0, 79.9, 71.3, 9156, 1608],
  'tokyo-jp': [103, 54.2, 78.7, 74.9, 10947, 1297],
  'dubai-ae': [270, 61.8, 69.9, 83.9, 7244, 2421],
  'mexico-city-mx': [103, 45.9, 65.5, 33.2, 3716, 1101],
  'berlin-de': [166, 70.0, 66.5, 55.5, 9002, 1518],
  'melbourne-au': [70, 70.8, 72.4, 55.8, 6578, 1623],
  'austin-us': [98, 66.4, 64.9, 55.7, 7150, 1927],
  'zurich-ch': [213, 118.5, 70.6, 76.6, 26886, 3040],
  'montevideo-uy': [19, 57.2, 68.5, 43.5, 3609, 742],
  'london-uk': [223, 87.5, 69.5, 44.4, 19874, 3029],
  'new-york-us': [198, 100.0, 62.8, 48.9, 17938, 4285],
  'paris-fr': [281, 78.6, 77.0, 42.0, 14855, 1575],
  'amsterdam-nl': [274, 82.6, 81.5, 74.3, 10874, 2660],
  'barcelona-es': [228, 59.2, 76.7, 48.1, 7587, 1676],
  'vienna-at': [202, 73.9, 81.8, 71.6, 15397, 1280],
  'copenhagen-dk': [200, 85.7, 78.0, 74.3, 11953, 2034],
  'stockholm-se': [172, 78.6, 65.7, 53.5, 11741, 1782],
  'vancouver-ca': [123, 67.5, 71.7, 57.3, 9014, 1889],
  'buenos-aires-ar': [72, 48.8, 68.0, 37.0, 2591, 742],
  'santiago-cl': [63, 41.9, 65.6, 35.8, 2808, 600],
  'auckland-nz': [62, 62.5, 69.0, 49.5, 7875, 1219],
  'bangkok-th': [150, 41.4, 77.3, 61.8, 6345, 667],
  'kuala-lumpur-my': [142, 37.4, 69.5, 40.9, 3968, 616],
  'cape-town-za': [41, 39.6, 68.9, 26.3, 1882, 853],
  'tbilisi-ge': [64, 36.6, 55.3, 74.6, 2371, 677],
  'medellin-co': [39, 34.4, 78.9, 46.4, 2575, 717],
  'dublin-ie': [202, 76.7, 51.3, 45.8, 8496, 2464],
  'hong-kong-hk': [145, 75.2, 66.5, 78.6, 27906, 2225],
  'sydney-au': [100, 75.1, 74.8, 66.0, 11945, 2270],
  'seoul-kr': [160, 68.2, 82.9, 75.3, 28649, 836],
  'shanghai-cn': [238, 38.8, 66.8, 73.5, 13326, 884],
  'los-angeles-us': [183, 81.5, 61.9, 45.9, 7755, 2534],
  'chicago-us': [282, 76.0, 64.9, 34.5, 3889, 2407],
  'san-francisco-us': [150, 97.6, 64.9, 39.4, 10707, 3636],
  'miami-us': [197, 79.5, 63.0, 46.7, 6920, 2821],
  'boston-us': [155, 86.2, 72.0, 60.3, 13210, 3416],
  'sao-paulo-br': [112, 36.8, 60.3, 30.1, 2546, 641],
  'milan-it': [219, 73.1, 70.3, 46.5, 10222, 1603],
  'frankfurt-de': [288, 74.0, 78.2, 55.5, 7884, 1298],
  'brussels-be': [178, 73.5, 73.6, 44.6, 4834, 1247],
  'istanbul-tr': [316, 43.8, 70.1, 52.0, 3164, 1066],
  'mumbai-in': [127, 26.3, 65.5, 55.9, 6675, 657],
  'jakarta-id': [92, 29.8, 57.2, 47.2, 2808, 362],
  'taipei-tw': [102, 54.7, 87.2, 83.5, 14207, 729],
  'tel-aviv-il': [111, 91.4, 73.7, 74.1, 22393, 2206],
  'munich-de': [230, 76.1, 79.5, 78.9, 12545, 1553],
  'prague-cz': [165, 59.6, 74.8, 75.2, 9154, 1132],
  'warsaw-pl': [150, 53.5, 58.4, 74.6, 5752, 1146],
  'athens-gr': [178, 57.9, 58.5, 44.8, 3790, 674],
  'rome-it': [249, 63.4, 65.0, 52.7, 8067, 1194],
  'helsinki-fi': [134, 74.3, 80.3, 74.6, 10211, 1303],
  'oslo-no': [151, 90.2, 77.7, 65.6, 11606, 1995],
  'bogota-co': [101, 32.8, 66.0, 33.3, 2165, 547],
  'panama-city-pa': [94, 47.0, 60.2, 52.9, 3128, 1320],
  'doha-qa': [185, 49.7, 73.6, 84.5, 4475, 2087],
  'bengaluru-in': [110, 21.9, 65.3, 46.0, 1794, 325],
  'ho-chi-minh-city-vn': [88, 28.2, 62.6, 49.6, 4328, 552],
}

/** Climate hazard risk bands per city: [heat, drought, flood, wildfire, water],
 * each a 3-char string of now/2050/2080 bands. L/M/E/H/S → Low…Severe.
 * Sourced from CCKP+IPCC (heat), WRI Aqueduct (water/drought/flood), and
 * sea-level/fire-weather assessments. Banded to avoid false precision. */
const BAND: Record<string, number> = { L: 15, M: 35, E: 55, H: 72, S: 90 }
const bands3 = (s: string): Triple => [BAND[s[0]], BAND[s[1]], BAND[s[2]]]

const CLIMATE_BANDS: Record<string, [string, string, string, string, string]> = {
  'lisbon-pt': ['MEH', 'EHS', 'MEE', 'EHH', 'EHH'],
  'singapore-sg': ['HSS', 'MEE', 'EHH', 'LLL', 'EEH'],
  'toronto-ca': ['LME', 'LLM', 'LMM', 'LLM', 'LLM'],
  'madrid-es': ['EHS', 'HSS', 'LMM', 'EHS', 'HHS'],
  'tokyo-jp': ['EHH', 'MME', 'EHH', 'LLL', 'MME'],
  'dubai-ae': ['SSS', 'SSS', 'MEE', 'LLL', 'SSS'],
  'mexico-city-mx': ['MEE', 'HSS', 'MME', 'LMM', 'HSS'],
  'berlin-de': ['LME', 'MEH', 'LMM', 'LLM', 'MEE'],
  'melbourne-au': ['MEH', 'HHS', 'MEE', 'HHS', 'EHH'],
  'austin-us': ['HHS', 'EHS', 'MEE', 'MEH', 'EHH'],
  'zurich-ch': ['LME', 'LMM', 'LMM', 'LLL', 'LMM'],
  'montevideo-uy': ['MEE', 'MEE', 'MEE', 'LLM', 'MME'],
  'london-uk': ['LME', 'MEH', 'MEE', 'LLL', 'MEE'],
  'new-york-us': ['MEH', 'LME', 'EHS', 'LLL', 'MME'],
  'paris-fr': ['MEH', 'MEH', 'MEE', 'LLM', 'MEE'],
  'amsterdam-nl': ['LME', 'LMM', 'HSS', 'LLL', 'LMM'],
  'barcelona-es': ['MEH', 'HSS', 'MEE', 'EHH', 'HHS'],
  'vienna-at': ['MEH', 'MEE', 'LMM', 'LLM', 'MME'],
  'copenhagen-dk': ['LLM', 'LMM', 'MEH', 'LLL', 'LMM'],
  'stockholm-se': ['LLM', 'LMM', 'LMM', 'LLM', 'LLM'],
  'vancouver-ca': ['LME', 'LME', 'MEE', 'EHH', 'LMM'],
  'buenos-aires-ar': ['MEH', 'MEH', 'EHH', 'LLM', 'MEE'],
  'santiago-cl': ['MEH', 'SSS', 'LMM', 'EHS', 'HSS'],
  'auckland-nz': ['LMM', 'MEE', 'MEE', 'LMM', 'MME'],
  'bangkok-th': ['SSS', 'MEH', 'HSS', 'LLL', 'EHH'],
  'kuala-lumpur-my': ['HSS', 'MME', 'EHH', 'LLL', 'MEE'],
  'cape-town-za': ['MEH', 'SSS', 'MEE', 'EHS', 'HSS'],
  'tbilisi-ge': ['MEH', 'MEE', 'MME', 'MEE', 'MEE'],
  'medellin-co': ['MEE', 'LME', 'MEE', 'LLM', 'LMM'],
  'dublin-ie': ['LLM', 'LMM', 'MEE', 'LLL', 'LMM'],
  'hong-kong-hk': ['HSS', 'MEE', 'EHS', 'LLL', 'EEH'],
  'sydney-au': ['MEH', 'HHS', 'MEE', 'HHS', 'EHH'],
  'seoul-kr': ['EHH', 'MEE', 'EHH', 'LLL', 'MEE'],
  'shanghai-cn': ['EHS', 'MEE', 'HSS', 'LLL', 'EEH'],
  'los-angeles-us': ['MEH', 'HSS', 'MEH', 'HSS', 'HSS'],
  'chicago-us': ['MEH', 'LMM', 'MME', 'LLM', 'LLM'],
  'san-francisco-us': ['LME', 'HHS', 'EHH', 'HHS', 'HHS'],
  'miami-us': ['HSS', 'MEH', 'HSS', 'LLL', 'MEE'],
  'boston-us': ['MEH', 'LME', 'EHH', 'LLL', 'MME'],
  'sao-paulo-br': ['MEH', 'EHH', 'MEE', 'LMM', 'EHH'],
  'milan-it': ['MEH', 'MEH', 'MEE', 'LME', 'MEH'],
  'frankfurt-de': ['LME', 'MEH', 'MEE', 'LLM', 'MEE'],
  'brussels-be': ['LME', 'MEE', 'MEE', 'LLL', 'MME'],
  'istanbul-tr': ['MEH', 'HSS', 'MEE', 'MEH', 'HHS'],
  'mumbai-in': ['HSS', 'EHH', 'HSS', 'LLL', 'EHH'],
  'jakarta-id': ['HSS', 'EHH', 'SSS', 'LLL', 'HHS'],
  'taipei-tw': ['HSS', 'MEE', 'EHS', 'LLL', 'MEE'],
  'tel-aviv-il': ['EHS', 'SSS', 'MEE', 'MEH', 'SSS'],
  'munich-de': ['LME', 'MEE', 'LMM', 'LLM', 'MME'],
  'prague-cz': ['LME', 'MEH', 'MME', 'LLM', 'MEE'],
  'warsaw-pl': ['LME', 'MEH', 'LMM', 'LLM', 'MEE'],
  'athens-gr': ['EHS', 'HSS', 'MEE', 'HSS', 'HSS'],
  'rome-it': ['MEH', 'EHS', 'MEE', 'EHS', 'EHH'],
  'helsinki-fi': ['LLM', 'LLM', 'LMM', 'LLL', 'LLM'],
  'oslo-no': ['LLM', 'LLM', 'LMM', 'LLL', 'LLM'],
  'bogota-co': ['LMM', 'MEE', 'MEE', 'LLL', 'MEE'],
  'panama-city-pa': ['HSS', 'MEH', 'EHH', 'LLL', 'MEE'],
  'doha-qa': ['SSS', 'SSS', 'MEE', 'LLL', 'SSS'],
  'bengaluru-in': ['EHH', 'HSS', 'MEE', 'LMM', 'HSS'],
  'ho-chi-minh-city-vn': ['SSS', 'MEH', 'SSS', 'LLL', 'EHH'],
}

function toCity(r: Row): City {
  const gawc = GAWC_BY_ID[r.id] ?? r.gawc
  const cb = CLIMATE_BANDS[r.id]
  const ht = cb ? bands3(cb[0]) : r.heat
  const dr = cb ? bands3(cb[1]) : r.drought
  const fl = cb ? bands3(cb[2]) : r.flood
  const wf = cb ? bands3(cb[3]) : r.wildfire
  const wt = cb ? bands3(cb[4]) : r.water
  const tax = TAX_BY_CC[r.cc] ?? { income: r.income, capgains: r.capgains, regime: r.regime }
  const stab = WGI_BY_CC[r.cc] ?? r.stability
  const epi = EPI_BY_CC[r.cc]
  const eng =
    epi === 'native'
      ? { value: 100, source: 'bellwether-rubric', conf: 'high' as Confidence, note: 'Majority-English-speaking country.' }
      : typeof epi === 'number'
        ? { value: epiToScore(epi), source: 'ef-epi-2024', conf: 'high' as Confidence, note: undefined as string | undefined }
        : { value: r.english, source: 'bellwether-rubric', conf: 'low' as Confidence, note: 'EF EPI score unavailable; curated estimate.' }

  const d = CITY_DATA[r.id]
  const dest = d?.[0] ?? r.dest
  const col = d?.[1] ?? r.col
  const health = d?.[2] ?? r.health
  const safety = d?.[3] ?? r.safety
  const buy = d?.[4] ?? r.buy
  const rent = d?.[5] ?? r.rent

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
      importance: m(gawc, 'gawc-2024', '2024', 'high'),
      climate: {
        hazards: {
          heat: hazard(HAZARD_SOURCE.heat, ht),
          drought: hazard(HAZARD_SOURCE.drought, dr),
          flood: hazard(HAZARD_SOURCE.flood, fl),
          wildfire: hazard(HAZARD_SOURCE.wildfire, wf),
          waterStress: hazard(HAZARD_SOURCE.waterStress, wt),
        },
      },
      airport: {
        primaryIata: r.iata,
        directDestinations: m(dest, 'flightsfrom-2025', '2025', 'medium'),
      },
      realEstate: {
        buyPricePerSqmUsd: m(buy, 'numbeo-2025', '2026', 'medium'),
        rent1brCenterUsd: m(rent, 'numbeo-2025', '2026', 'medium'),
      },
      taxation: {
        topIncomeRatePct: m(tax.income, 'pwc-tax-2025', '2025', 'high'),
        capitalGainsRatePct: m(tax.capgains, 'pwc-tax-2025', '2025', 'high'),
        regime: m(tax.regime, 'pwc-tax-2025', '2025', 'high'),
        hasExpatRegime: m(r.expatRegime, 'pwc-tax-2025', '2025', 'medium'),
      },
      expat: m(r.expat, 'internations-2024', '2024', 'low', 'Country-level survey; city value estimated.'),
      costOfLiving: m(col, 'numbeo-2025', '2026', 'medium'),
      healthcare: m(health, 'numbeo-2025', '2026', 'medium'),
      safety: {
        crimeSafetyIndex: m(safety, 'numbeo-2025', '2026', 'medium'),
        politicalStability: m(stab, 'worldbank-wgi-2023', '2024', 'high'),
      },
      accessibility: {
        englishProficiency: m(eng.value, eng.source, '2024', eng.conf, eng.note),
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
