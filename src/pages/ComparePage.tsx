import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FACTORS, type FactorKey } from '../data/schema'
import { cities as allCities } from '../data/dataset'
import { useScored } from '../state/useScored'
import { useCompare, MAX_COMPARE } from '../state/useCompare'
import { useWeights } from '../state/useWeights'
import { useApplySharedCompare, buildCompareUrl } from '../state/urlState'
import { overallTrajectory } from '../scoring/climate'
import { ClimateStripe } from '../components/ClimateStripe'
import { formatScore } from '../ui/scale'

const ROWS: { key: FactorKey; label: string }[] = [
  { key: 'climate', label: 'Climate resilience' },
  ...FACTORS.filter((f) => f.key !== 'climate').map((f) => ({ key: f.key, label: f.label })),
]

export function ComparePage() {
  useApplySharedCompare()
  const ranked = useScored()
  const { ids, remove, toggle, clear, isFull } = useCompare()
  const factors = useWeights((s) => s.factors)
  const horizon = useWeights((s) => s.horizon)
  const hazard = useWeights((s) => s.hazard)
  const [picking, setPicking] = useState('')
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    const url = buildCompareUrl({ factors, horizon, hazard }, ids)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy your shareable compare link:', url)
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const selected = ids
    .map((id) => ranked.find((r) => r.city.id === id))
    .filter((r): r is NonNullable<typeof r> => r != null)

  const available = allCities
    .filter((c) => !ids.includes(c.id))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">Compare</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Up to {MAX_COMPARE} cities, side by side. Numbers reflect your current weights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {available.length > 0 && (
            <select
              value={picking}
              onChange={(e) => {
                if (e.target.value) toggle(e.target.value)
                setPicking('')
              }}
              disabled={isFull()}
              className="rounded-md border border-line-strong bg-paper-raised px-2 py-1.5 text-sm text-ink disabled:opacity-40"
            >
              <option value="">{isFull() ? 'Compare full' : '+ Add a city'}</option>
              {available.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          {ids.length > 0 && (
            <button
              onClick={copyLink}
              className="inline-flex items-center rounded-md px-2 py-1 text-xs text-ink-soft ring-1 ring-line-strong transition-colors hover:text-ink hover:ring-ink-faint"
            >
              {copied ? '✓ Link copied' : 'Share compare'}
            </button>
          )}
          {ids.length > 0 && (
            <button onClick={clear} className="text-xs text-ink-soft underline hover:text-ink">
              Clear
            </button>
          )}
        </div>
      </div>

      {selected.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-ink-soft">Nothing to compare yet.</p>
          <p className="mt-1 text-sm text-ink-faint">
            Add cities above, or pick “+ Compare” on any{' '}
            <Link to="/" className="text-signal hover:underline">
              city page
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 p-2 text-left align-bottom" />
                {selected.map((s) => {
                  const traj = overallTrajectory(s.city)
                  return (
                    <th key={s.city.id} className="min-w-36 p-2 align-bottom">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/city/${s.city.id}`}
                          className="font-display text-base font-semibold text-ink hover:text-signal"
                        >
                          {s.city.name}
                        </Link>
                        <button
                          onClick={() => remove(s.city.id)}
                          className="text-ink-faint hover:text-ink"
                          aria-label={`Remove ${s.city.name}`}
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-1 text-left text-[11px] font-normal text-ink-faint">
                        {s.city.country}
                      </div>
                      <div className="nums mt-2 text-left font-mono text-3xl font-medium tabular-nums text-ink">
                        {formatScore(s.score)}
                      </div>
                      <ClimateStripe trajectory={traj} height={8} className="mt-2" />
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const vals = selected.map((s) => s.factorScores[row.key])
                const max = Math.max(...vals.map((v) => v ?? -1))
                return (
                  <tr key={row.key} className="border-t border-line">
                    <td className="p-2 text-ink-soft">{row.label}</td>
                    {selected.map((s, i) => {
                      const v = vals[i]
                      const isBest = v != null && v === max && selected.length > 1
                      return (
                        <td key={s.city.id} className="p-2 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                              <div
                                className="h-full rounded-full bg-signal"
                                style={{ width: `${v ?? 0}%` }}
                              />
                            </div>
                            <span
                              className={
                                'nums w-7 text-right font-mono text-xs tabular-nums ' +
                                (isBest ? 'font-semibold text-signal' : 'text-ink-soft')
                              }
                            >
                              {v == null ? '—' : formatScore(v)}
                            </span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
