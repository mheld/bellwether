import { cities } from '../data/dataset'

/** Distinct regions present in the dataset, alphabetical — drives the filter chips. */
export const REGIONS: string[] = [...new Set(cities.map((c) => c.region))].sort()
