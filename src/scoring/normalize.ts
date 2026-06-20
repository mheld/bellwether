/* ============================================================================
 * normalize.ts — turn heterogeneous raw signals into comparable 0-100 scores.
 *
 * We use PERCENTILE RANK within the current city cohort rather than min-max or
 * z-score: it's outlier-robust, naturally bounded 0-100, and interpretable
 * ("better than 80% of the list") — the right unit for a relative ranking tool.
 * ========================================================================== */

/**
 * Percentile rank of each value within the cohort of *present* values, aligned
 * to the input order. `undefined` inputs are ignored when ranking and returned
 * as `undefined`.
 *
 * Definition: (count strictly below + half of ties) / n × 100. A single present
 * value yields 50 (neutral). Identical values all share the same mid-rank.
 */
export function percentileRanks(
  values: ReadonlyArray<number | undefined>,
): (number | undefined)[] {
  const present = values.filter((v): v is number => v != null)
  const n = present.length
  if (n === 0) return values.map(() => undefined)

  return values.map((v) => {
    if (v == null) return undefined
    let below = 0
    let equal = 0
    for (const x of present) {
      if (x < v) below++
      else if (x === v) equal++
    }
    return ((below + equal / 2) / n) * 100
  })
}

/** Invert a 0-100 score so that "lower raw is better" reads as higher goodness. */
export function invert(score: number | undefined): number | undefined {
  return score == null ? undefined : 100 - score
}

/** Mean of the defined values; `undefined` if none are defined. */
export function meanDefined(
  values: ReadonlyArray<number | undefined>,
): number | undefined {
  const present = values.filter((v): v is number => v != null)
  if (present.length === 0) return undefined
  return present.reduce((a, b) => a + b, 0) / present.length
}

/** Clamp to the 0-100 range. */
export function clamp01to100(v: number): number {
  return Math.max(0, Math.min(100, v))
}
