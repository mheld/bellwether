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

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
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

  // --- Expansion batch (country-level fields resolved via the verified maps) ---
  {
    id: 'seattle-us', name: 'Seattle', country: 'United States', cc: 'US', region: 'North America',
    lat: 47.61, lng: -122.33, pop: 4020000,
    blurb: 'Pacific Northwest tech hub: water-secure and mild, but heat domes and wildfire smoke now reach it.',
    gawc: 'Beta-', iata: 'SEA', dest: 138, buy: 7828, rent: 2470,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 55, col: 91.3, health: 66.7, safety: 44.8, stability: 0, english: 50, visa: 50,
    heat: [15, 35, 35], drought: [15, 35, 55], flood: [35, 55, 72], wildfire: [55, 55, 72], water: [15, 15, 35],
  },
  {
    id: 'washington-dc-us', name: 'Washington', country: 'United States', cc: 'US', region: 'North America',
    lat: 38.91, lng: -77.04, pop: 6300000,
    blurb: 'US capital region; humid heat and riverine/coastal flooding rising on the Potomac.',
    gawc: 'Alpha-', iata: 'IAD', dest: 159, buy: 8616, rent: 2607,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 55, col: 92.5, health: 71.0, safety: 40.3, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [35, 55, 72], wildfire: [15, 35, 35], water: [15, 35, 35],
  },
  {
    id: 'houston-us', name: 'Houston', country: 'United States', cc: 'US', region: 'North America',
    lat: 29.76, lng: -95.37, pop: 7100000,
    blurb: 'Energy capital with no state income tax, but extreme heat and hurricane flooding (Harvey).',
    gawc: 'Alpha-', iata: 'IAH', dest: 194, buy: 2506, rent: 1664,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 55, col: 65.3, health: 69.0, safety: 37.0, stability: 0, english: 50, visa: 50,
    heat: [55, 72, 90], drought: [55, 72, 72], flood: [55, 72, 90], wildfire: [15, 15, 35], water: [35, 55, 55],
  },
  {
    id: 'atlanta-us', name: 'Atlanta', country: 'United States', cc: 'US', region: 'North America',
    lat: 33.75, lng: -84.39, pop: 6100000,
    blurb: 'Major Southern hub; rising heat and flooding, with an inland buffer from hurricanes.',
    gawc: 'Beta+', iata: 'ATL', dest: 244, buy: 3894, rent: 1976,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 55, col: 76.8, health: 66.0, safety: 36.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [35, 55, 72], wildfire: [15, 35, 35], water: [15, 35, 55],
  },
  {
    id: 'denver-us', name: 'Denver', country: 'United States', cc: 'US', region: 'North America',
    lat: 39.74, lng: -104.99, pop: 2980000,
    blurb: 'High-altitude mile-high city; drought, wildfire and water stress are the climate watch-items.',
    gawc: 'Beta-', iata: 'DEN', dest: 235, buy: 5327, rent: 2108,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 58, col: 75.3, health: 68.1, safety: 52.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 55], drought: [55, 72, 72], flood: [15, 35, 35], wildfire: [55, 72, 72], water: [55, 72, 72],
  },
  {
    id: 'montreal-ca', name: 'Montreal', country: 'Canada', cc: 'CA', region: 'North America',
    lat: 45.50, lng: -73.57, pop: 4300000,
    blurb: 'Affordable, French-speaking Canadian metro; cold, water-secure, low overall hazard.',
    gawc: 'Beta+', iata: 'YUL', dest: 169, buy: 5300, rent: 1211,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 72, col: 60.3, health: 61.9, safety: 67.2, stability: 0, english: 50, visa: 50,
    heat: [15, 35, 35], drought: [35, 55, 55], flood: [35, 35, 55], wildfire: [15, 15, 35], water: [15, 15, 15],
  },
  {
    id: 'porto-pt', name: 'Porto', country: 'Portugal', cc: 'PT', region: 'Southern Europe',
    lat: 41.15, lng: -8.61, pop: 1700000,
    blurb: 'Atlantic-cooled Portuguese city popular with relocators; milder than the dry interior.',
    gawc: 'Gamma+', iata: 'OPO', dest: 133, buy: 4956, rent: 1193,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: true,
    expat: 85, col: 51.2, health: 79.0, safety: 66.0, stability: 0, english: 50, visa: 50,
    heat: [15, 35, 35], drought: [35, 55, 55], flood: [35, 35, 55], wildfire: [35, 55, 55], water: [35, 55, 55],
  },
  {
    id: 'valencia-es', name: 'Valencia', country: 'Spain', cc: 'ES', region: 'Southern Europe',
    lat: 39.47, lng: -0.38, pop: 1600000,
    blurb: 'Top-rated expat city on the Med coast; sunny and affordable, with heat, drought and flood risk.',
    gawc: 'Gamma-', iata: 'VLC', dest: 107, buy: 5342, rent: 1305,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: true,
    expat: 98, col: 52.4, health: 76.8, safety: 62.5, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [35, 55, 55], wildfire: [55, 72, 72], water: [55, 72, 90],
  },
  {
    id: 'malaga-es', name: 'Málaga', country: 'Spain', cc: 'ES', region: 'Southern Europe',
    lat: 36.72, lng: -4.42, pop: 970000,
    blurb: 'Costa del Sol hotspot for remote workers; intense heat, drought and wildfire on a dry coast.',
    gawc: 'Sufficiency', iata: 'AGP', dest: 156, buy: 5078, rent: 1381,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: true,
    expat: 98, col: 52.0, health: 70.8, safety: 69.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 90], flood: [35, 35, 55], wildfire: [55, 72, 72], water: [55, 72, 90],
  },
  {
    id: 'geneva-ch', name: 'Geneva', country: 'Switzerland', cc: 'CH', region: 'Western Europe',
    lat: 46.20, lng: 6.14, pop: 610000,
    blurb: 'Wealthy lakeside hub of diplomacy; cool, water-rich and very low hazard, but very costly.',
    gawc: 'Beta', iata: 'GVA', dest: 146, buy: 22618, rent: 2813,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 35, col: 111.6, health: 69.9, safety: 70.6, stability: 0, english: 50, visa: 50,
    heat: [15, 35, 55], drought: [35, 55, 72], flood: [35, 35, 55], wildfire: [15, 35, 35], water: [15, 35, 35],
  },
  {
    id: 'hamburg-de', name: 'Hamburg', country: 'Germany', cc: 'DE', region: 'Western Europe',
    lat: 53.55, lng: 9.99, pop: 1900000,
    blurb: 'Northern German port; temperate, with coastal and storm-surge flood exposure.',
    gawc: 'Beta+', iata: 'HAM', dest: 124, buy: 8400, rent: 1548,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 63.0, health: 73.0, safety: 57.4, stability: 0, english: 50, visa: 50,
    heat: [15, 35, 35], drought: [35, 35, 55], flood: [35, 55, 55], wildfire: [15, 15, 15], water: [15, 15, 35],
  },
  {
    id: 'edinburgh-uk', name: 'Edinburgh', country: 'United Kingdom', cc: 'GB', region: 'Western Europe',
    lat: 55.95, lng: -3.19, pop: 540000,
    blurb: 'Scottish capital; cool, wet and water-secure with low climate hazard.',
    gawc: 'Gamma-', iata: 'EDI', dest: 168, buy: 7926, rent: 1585,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 68, col: 71.4, health: 75.9, safety: 69.5, stability: 0, english: 50, visa: 50,
    heat: [15, 15, 35], drought: [15, 35, 35], flood: [35, 35, 55], wildfire: [15, 15, 15], water: [15, 15, 15],
  },
  {
    id: 'budapest-hu', name: 'Budapest', country: 'Hungary', cc: 'HU', region: 'Central Europe',
    lat: 47.50, lng: 19.04, pop: 1750000,
    blurb: 'Affordable Danube capital; flat 15% tax, continental climate with rising heat and drought.',
    gawc: 'Beta+', iata: 'BUD', dest: 159, buy: 6500, rent: 800,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 45.0, health: 52.0, safety: 66.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 55], drought: [55, 72, 72], flood: [35, 35, 55], wildfire: [35, 55, 55], water: [35, 55, 55],
  },
  {
    id: 'tallinn-ee', name: 'Tallinn', country: 'Estonia', cc: 'EE', region: 'Northern Europe',
    lat: 59.44, lng: 24.75, pop: 450000,
    blurb: 'Digital-forward Baltic capital (e-residency); cool, low-hazard and very safe.',
    gawc: 'Sufficiency', iata: 'TLL', dest: 52, buy: 4919, rent: 799,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 80, col: 52.7, health: 73.9, safety: 78.4, stability: 0, english: 50, visa: 50,
    heat: [15, 15, 15], drought: [15, 15, 35], flood: [35, 35, 35], wildfire: [15, 15, 15], water: [15, 15, 15],
  },
  {
    id: 'reykjavik-is', name: 'Reykjavik', country: 'Iceland', cc: 'IS', region: 'Northern Europe',
    lat: 64.15, lng: -21.94, pop: 230000,
    blurb: 'Sub-arctic island capital; among the lowest-hazard cities anywhere, geothermal-powered.',
    gawc: 'Sufficiency', iata: 'KEF', dest: 91, buy: 7360, rent: 2300,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 101.5, health: 69.6, safety: 75.5, stability: 0, english: 88, visa: 50,
    heat: [15, 15, 15], drought: [15, 15, 15], flood: [15, 15, 35], wildfire: [15, 15, 15], water: [15, 15, 15],
  },
  {
    id: 'ljubljana-si', name: 'Ljubljana', country: 'Slovenia', cc: 'SI', region: 'Central Europe',
    lat: 46.06, lng: 14.51, pop: 540000,
    blurb: 'Green, compact Alpine-adjacent capital; temperate, water-rich, low hazard.',
    gawc: 'Gamma-', iata: 'LJU', dest: 31, buy: 6428, rent: 1073,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 72, col: 57.4, health: 66.6, safety: 78.2, stability: 0, english: 85, visa: 50,
    heat: [15, 35, 55], drought: [35, 55, 72], flood: [35, 35, 55], wildfire: [35, 55, 55], water: [15, 35, 35],
  },
  {
    id: 'bucharest-ro', name: 'Bucharest', country: 'Romania', cc: 'RO', region: 'Central Europe',
    lat: 44.43, lng: 26.10, pop: 1800000,
    blurb: 'Fast-growing, low-tax Balkan capital; continental heat and drought rising.',
    gawc: 'Beta+', iata: 'OTP', dest: 130, buy: 2400, rent: 616,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 60, col: 39.0, health: 55.0, safety: 72.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [35, 35, 55], wildfire: [35, 55, 55], water: [35, 55, 55],
  },
  {
    id: 'naples-it', name: 'Naples', country: 'Italy', cc: 'IT', region: 'Southern Europe',
    lat: 40.85, lng: 14.27, pop: 3000000,
    blurb: 'Vibrant southern Italian city; Mediterranean heat, drought and wildfire, plus seismic risk.',
    gawc: 'Sufficiency', iata: 'NAP', dest: 141, buy: 4947, rent: 1094,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: true,
    expat: 50, col: 44.0, health: 59.0, safety: 38.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [35, 55, 55], wildfire: [55, 72, 72], water: [55, 72, 72],
  },
  {
    id: 'lyon-fr', name: 'Lyon', country: 'France', cc: 'FR', region: 'Western Europe',
    lat: 45.76, lng: 4.84, pop: 1700000,
    blurb: 'France’s gastronomic second city; rising heat and drought in the Rhône valley.',
    gawc: 'Beta-', iata: 'LYS', dest: 132, buy: 6624, rent: 965,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 62, col: 73.0, health: 76.0, safety: 41.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [35, 35, 55], wildfire: [55, 72, 72], water: [35, 55, 55],
  },
  {
    id: 'beijing-cn', name: 'Beijing', country: 'China', cc: 'CN', region: 'East Asia',
    lat: 39.90, lng: 116.41, pop: 21500000,
    blurb: 'China’s capital; severe heat and acute water stress on the north China plain.',
    gawc: 'Alpha+', iata: 'PEK', dest: 215, buy: 12544, rent: 861,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 48, col: 37.0, health: 70.0, safety: 75.0, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [35, 55, 55], wildfire: [15, 35, 35], water: [55, 72, 90],
  },
  {
    id: 'delhi-in', name: 'Delhi', country: 'India', cc: 'IN', region: 'South Asia',
    lat: 28.61, lng: 77.21, pop: 32900000,
    blurb: 'India’s capital; among the most heat- and water-stressed megacities, with severe air pollution.',
    gawc: 'Alpha-', iata: 'DEL', dest: 159, buy: 2480, rent: 248,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 50, col: 22.2, health: 41.0, safety: 73.8, stability: 0, english: 50, visa: 50,
    heat: [72, 90, 90], drought: [90, 90, 90], flood: [55, 72, 72], wildfire: [15, 15, 35], water: [72, 90, 90],
  },
  {
    id: 'osaka-jp', name: 'Osaka', country: 'Japan', cc: 'JP', region: 'East Asia',
    lat: 34.69, lng: 135.50, pop: 19000000,
    blurb: 'Japan’s second metro; hot humid summers, typhoon flooding, and excellent healthcare.',
    gawc: 'Gamma', iata: 'KIX', dest: 121, buy: 6025, rent: 698,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 43.0, health: 82.2, safety: 67.1, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [55, 72, 72], wildfire: [15, 15, 35], water: [35, 35, 55],
  },
  {
    id: 'chiang-mai-th', name: 'Chiang Mai', country: 'Thailand', cc: 'TH', region: 'Southeast Asia',
    lat: 18.79, lng: 98.99, pop: 1200000,
    blurb: 'Digital-nomad capital of the north; cheap and easy, but severe dry-season drought and smoke.',
    gawc: 'Sufficiency', iata: 'CNX', dest: 31, buy: 1976, rent: 500,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 65, col: 32.6, health: 84.7, safety: 78.0, stability: 0, english: 50, visa: 50,
    heat: [55, 72, 72], drought: [72, 90, 90], flood: [35, 55, 55], wildfire: [35, 55, 72], water: [35, 55, 55],
  },
  {
    id: 'da-nang-vn', name: 'Da Nang', country: 'Vietnam', cc: 'VN', region: 'Southeast Asia',
    lat: 16.05, lng: 108.20, pop: 1230000,
    blurb: 'Coastal Vietnamese nomad favorite; affordable but highly exposed to flooding and typhoons.',
    gawc: 'Sufficiency', iata: 'DAD', dest: 31, buy: 3814, rent: 507,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 75, col: 27.2, health: 82.3, safety: 76.7, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 72], drought: [55, 72, 72], flood: [72, 90, 90], wildfire: [15, 15, 35], water: [35, 35, 55],
  },
  {
    id: 'bali-id', name: 'Bali (Denpasar)', country: 'Indonesia', cc: 'ID', region: 'Southeast Asia',
    lat: -8.65, lng: 115.22, pop: 1100000,
    blurb: 'Tropical island nomad hub; flood and coastal exposure, low wildfire, growing water stress.',
    gawc: 'Sufficiency', iata: 'DPS', dest: 65, buy: 2364, rent: 381,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 72, col: 24.6, health: 69.4, safety: 73.0, stability: 0, english: 50, visa: 50,
    heat: [35, 35, 55], drought: [35, 55, 55], flood: [55, 72, 72], wildfire: [15, 15, 15], water: [35, 55, 55],
  },
  {
    id: 'manila-ph', name: 'Manila', country: 'Philippines', cc: 'PH', region: 'Southeast Asia',
    lat: 14.60, lng: 120.98, pop: 14400000,
    blurb: 'Dense Philippine capital; among the most typhoon- and flood-exposed megacities.',
    gawc: 'Beta', iata: 'MNL', dest: 91, buy: 3514, rent: 510,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 70, col: 34.9, health: 62.5, safety: 35.4, stability: 0, english: 50, visa: 50,
    heat: [55, 72, 72], drought: [72, 90, 90], flood: [72, 90, 90], wildfire: [15, 15, 15], water: [35, 55, 72],
  },
  {
    id: 'busan-kr', name: 'Busan', country: 'South Korea', cc: 'KR', region: 'East Asia',
    lat: 35.18, lng: 129.08, pop: 3400000,
    blurb: 'Korea’s coastal second city; hot humid summers, typhoon flooding, strong healthcare.',
    gawc: 'Sufficiency', iata: 'PUS', dest: 47, buy: 9617, rent: 631,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 55, col: 60.3, health: 92.4, safety: 68.7, stability: 0, english: 50, visa: 50,
    heat: [35, 55, 55], drought: [55, 72, 72], flood: [35, 55, 72], wildfire: [15, 15, 35], water: [15, 35, 35],
  },
  {
    id: 'abu-dhabi-ae', name: 'Abu Dhabi', country: 'United Arab Emirates', cc: 'AE', region: 'Middle East',
    lat: 24.45, lng: 54.38, pop: 1500000,
    blurb: 'Tax-free Gulf capital; extreme heat and water stress, low other hazards.',
    gawc: 'Beta', iata: 'AUH', dest: 93, buy: 5139, rent: 1500,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 85, col: 53.9, health: 67.0, safety: 89.0, stability: 0, english: 50, visa: 50,
    heat: [72, 90, 90], drought: [90, 90, 90], flood: [55, 72, 72], wildfire: [15, 15, 15], water: [90, 90, 90],
  },
  {
    id: 'nairobi-ke', name: 'Nairobi', country: 'Kenya', cc: 'KE', region: 'Africa',
    lat: -1.29, lng: 36.82, pop: 5100000,
    blurb: 'Highland East-African hub; mild temperatures but drought and flood variability, safety concerns.',
    gawc: 'Beta', iata: 'NBO', dest: 66, buy: 1677, rent: 395,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 80, col: 31.4, health: 63.2, safety: 40.8, stability: 0, english: 50, visa: 50,
    heat: [15, 35, 35], drought: [35, 55, 55], flood: [35, 35, 55], wildfire: [15, 15, 35], water: [35, 55, 55],
  },
  {
    id: 'lima-pe', name: 'Lima', country: 'Peru', cc: 'PE', region: 'Latin America',
    lat: -12.05, lng: -77.04, pop: 11000000,
    blurb: 'Desert coastal capital; mild but built on extreme water stress, with coastal flood and seismic risk.',
    gawc: 'Beta+', iata: 'LIM', dest: 69, buy: 2065, rent: 680,
    income: 0, capgains: 0, regime: 'worldwide', expatRegime: false,
    expat: 50, col: 30.0, health: 58.6, safety: 30.0, stability: 0, english: 50, visa: 50,
    heat: [15, 35, 35], drought: [35, 55, 55], flood: [55, 55, 72], wildfire: [15, 15, 15], water: [55, 72, 72],
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
  HU: { income: 15, capgains: 15, regime: 'worldwide' },
  EE: { income: 22, capgains: 22, regime: 'worldwide' },
  IS: { income: 46.3, capgains: 22, regime: 'worldwide' },
  SI: { income: 50, capgains: 25, regime: 'worldwide' },
  RO: { income: 10, capgains: 3, regime: 'worldwide' },
  PH: { income: 35, capgains: 15, regime: 'hybrid' },
  KE: { income: 35, capgains: 15, regime: 'hybrid' },
  PE: { income: 30, capgains: 5, regime: 'worldwide' },
  // tail countries (GaWC roster expansion)
  KH: { income: 20, capgains: 20, regime: 'territorial' },
  TN: { income: 35, capgains: 10, regime: 'worldwide' },
  EC: { income: 37, capgains: 0, regime: 'worldwide' },
  UZ: { income: 12, capgains: 12, regime: 'worldwide' },
  RS: { income: 25, capgains: 15, regime: 'worldwide' },
  LK: { income: 36, capgains: 10, regime: 'worldwide' },
  SV: { income: 30, capgains: 10, regime: 'territorial' },
  GT: { income: 7, capgains: 10, regime: 'territorial' },
  PK: { income: 35, capgains: 15, regime: 'worldwide' },
  CR: { income: 25, capgains: 15, regime: 'territorial' },
  RU: { income: 22, capgains: 13, regime: 'worldwide' },
  PY: { income: 10, capgains: 8, regime: 'territorial' },
  HN: { income: 25, capgains: 10, regime: 'territorial' },
  BO: { income: 13, capgains: 0, regime: 'worldwide' },
  LV: { income: 31, capgains: 20, regime: 'hybrid' },
  MO: { income: 12, capgains: 0, regime: 'territorial' },
  UA: { income: 19.5, capgains: 19.5, regime: 'worldwide' },
  MZ: { income: 32, capgains: 32, regime: 'worldwide' },
  MM: { income: 25, capgains: 10, regime: 'territorial' },
  SN: { income: 43, capgains: 16, regime: 'worldwide' },
  SK: { income: 25, capgains: 19, regime: 'worldwide' },
  CY: { income: 35, capgains: 0, regime: 'hybrid' },
  PR: { income: 33, capgains: 15, regime: 'worldwide' },
  GI: { income: 25, capgains: 0, regime: 'territorial' },
  ZW: { income: 40, capgains: 20, regime: 'worldwide' },
  DZ: { income: 35, capgains: 15, regime: 'worldwide' },
  ZM: { income: 37, capgains: 0, regime: 'worldwide' },
  KZ: { income: 10, capgains: 10, regime: 'worldwide' },
  NG: { income: 24, capgains: 10, regime: 'worldwide' },
  AO: { income: 25, capgains: 10, regime: 'territorial' },
  CI: { income: 32, capgains: 0, regime: 'worldwide' },
  BW: { income: 25, capgains: 0, regime: 'territorial' },
  NA: { income: 37, capgains: 0, regime: 'territorial' },
  AM: { income: 20, capgains: 0, regime: 'worldwide' },
  EG: { income: 27.5, capgains: 0, regime: 'territorial' },
  LA: { income: 25, capgains: 10, regime: 'territorial' },
  MN: { income: 10, capgains: 10, regime: 'worldwide' },
  GA: { income: 35, capgains: 20, regime: 'territorial' },
  MW: { income: 35, capgains: 0, regime: 'worldwide' },
  LU: { income: 46, capgains: 0, regime: 'worldwide' },
  SA: { income: 0, capgains: 0, regime: 'none' },
  BH: { income: 0, capgains: 0, regime: 'none' },
  LB: { income: 25, capgains: 15, regime: 'worldwide' },
  MU: { income: 15, capgains: 0, regime: 'worldwide' },
  BG: { income: 10, capgains: 10, regime: 'worldwide' },
  HR: { income: 30, capgains: 10, regime: 'worldwide' },
  VE: { income: 34, capgains: 34, regime: 'worldwide' },
  MA: { income: 38, capgains: 20, regime: 'worldwide' },
  CM: { income: 38, capgains: 16, regime: 'worldwide' },
}

/** EF EPI 2024 score, or 'native' for majority-English countries (not in EPI). */
const EPI_BY_CC: Record<string, number | 'native'> = {
  PT: 605, SG: 609, CA: 'native', ES: 538, JP: 454, AE: 489, MX: 459, DE: 598,
  AU: 'native', US: 'native', CH: 550, UY: 538, GB: 'native', FR: 524, NL: 636,
  AT: 600, DK: 603, SE: 608, AR: 562, CL: 525, NZ: 'native', TH: 415, MY: 566,
  ZA: 594, GE: 543, CO: 485, IE: 'native', HK: 549, KR: 523, CN: 455, BR: 466,
  IT: 528, BE: 592, TR: 497, IN: 490, ID: 468, IL: 522, CZ: 567, PL: 588,
  GR: 602, FI: 590, NO: 610, PA: 488, QA: 480, VN: 498,
  HU: 585, EE: 578, RO: 593, PH: 569, KE: 581, PE: 519,
  EC: 459, RS: 540, PK: 501, CR: 524, RU: 533, LV: 581, UA: 526, SK: 578, CY: 553,
  PR: 'native', GI: 'native', EG: 472, LU: 600, SA: 450, BH: 480, LB: 480, MU: 530,
  BG: 561, HR: 567, VE: 460, MA: 480, CM: 480,
  // omitted (no authoritative EPI): TW, IS, SI, KH, TN, UZ, LK, SV, GT, PY, HN, BO,
  // MO, MZ, MM, SN, ZW, DZ, ZM, KZ, NG, AO, CI, BW, NA, AM, LA, MN, GA, MW — no authoritative 2024 EPI score; falls back to the seed estimate.
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
  HU: 0.73, EE: 0.85, IS: 1.21, SI: 0.82, RO: 0.5, PH: -0.71, KE: -0.97, PE: -0.72,
  KH: -0.1, TN: -0.55, EC: -0.55, UZ: -0.3, RS: -0.1, LK: -0.45, SV: -0.1, GT: -0.45,
  PK: -1.7, CR: 0.6, RU: -1.05, PY: -0.1, HN: -0.45, BO: -0.3, LV: 0.35, MO: 0.95,
  UA: -1.85, MZ: -0.95, MM: -1.9, SN: -0.3, SK: 0.65, CY: 0.3, PR: 0.4, GI: 0.95,
  ZW: -0.55, DZ: -0.85, ZM: 0.1, KZ: -0.05, NG: -1.85, AO: -0.4, CI: -0.7, BW: 0.95,
  NA: 0.75, AM: -0.65, EG: -1.1, LA: -0.2, MN: 0.55, GA: -0.1, MW: -0.05,
  LU: 1.3, SA: -0.3, BH: -0.4, LB: -1.2, MU: 0.9, BG: 0.4, HR: 0.6, VE: -1.3, MA: -0.2, CM: -0.9,
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

/** Expat-friendliness 0-100 (InterNations Expat City Ranking 2024 where covered). */
const EXPAT_BY_ID: Record<string, number> = {
  'lisbon-pt': 62, 'singapore-sg': 60, 'toronto-ca': 70, 'madrid-es': 78, 'tokyo-jp': 48,
  'dubai-ae': 65, 'mexico-city-mx': 76, 'berlin-de': 42, 'melbourne-au': 72, 'austin-us': 74,
  'zurich-ch': 40, 'montevideo-uy': 70, 'london-uk': 55, 'new-york-us': 58, 'paris-fr': 45,
  'amsterdam-nl': 52, 'barcelona-es': 70, 'vienna-at': 50, 'copenhagen-dk': 44, 'stockholm-se': 38,
  'vancouver-ca': 68, 'buenos-aires-ar': 72, 'santiago-cl': 58, 'auckland-nz': 66, 'bangkok-th': 74,
  'kuala-lumpur-my': 80, 'cape-town-za': 68, 'tbilisi-ge': 70, 'medellin-co': 78, 'dublin-ie': 56,
  'hong-kong-hk': 50, 'sydney-au': 70, 'seoul-kr': 50, 'shanghai-cn': 56, 'los-angeles-us': 64,
  'chicago-us': 66, 'san-francisco-us': 62, 'miami-us': 70, 'boston-us': 66, 'sao-paulo-br': 70,
  'milan-it': 54, 'frankfurt-de': 46, 'brussels-be': 52, 'istanbul-tr': 58, 'mumbai-in': 60,
  'jakarta-id': 64, 'taipei-tw': 78, 'tel-aviv-il': 50, 'munich-de': 48, 'prague-cz': 54,
  'warsaw-pl': 62, 'athens-gr': 60, 'rome-it': 52, 'helsinki-fi': 46, 'oslo-no': 44,
  'bogota-co': 72, 'panama-city-pa': 76, 'doha-qa': 58, 'bengaluru-in': 62, 'ho-chi-minh-city-vn': 70,
}
/** Cities estimated from country reputation (not in the InterNations city ranking). */
const EXPAT_EST = new Set<string>([
  'austin-us', 'montevideo-uy', 'new-york-us', 'vancouver-ca', 'auckland-nz', 'tbilisi-ge',
  'medellin-co', 'los-angeles-us', 'chicago-us', 'san-francisco-us', 'miami-us', 'boston-us',
  'mumbai-in', 'tel-aviv-il', 'oslo-no', 'bengaluru-in', 'ho-chi-minh-city-vn',
  'seattle-us', 'washington-dc-us', 'houston-us', 'atlanta-us', 'denver-us', 'montreal-ca',
  'porto-pt', 'hamburg-de', 'edinburgh-uk', 'budapest-hu', 'tallinn-ee', 'reykjavik-is',
  'ljubljana-si', 'bucharest-ro', 'naples-it', 'lyon-fr', 'beijing-cn', 'delhi-in', 'osaka-jp',
  'chiang-mai-th', 'da-nang-vn', 'bali-id', 'manila-ph', 'busan-kr', 'abu-dhabi-ae', 'lima-pe',
])

/** Visa/residency ease 0-100 rubric (digital-nomad, retirement, investor & PR routes). */
const VISA_BY_CC: Record<string, number> = {
  PT: 92, SG: 28, CA: 58, ES: 84, JP: 45, AE: 62, MX: 85, DE: 60, AU: 48, US: 18, CH: 22,
  UY: 80, GB: 38, FR: 66, NL: 55, AT: 48, DK: 40, SE: 45, AR: 78, CL: 70, NZ: 52, TH: 72,
  MY: 68, ZA: 60, GE: 95, CO: 86, IE: 50, HK: 42, KR: 50, CN: 20, BR: 72, IT: 70, BE: 52,
  TR: 74, IN: 40, ID: 66, TW: 58, IL: 45, CZ: 60, PL: 58, GR: 82, FI: 50, NO: 42, PA: 88,
  QA: 35, VN: 50,
  HU: 62, EE: 75, IS: 45, SI: 62, RO: 72, PH: 78, KE: 58, PE: 62,
  KH: 75, TN: 45, EC: 70, UZ: 40, RS: 55, LK: 50, SV: 60, GT: 50, PK: 30, CR: 80,
  RU: 20, PY: 75, HN: 50, BO: 45, LV: 70, MO: 40, UA: 25, MZ: 35, MM: 25, SN: 40,
  SK: 65, CY: 85, PR: 75, GI: 70, ZW: 30, DZ: 30, ZM: 40, KZ: 45, NG: 30, AO: 30,
  CI: 40, BW: 55, NA: 55, AM: 60, EG: 45, LA: 35, MN: 45, GA: 30, MW: 35,
  LU: 50, SA: 40, BH: 55, LB: 50, MU: 75, BG: 60, HR: 68, VE: 40, MA: 50, CM: 40,
}

/* ---- Country baselines for the GaWC tail (capital-city proxy, low confidence) ----
 * [costOfLiving, healthcare, safety, buyPerSqmUSD, rent1brUSD, expat] */
const COUNTRY_BASE: Record<string, [number, number, number, number, number, number]> = {
  PT: [51, 71, 70, 4500, 1100, 80], SG: [81, 71, 76, 18000, 2700, 82], CA: [67, 71, 56, 6500, 1700, 85],
  ES: [52, 79, 67, 4200, 1100, 78], JP: [55, 81, 77, 9000, 950, 62], AE: [56, 67, 85, 4200, 1900, 75],
  MX: [39, 67, 45, 2400, 700, 68], DE: [62, 73, 65, 7500, 1300, 76], AU: [73, 77, 56, 9500, 2000, 84],
  US: [75, 67, 53, 6000, 2200, 80], CH: [114, 73, 79, 16000, 2400, 72], UY: [50, 63, 56, 2800, 750, 70],
  GB: [64, 74, 56, 14000, 2400, 80], FR: [62, 80, 56, 13000, 1500, 70], NL: [67, 75, 70, 9000, 2000, 82],
  AT: [62, 78, 75, 8000, 1200, 74], DK: [75, 80, 75, 8500, 1600, 78], SE: [63, 69, 56, 7500, 1400, 79],
  AR: [36, 70, 39, 2400, 550, 64], CL: [41, 67, 49, 2700, 600, 66], NZ: [70, 74, 60, 7500, 1700, 84],
  TH: [38, 78, 60, 3500, 700, 72], MY: [35, 67, 56, 2600, 650, 73], ZA: [38, 64, 27, 1500, 700, 62],
  GE: [33, 60, 73, 1500, 650, 68], CO: [33, 68, 41, 1600, 500, 65], IE: [73, 58, 58, 8500, 2400, 80],
  HK: [78, 67, 78, 28000, 2700, 74], KR: [60, 80, 72, 14000, 900, 64], CN: [42, 64, 70, 9000, 900, 55],
  BR: [36, 56, 32, 1900, 500, 64], IT: [60, 67, 56, 6500, 1100, 70], BE: [64, 73, 53, 5000, 1100, 75],
  TR: [38, 70, 60, 2200, 700, 60], IN: [26, 67, 56, 2200, 400, 58], ID: [36, 62, 51, 2800, 550, 66],
  TW: [50, 86, 84, 11000, 750, 70], IL: [73, 68, 56, 11000, 1800, 64], CZ: [47, 75, 74, 5500, 1100, 73],
  PL: [42, 63, 71, 4500, 900, 72], GR: [49, 56, 60, 3200, 700, 70], FI: [67, 75, 73, 6000, 1100, 76],
  NO: [84, 76, 67, 9000, 1700, 76], PA: [47, 62, 47, 2200, 1000, 70], QA: [56, 73, 89, 3200, 1900, 70],
  VN: [35, 62, 56, 3500, 600, 66], HU: [42, 53, 67, 3500, 750, 70], EE: [51, 70, 76, 3200, 750, 78],
  IS: [84, 67, 76, 6200, 1600, 80], SI: [50, 64, 76, 4200, 750, 74], RO: [36, 56, 73, 2400, 550, 68],
  PH: [33, 65, 50, 3300, 450, 66], KE: [33, 56, 38, 1300, 550, 55], PE: [33, 60, 36, 1600, 450, 58],
  KH: [38, 50, 56, 2900, 500, 60], TN: [27, 53, 50, 1100, 300, 55], EC: [36, 64, 43, 1300, 450, 62],
  UZ: [28, 56, 70, 900, 350, 50], RS: [38, 56, 73, 2700, 500, 65], LK: [32, 67, 56, 1200, 350, 58],
  SV: [41, 56, 50, 1400, 450, 52], GT: [39, 58, 40, 1300, 450, 54], PK: [23, 56, 44, 900, 250, 45],
  CR: [49, 67, 50, 1900, 750, 70], RU: [38, 58, 60, 3300, 700, 45], PY: [32, 60, 50, 1100, 350, 55],
  HN: [41, 53, 38, 1200, 400, 48], BO: [31, 56, 45, 1000, 350, 50], LV: [47, 62, 70, 2300, 600, 72],
  MO: [64, 65, 80, 14000, 1500, 60], UA: [32, 53, 56, 1700, 450, 48], MZ: [38, 40, 38, 1500, 700, 45],
  MM: [33, 45, 50, 1600, 400, 42], SN: [38, 50, 50, 1700, 600, 50], SK: [45, 63, 73, 3000, 650, 70],
  CY: [56, 60, 73, 3000, 900, 75], PR: [70, 60, 45, 2400, 1100, 72], GI: [75, 60, 75, 6500, 1400, 70],
  ZW: [38, 42, 45, 1200, 600, 40], DZ: [28, 53, 52, 1400, 300, 42], ZM: [33, 45, 48, 1100, 550, 47],
  KZ: [33, 60, 60, 1500, 450, 55], NG: [39, 47, 33, 2200, 700, 45], AO: [43, 42, 38, 2500, 1200, 42],
  CI: [42, 48, 48, 1800, 600, 50], BW: [41, 52, 56, 1100, 550, 58], NA: [42, 53, 42, 1200, 600, 55],
  AM: [40, 64, 78, 2200, 500, 60], EG: [27, 53, 53, 1300, 300, 55], LA: [39, 45, 60, 1700, 400, 50],
  MN: [38, 56, 56, 1400, 450, 48], GA: [50, 45, 45, 2200, 800, 45], MW: [36, 42, 50, 1000, 450, 45],
  LU: [95, 75, 75, 12000, 1800, 70], SA: [55, 60, 80, 3500, 1100, 50], BH: [60, 65, 75, 2500, 900, 60],
  LB: [60, 60, 40, 2500, 700, 50], MU: [50, 60, 65, 2500, 700, 70], BG: [40, 56, 73, 2200, 600, 65],
  HR: [48, 60, 76, 3000, 700, 70], VE: [35, 45, 25, 1200, 400, 35], MA: [35, 53, 55, 1500, 450, 55],
  CM: [38, 45, 45, 1500, 500, 45],
}

/** Country climate-hazard band profile: [heat, drought, flood, wildfire, water]. */
const COUNTRY_CLIMATE: Record<string, [string, string, string, string, string]> = {
  PT: ['MEE', 'MEE', 'LMM', 'MEE', 'MEE'], SG: ['HHH', 'LLM', 'HHS', 'LLL', 'LMM'],
  CA: ['LLM', 'LMM', 'LMM', 'MEE', 'LLL'], ES: ['EHH', 'EHS', 'LMM', 'EHH', 'EHS'],
  JP: ['MEE', 'LLM', 'EHH', 'LLM', 'LLL'], AE: ['SSS', 'SSS', 'MEE', 'LLL', 'SSS'],
  MX: ['EHH', 'EHH', 'MEE', 'MEE', 'EHH'], DE: ['LMM', 'LMM', 'MEE', 'LLL', 'LLM'],
  AU: ['EHH', 'EHS', 'MEE', 'EHS', 'EHH'], US: ['MEE', 'MEE', 'MEE', 'MEE', 'MEE'],
  CH: ['LMM', 'LMM', 'MEE', 'LLL', 'LLL'], UY: ['MEE', 'LMM', 'MEE', 'LMM', 'LMM'],
  GB: ['LLM', 'LLM', 'MEE', 'LLL', 'LLL'], FR: ['MEE', 'MEE', 'MEE', 'LMM', 'LMM'],
  NL: ['LMM', 'LMM', 'HHS', 'LLL', 'LMM'], AT: ['LMM', 'LMM', 'MEE', 'LLL', 'LLL'],
  DK: ['LLM', 'LLM', 'MEE', 'LLL', 'LLL'], SE: ['LLL', 'LLM', 'LMM', 'LLM', 'LLL'],
  AR: ['MEE', 'MEE', 'MEE', 'MEE', 'MEE'], CL: ['MEE', 'MEE', 'LMM', 'EHH', 'EHH'],
  NZ: ['LMM', 'LMM', 'MEE', 'LMM', 'LLL'], TH: ['HHS', 'LMM', 'HHS', 'LLL', 'MEE'],
  MY: ['HHH', 'LLM', 'HHH', 'LLL', 'LMM'], ZA: ['MEE', 'EHH', 'LMM', 'MEE', 'EHH'],
  GE: ['LMM', 'LMM', 'MEE', 'LLL', 'LMM'], CO: ['HHH', 'LMM', 'EHH', 'LLL', 'MEE'],
  IE: ['LLL', 'LLM', 'MEE', 'LLL', 'LLL'], HK: ['HHH', 'LMM', 'HHS', 'LLL', 'MEE'],
  KR: ['MEE', 'LLM', 'EHH', 'LLM', 'LMM'], CN: ['MEE', 'MEE', 'EHH', 'LLM', 'EHH'],
  BR: ['HHH', 'MEE', 'MEE', 'MEE', 'MEE'], IT: ['MEE', 'MEE', 'MEE', 'EHH', 'MEE'],
  BE: ['LMM', 'LMM', 'MEE', 'LLL', 'LLM'], TR: ['EHH', 'EHH', 'MEE', 'EHH', 'EHH'],
  IN: ['HHS', 'EHH', 'EHH', 'LLL', 'EHS'], ID: ['HHH', 'LMM', 'HHS', 'MEE', 'LMM'],
  TW: ['HHH', 'LMM', 'HHS', 'LLL', 'MEE'], IL: ['EHH', 'EHS', 'LMM', 'EHH', 'EHS'],
  CZ: ['LMM', 'LMM', 'MEE', 'LLL', 'LLM'], PL: ['LMM', 'LMM', 'MEE', 'LLM', 'LLM'],
  GR: ['EHH', 'EHH', 'LMM', 'EHH', 'EHH'], FI: ['LLL', 'LLL', 'LMM', 'LLL', 'LLL'],
  NO: ['LLL', 'LLL', 'LMM', 'LLL', 'LLL'], PA: ['HHH', 'LMM', 'EHH', 'LLL', 'LMM'],
  QA: ['SSS', 'SSS', 'MEE', 'LLL', 'SSS'], VN: ['HHS', 'LMM', 'HHS', 'LLL', 'MEE'],
  HU: ['MEE', 'EHH', 'MEE', 'LLM', 'MEE'], EE: ['LLL', 'LLM', 'LMM', 'LLL', 'LLL'],
  IS: ['LLL', 'LLL', 'LLM', 'LLL', 'LLL'], SI: ['LMM', 'LMM', 'MEE', 'LMM', 'LLL'],
  RO: ['MEE', 'EHH', 'MEE', 'LMM', 'MEE'], PH: ['HHH', 'LMM', 'HHS', 'LLL', 'MEE'],
  KE: ['HHH', 'EHH', 'MEE', 'MEE', 'EHH'], PE: ['MEE', 'EHH', 'LMM', 'LLL', 'EHH'],
  KH: ['HHS', 'MEE', 'HHS', 'LLL', 'EHH'], TN: ['EHH', 'EHS', 'LMM', 'EHH', 'EHS'],
  EC: ['HHH', 'LMM', 'EHH', 'LLL', 'MEE'], UZ: ['EHH', 'SSS', 'LLM', 'LMM', 'SSS'],
  RS: ['MEE', 'EHH', 'MEE', 'LMM', 'MEE'], LK: ['HHH', 'MEE', 'EHH', 'LLL', 'MEE'],
  SV: ['HHH', 'EHH', 'EHH', 'LMM', 'EHH'], GT: ['HHH', 'EHH', 'EHH', 'MEE', 'EHH'],
  PK: ['HHS', 'SSS', 'EHH', 'LLL', 'SSS'], CR: ['HHH', 'LMM', 'EHH', 'LLL', 'LMM'],
  RU: ['LLM', 'LLM', 'MEE', 'LMM', 'LLL'], PY: ['HHH', 'EHH', 'MEE', 'MEE', 'EHH'],
  HN: ['HHH', 'EHH', 'EHH', 'MEE', 'EHH'], BO: ['MEE', 'EHH', 'LMM', 'MEE', 'EHH'],
  LV: ['LLL', 'LLM', 'LMM', 'LLL', 'LLL'], MO: ['HHH', 'LMM', 'HHS', 'LLL', 'MEE'],
  UA: ['MEE', 'EHH', 'MEE', 'LMM', 'MEE'], MZ: ['HHH', 'EHH', 'HHS', 'MEE', 'EHH'],
  MM: ['HHS', 'MEE', 'HHS', 'LLL', 'EHH'], SN: ['HHS', 'SSS', 'EHH', 'LLL', 'SSS'],
  SK: ['LMM', 'LMM', 'MEE', 'LLL', 'LLM'], CY: ['EHH', 'EHS', 'LMM', 'EHH', 'EHS'],
  PR: ['HHH', 'MEE', 'EHH', 'LLL', 'MEE'], GI: ['EHH', 'EHS', 'LMM', 'MEE', 'EHS'],
  ZW: ['HHH', 'EHH', 'LMM', 'MEE', 'EHH'], DZ: ['EHS', 'SSS', 'LMM', 'MEE', 'SSS'],
  ZM: ['HHH', 'EHH', 'MEE', 'MEE', 'EHH'], KZ: ['EHH', 'EHH', 'LLM', 'MEE', 'EHH'],
  NG: ['HHS', 'EHH', 'EHH', 'LLL', 'EHH'], AO: ['HHH', 'EHH', 'MEE', 'MEE', 'EHH'],
  CI: ['HHH', 'EHH', 'EHH', 'LLL', 'EHH'], BW: ['EHS', 'SSS', 'LMM', 'MEE', 'SSS'],
  NA: ['EHS', 'SSS', 'LLM', 'LLL', 'SSS'], AM: ['EHH', 'EHH', 'LLM', 'MEE', 'EHH'],
  EG: ['EHS', 'SSS', 'EHH', 'LLL', 'SSS'], LA: ['HHS', 'MEE', 'HHS', 'LLL', 'EHH'],
  MN: ['LMM', 'EHH', 'LLM', 'MEE', 'EHH'], GA: ['HHH', 'LLM', 'EHH', 'LLL', 'LMM'],
  MW: ['HHH', 'EHH', 'EHH', 'MEE', 'EHH'], LU: ['LMM', 'LMM', 'MEE', 'LLL', 'LLM'],
  SA: ['SSS', 'SSS', 'MEE', 'LLL', 'SSS'], BH: ['SSS', 'SSS', 'MEE', 'LLL', 'SSS'],
  LB: ['EHH', 'EHS', 'LMM', 'EHH', 'EHS'], MU: ['HHH', 'MEE', 'EHH', 'LLL', 'MEE'],
  BG: ['MEE', 'EHH', 'MME', 'MEE', 'MEE'], HR: ['MEH', 'EHH', 'MEE', 'EHH', 'MEE'],
  VE: ['HHH', 'MEE', 'EHH', 'LMM', 'MEE'], MA: ['EHH', 'EHS', 'LMM', 'MEE', 'EHS'],
  CM: ['HHH', 'MEE', 'EHH', 'LLL', 'MEE'],
}

/** ISO-2 → display region (free text; drives the filter chips). */
const CC_REGION: Record<string, string> = {
  PT: 'Southern Europe', ES: 'Southern Europe', IT: 'Southern Europe', GR: 'Southern Europe',
  GB: 'Western Europe', FR: 'Western Europe', NL: 'Western Europe', BE: 'Western Europe',
  DE: 'Western Europe', AT: 'Western Europe', CH: 'Western Europe', IE: 'Western Europe', LU: 'Western Europe',
  DK: 'Northern Europe', SE: 'Northern Europe', NO: 'Northern Europe', FI: 'Northern Europe',
  IS: 'Northern Europe', EE: 'Northern Europe', LV: 'Northern Europe',
  PL: 'Central Europe', CZ: 'Central Europe', HU: 'Central Europe', RO: 'Central Europe',
  SI: 'Central Europe', SK: 'Central Europe', RS: 'Central Europe', HR: 'Central Europe', BG: 'Central Europe',
  UA: 'Eastern Europe', RU: 'Eastern Europe',
  US: 'North America', CA: 'North America',
  MX: 'Latin America', BR: 'Latin America', AR: 'Latin America', CL: 'Latin America', CO: 'Latin America',
  UY: 'Latin America', PE: 'Latin America', EC: 'Latin America', SV: 'Latin America', GT: 'Latin America',
  HN: 'Latin America', BO: 'Latin America', PY: 'Latin America', PA: 'Latin America', CR: 'Latin America',
  VE: 'Latin America', PR: 'Latin America',
  JP: 'East Asia', KR: 'East Asia', CN: 'East Asia', TW: 'East Asia', MO: 'East Asia', HK: 'East Asia',
  TH: 'Southeast Asia', MY: 'Southeast Asia', ID: 'Southeast Asia', VN: 'Southeast Asia',
  PH: 'Southeast Asia', KH: 'Southeast Asia', MM: 'Southeast Asia', LA: 'Southeast Asia', SG: 'Southeast Asia',
  IN: 'South Asia', PK: 'South Asia', LK: 'South Asia',
  AE: 'Middle East', QA: 'Middle East', SA: 'Middle East', BH: 'Middle East', IL: 'Middle East', LB: 'Middle East',
  TR: 'Western Asia', GE: 'Western Asia', AM: 'Western Asia', CY: 'Western Asia', GI: 'Western Asia',
  KZ: 'Central Asia', UZ: 'Central Asia', MN: 'Central Asia',
  ZA: 'Africa', KE: 'Africa', NG: 'Africa', EG: 'Africa', MA: 'Africa', TN: 'Africa', DZ: 'Africa',
  ZW: 'Africa', ZM: 'Africa', AO: 'Africa', CI: 'Africa', BW: 'Africa', NA: 'Africa', SN: 'Africa',
  GA: 'Africa', MW: 'Africa', MZ: 'Africa', MU: 'Africa', CM: 'Africa',
  AU: 'Oceania', NZ: 'Oceania',
}

/** ISO-2 → country display name. */
const CC_NAME: Record<string, string> = {
  PT: 'Portugal', ES: 'Spain', IT: 'Italy', GR: 'Greece', GB: 'United Kingdom', FR: 'France',
  NL: 'Netherlands', BE: 'Belgium', DE: 'Germany', AT: 'Austria', CH: 'Switzerland', IE: 'Ireland',
  LU: 'Luxembourg', DK: 'Denmark', SE: 'Sweden', NO: 'Norway', FI: 'Finland', IS: 'Iceland',
  EE: 'Estonia', LV: 'Latvia', PL: 'Poland', CZ: 'Czechia', HU: 'Hungary', RO: 'Romania',
  SI: 'Slovenia', SK: 'Slovakia', RS: 'Serbia', HR: 'Croatia', BG: 'Bulgaria', UA: 'Ukraine',
  RU: 'Russia', US: 'United States', CA: 'Canada', MX: 'Mexico', BR: 'Brazil', AR: 'Argentina',
  CL: 'Chile', CO: 'Colombia', UY: 'Uruguay', PE: 'Peru', EC: 'Ecuador', SV: 'El Salvador',
  GT: 'Guatemala', HN: 'Honduras', BO: 'Bolivia', PY: 'Paraguay', PA: 'Panama', CR: 'Costa Rica',
  VE: 'Venezuela', PR: 'Puerto Rico', JP: 'Japan', KR: 'South Korea', CN: 'China', TW: 'Taiwan',
  MO: 'Macau', HK: 'Hong Kong', TH: 'Thailand', MY: 'Malaysia', ID: 'Indonesia', VN: 'Vietnam',
  PH: 'Philippines', KH: 'Cambodia', MM: 'Myanmar', LA: 'Laos', SG: 'Singapore', IN: 'India',
  PK: 'Pakistan', LK: 'Sri Lanka', AE: 'United Arab Emirates', QA: 'Qatar', SA: 'Saudi Arabia',
  BH: 'Bahrain', IL: 'Israel', LB: 'Lebanon', TR: 'Türkiye', GE: 'Georgia', AM: 'Armenia',
  CY: 'Cyprus', GI: 'Gibraltar', KZ: 'Kazakhstan', UZ: 'Uzbekistan', MN: 'Mongolia',
  ZA: 'South Africa', KE: 'Kenya', NG: 'Nigeria', EG: 'Egypt', MA: 'Morocco', TN: 'Tunisia',
  DZ: 'Algeria', ZW: 'Zimbabwe', ZM: 'Zambia', AO: 'Angola', CI: 'Côte d’Ivoire', BW: 'Botswana',
  NA: 'Namibia', SN: 'Senegal', GA: 'Gabon', MW: 'Malawi', MZ: 'Mozambique', MU: 'Mauritius',
  CM: 'Cameroon', AU: 'Australia', NZ: 'New Zealand',
}

/** GaWC class → estimated nonstop destination count (tier proxy for the tail). */
const TIER_DEST: Record<string, number> = {
  'Alpha++': 280, 'Alpha+': 230, Alpha: 180, 'Alpha-': 150, 'Beta+': 120, Beta: 100, 'Beta-': 80,
  'Gamma+': 65, Gamma: 50, 'Gamma-': 40, 'High sufficiency': 30, Sufficiency: 22,
}

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function toCity(r: Row): City {
  const gawc = GAWC_BY_ID[r.id] ?? r.gawc
  const expatVal = EXPAT_BY_ID[r.id] ?? r.expat
  const expatEst = EXPAT_EST.has(r.id)
  const visaVal = VISA_BY_CC[r.cc] ?? r.visa
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
      expat: m(
        expatVal,
        'internations-2024',
        '2024',
        expatEst ? 'low' : 'medium',
        expatEst ? 'Estimated from country reputation; city not in InterNations ranking.' : undefined,
      ),
      costOfLiving: m(col, 'numbeo-2025', '2026', 'medium'),
      healthcare: m(health, 'numbeo-2025', '2026', 'medium'),
      safety: {
        crimeSafetyIndex: m(safety, 'numbeo-2025', '2026', 'medium'),
        politicalStability: m(stab, 'worldbank-wgi-2023', '2024', 'high'),
      },
      accessibility: {
        englishProficiency: m(eng.value, eng.source, '2024', eng.conf, eng.note),
        visaEaseIndex: m(visaVal, 'bellwether-rubric', '2026', 'medium', 'Curated residency-pathway rubric (nomad/retirement/investor & PR routes).'),
      },
    },
  }
}

/* ---- Tail cities (GaWC roster, composed from country-level proxies) ------- */

interface RosterEntry {
  n: string
  cc: string
  cls: GaWCClass
  lat: number
  lng: number
  pop: number
}

const TIER_RANK: GaWCClass[] = [
  'Alpha++', 'Alpha+', 'Alpha', 'Alpha-', 'Beta+', 'Beta', 'Beta-',
  'Gamma+', 'Gamma', 'Gamma-', 'High sufficiency', 'Sufficiency',
]
const rank = (c: GaWCClass) => {
  const i = TIER_RANK.indexOf(c)
  return i === -1 ? TIER_RANK.length : i
}

/** Compose a low-confidence City for a tail GaWC city from its country baseline. */
function buildTailCity(e: RosterEntry): City | null {
  const cc = e.cc
  const base = COUNTRY_BASE[cc]
  const climate = COUNTRY_CLIMATE[cc]
  const tax = TAX_BY_CC[cc]
  if (!base || !climate || !tax) return null // unknown country → skip

  const [col, health, safety, buy, rent, expat] = base
  const epi = EPI_BY_CC[cc]
  const english =
    epi === 'native' ? 100 : typeof epi === 'number' ? epiToScore(epi) : 40
  const englishConf: Confidence = typeof epi === 'number' || epi === 'native' ? 'high' : 'low'
  const wgi = WGI_BY_CC[cc] ?? 0
  const visa = VISA_BY_CC[cc] ?? 50
  const dest = TIER_DEST[e.cls] ?? 25
  const lo: Confidence = 'low'

  const city: City = {
    id: `${slug(e.n)}-${cc.toLowerCase()}`,
    name: e.n,
    country: CC_NAME[cc] ?? cc,
    countryCode: cc,
    region: CC_REGION[cc] ?? 'Other',
    coords: { lat: e.lat, lng: e.lng },
    population: m(e.pop, 'un-wup-2018', '2020', 'low'),
    factors: {
      importance: m(e.cls, 'gawc-2024', '2024', 'high'),
      climate: {
        hazards: {
          heat: hazardLo(HAZARD_SOURCE.heat, bands3(climate[0])),
          drought: hazardLo(HAZARD_SOURCE.drought, bands3(climate[1])),
          flood: hazardLo(HAZARD_SOURCE.flood, bands3(climate[2])),
          wildfire: hazardLo(HAZARD_SOURCE.wildfire, bands3(climate[3])),
          waterStress: hazardLo(HAZARD_SOURCE.waterStress, bands3(climate[4])),
        },
      },
      airport: {
        primaryIata: slug(e.n).slice(0, 3).toUpperCase().padEnd(3, 'X'),
        directDestinations: m(dest, 'bellwether-rubric', '2025', lo, 'Estimated from city tier.'),
      },
      realEstate: {
        buyPricePerSqmUsd: m(buy, 'numbeo-2025', '2026', lo, 'Country-level proxy.'),
        rent1brCenterUsd: m(rent, 'numbeo-2025', '2026', lo, 'Country-level proxy.'),
      },
      taxation: {
        topIncomeRatePct: m(tax.income, 'pwc-tax-2025', '2025', 'high'),
        capitalGainsRatePct: m(tax.capgains, 'pwc-tax-2025', '2025', 'high'),
        regime: m(tax.regime, 'pwc-tax-2025', '2025', 'high'),
        hasExpatRegime: m(false, 'pwc-tax-2025', '2025', 'low'),
      },
      expat: m(expat, 'internations-2024', '2024', lo, 'Country-level reputation estimate.'),
      costOfLiving: m(col, 'numbeo-2025', '2026', lo, 'Country-level proxy.'),
      healthcare: m(health, 'numbeo-2025', '2026', lo, 'Country-level proxy.'),
      safety: {
        crimeSafetyIndex: m(safety, 'numbeo-2025', '2026', lo, 'Country-level proxy.'),
        politicalStability: m(wgi, 'worldbank-wgi-2023', '2024', 'high'),
      },
      accessibility: {
        englishProficiency: m(english, typeof epi === 'number' ? 'ef-epi-2024' : 'bellwether-rubric', '2024', englishConf),
        visaEaseIndex: m(visa, 'bellwether-rubric', '2026', 'medium', 'Country-level residency rubric.'),
      },
    },
  }
  return city
}

/** Low-confidence hazard projection (country-proxy climate). */
function hazardLo(src: string, [now, y2050, y2080]: Triple) {
  return {
    now: m(now, src, '2024', 'low' as Confidence),
    y2050: m(y2050, src, '2050', 'low' as Confidence),
    y2080: m(y2080, src, '2080', 'low' as Confidence),
    scenario: 'SSP2-4.5' as const,
  }
}

/* ---- Emit ---------------------------------------------------------------- */

mkdirSync(CITIES_DIR, { recursive: true })
const seen = new Set<string>()
let ok = 0

function emit(city: City) {
  const parsed = CitySchema.safeParse(city)
  if (!parsed.success) {
    console.error(`✗ ${city.id} invalid:`)
    console.error(parsed.error.issues.map((i) => `    ${i.path.join('.')}: ${i.message}`).join('\n'))
    process.exit(1)
  }
  writeFileSync(join(CITIES_DIR, `${city.id}.json`), JSON.stringify(parsed.data, null, 2) + '\n')
  seen.add(city.id)
  ok++
}

// 1) Hand-curated, higher-confidence cities.
for (const row of ROWS) emit(toCity(row))

// 2) GaWC tail, deduped against the curated set and itself (best tier wins).
const ROSTER_FILE = join(HERE, '..', 'data', 'roster.json')
const roster = JSON.parse(readFileSync(ROSTER_FILE, 'utf8')) as RosterEntry[]
const ALIASES = new Set(['new-delhi-in', 'bangalore-in', 'bombay-in', 'saigon-vn', 'calcutta-in'])
let tail = 0
let skipped = 0

for (const e of [...roster].sort((a, b) => rank(a.cls) - rank(b.cls))) {
  const id = `${slug(e.n)}-${e.cc.toLowerCase()}`
  if (seen.has(id) || ALIASES.has(id)) continue
  const city = buildTailCity(e)
  if (!city) {
    skipped++
    continue
  }
  emit(city)
  tail++
}

console.log(`✓ seeded ${ok} city files → data/cities/ (${ROWS.length} curated, ${tail} GaWC tail)`)
if (skipped) console.log(`  (${skipped} roster entries skipped — no country data)`)
