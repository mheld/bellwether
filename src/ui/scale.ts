/* Shared visual scales — keep the risk ramp and score formatting in one place
 * so every stripe, bar, and badge speaks the same language. */

/** Map a 0-100 hazard risk to one of the five ramp stops (CSS custom property). */
export function riskColorVar(value: number): string {
  const bucket = Math.min(4, Math.max(0, Math.floor(value / 20)))
  return `var(--color-risk-${bucket})`
}

/** Plain-language band for a risk value, for labels and a11y. */
export function riskLabel(value: number): string {
  if (value < 20) return 'Low'
  if (value < 40) return 'Moderate'
  if (value < 60) return 'Elevated'
  if (value < 80) return 'High'
  return 'Severe'
}

/** Scores are shown as whole numbers on the instrument readout. */
export function formatScore(score: number): string {
  return Math.round(score).toString()
}
