import raw from './dataset.json'
import { DatasetSchema, type City, type Source } from './schema'

/** The compiled dataset, re-validated at load so a corrupt build fails loudly. */
export const dataset = DatasetSchema.parse(raw)

export const cities: City[] = dataset.cities
export const sources: Source[] = dataset.sources

export const cityById = new Map(cities.map((c) => [c.id, c]))
export const sourceById = new Map(sources.map((s) => [s.id, s]))
