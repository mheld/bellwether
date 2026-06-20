/* ============================================================================
 * build-data.ts — compile the curated authoring files into the runtime dataset.
 *
 *   data/cities/<id>.json  +  data/sources.json
 *        │  (zod-validate each, check cross-references, measure completeness)
 *        ▼
 *   src/data/dataset.json   (single compiled file the app loads)
 *
 * Run: `npm run build:data` (also runs automatically via `prebuild`).
 * Exits non-zero on any validation or cross-reference error so a broken
 * dataset can never ship.
 * ========================================================================== */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  CitySchema,
  SourceSchema,
  DatasetSchema,
  SCHEMA_VERSION,
  BASELINE_YEAR,
  FACTORS,
  type City,
  type Source,
} from '../src/data/schema.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const CITIES_DIR = join(ROOT, 'data', 'cities')
const SOURCES_FILE = join(ROOT, 'data', 'sources.json')
const OUT_FILE = join(ROOT, 'src', 'data', 'dataset.json')

const RED = (s: string) => `\x1b[31m${s}\x1b[0m`
const GREEN = (s: string) => `\x1b[32m${s}\x1b[0m`
const YELLOW = (s: string) => `\x1b[33m${s}\x1b[0m`
const DIM = (s: string) => `\x1b[2m${s}\x1b[0m`

const errors: string[] = []
const warnings: string[] = []

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    errors.push(`Could not parse JSON: ${path}\n  ${(e as Error).message}`)
    return null
  }
}

/* ---- Sources ------------------------------------------------------------- */

const rawSources = readJson(SOURCES_FILE)
let sources: Source[] = []
const sourcesParsed = SourceSchema.array().safeParse(rawSources)
if (!sourcesParsed.success) {
  errors.push(`sources.json failed validation:\n${formatZod(sourcesParsed.error)}`)
} else {
  sources = sourcesParsed.data
}
const sourceIds = new Set(sources.map((s) => s.id))

/* ---- Cities -------------------------------------------------------------- */

let cityFiles: string[] = []
try {
  cityFiles = readdirSync(CITIES_DIR).filter((f) => f.endsWith('.json'))
} catch {
  errors.push(`No city directory at ${CITIES_DIR}`)
}

const cities: City[] = []
const seenIds = new Set<string>()

for (const file of cityFiles.sort()) {
  const path = join(CITIES_DIR, file)
  const raw = readJson(path)
  if (raw === null) continue

  const parsed = CitySchema.safeParse(raw)
  if (!parsed.success) {
    errors.push(`${file} failed validation:\n${formatZod(parsed.error)}`)
    continue
  }
  const city = parsed.data

  const expectedFile = `${city.id}.json`
  if (file !== expectedFile) {
    warnings.push(`${file}: filename should match id → ${expectedFile}`)
  }
  if (seenIds.has(city.id)) {
    errors.push(`Duplicate city id: ${city.id} (${file})`)
    continue
  }
  seenIds.add(city.id)

  // Cross-reference: every `source` id used must exist in the registry.
  for (const { path: where, source } of collectSourceRefs(city)) {
    if (!sourceIds.has(source)) {
      errors.push(`${file}: unknown source id "${source}" at ${where}`)
    }
  }

  cities.push(city)
}

/* ---- Report & emit ------------------------------------------------------- */

if (errors.length) {
  console.error(RED(`\n✗ build-data failed with ${errors.length} error(s):\n`))
  for (const e of errors) console.error(RED('  • ') + e + '\n')
  process.exit(1)
}

cities.sort((a, b) => a.name.localeCompare(b.name))

const dataset = {
  schemaVersion: SCHEMA_VERSION,
  baselineYear: BASELINE_YEAR,
  generatedAt: new Date().toISOString(),
  sources,
  cities,
}

// Final guard: the assembled object must satisfy the Dataset schema.
const finalCheck = DatasetSchema.safeParse(dataset)
if (!finalCheck.success) {
  console.error(RED('\n✗ assembled dataset failed final validation:\n'))
  console.error(formatZod(finalCheck.error))
  process.exit(1)
}

mkdirSync(dirname(OUT_FILE), { recursive: true })
writeFileSync(OUT_FILE, JSON.stringify(dataset, null, 2) + '\n')

printCoverage(cities)
if (warnings.length) {
  console.warn(YELLOW(`\n${warnings.length} warning(s):`))
  for (const w of warnings) console.warn(YELLOW('  • ') + w)
}
console.log(
  GREEN(`\n✓ wrote ${cities.length} cities → ${relativize(OUT_FILE)}`) +
    DIM(` (${sources.length} sources)\n`),
)

/* ---- Helpers ------------------------------------------------------------- */

/** Walk a city's factor tree and yield every {path, source} pair. */
function collectSourceRefs(
  city: City,
): Array<{ path: string; source: string }> {
  const refs: Array<{ path: string; source: string }> = []
  const walk = (node: unknown, path: string) => {
    if (node === null || typeof node !== 'object') return
    const obj = node as Record<string, unknown>
    if (typeof obj.source === 'string' && 'value' in obj && 'asOf' in obj) {
      refs.push({ path, source: obj.source })
      return // a Metric leaf — don't descend into its value
    }
    for (const [k, v] of Object.entries(obj)) {
      walk(v, path ? `${path}.${k}` : k)
    }
  }
  walk(city.population, 'population')
  walk(city.factors, 'factors')
  return refs
}

/** Count how many of the 10 weighted factors each city populates. */
function printCoverage(cities: City[]) {
  console.log(DIM('\nCoverage (factors present per city, of 10):'))
  const totals = new Map<string, number>()
  for (const c of cities) {
    const present = FACTORS.filter((f) => c.factors[f.key] != null).length
    totals.set(c.id, present)
    const bar = '█'.repeat(present) + DIM('░'.repeat(10 - present))
    const flag = present < 10 ? YELLOW(` ${present}/10`) : DIM(' 10/10')
    console.log(`  ${bar}${flag}  ${c.name}`)
  }
  const avg =
    [...totals.values()].reduce((a, b) => a + b, 0) / (totals.size || 1)
  console.log(DIM(`  average completeness: ${avg.toFixed(1)}/10`))
}

function formatZod(error: { issues: Array<{ path: (string | number)[]; message: string }> }): string {
  return error.issues
    .map((i) => `    ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n')
}

function relativize(p: string): string {
  return p.startsWith(ROOT) ? p.slice(ROOT.length + 1) : p
}
