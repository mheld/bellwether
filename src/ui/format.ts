/** Compact display formatters shared by detail and compare views. */

export function usd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

export function usdPerSqm(n: number): string {
  return usd(n) + '/m²'
}

export function usdPerMonth(n: number): string {
  return usd(n) + '/mo'
}

export function pct(n: number): string {
  return `${n}%`
}

export function index(n: number): string {
  return Math.round(n).toString()
}

export function population(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return Math.round(n / 1_000) + 'k'
  return n.toString()
}

export function signed(n: number): string {
  return (n > 0 ? '+' : '') + n.toFixed(1)
}

const REGIME_LABEL: Record<string, string> = {
  none: 'No income tax',
  territorial: 'Territorial',
  hybrid: 'Hybrid',
  worldwide: 'Worldwide',
}
export function regimeLabel(regime: string): string {
  return REGIME_LABEL[regime] ?? regime
}
