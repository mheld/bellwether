import { FACTORS, type FactorKey } from '../data/schema'

export const FACTOR_LABEL: Record<FactorKey, string> = Object.fromEntries(
  FACTORS.map((f) => [f.key, f.label]),
) as Record<FactorKey, string>

/** The factors a city scores highest on, given its computed factor goodness. */
export function topStrengths(
  factorScores: Record<FactorKey, number | undefined>,
  n = 3,
): { key: FactorKey; label: string; score: number }[] {
  return FACTORS.map((f) => ({ key: f.key, label: f.label, score: factorScores[f.key] }))
    .filter((x): x is { key: FactorKey; label: string; score: number } => x.score != null)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}
