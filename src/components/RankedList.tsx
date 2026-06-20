import { Link } from 'react-router-dom'
import type { ScoredCity } from '../scoring/score'
import { overallTrajectory } from '../scoring/climate'
import { ClimateStripe } from './ClimateStripe'
import { topStrengths } from '../ui/factors'
import { formatScore } from '../ui/scale'

export function RankedList({ ranked }: { ranked: ScoredCity[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {ranked.map((sc, i) => (
        <CityRow key={sc.city.id} scored={sc} rank={i + 1} />
      ))}
    </ol>
  )
}

function CityRow({ scored, rank }: { scored: ScoredCity; rank: number }) {
  const { city, score, factorScores, completeness } = scored
  const traj = overallTrajectory(city)
  const strengths = topStrengths(factorScores, 3)

  return (
    <li>
      <Link
        to={`/city/${city.id}`}
        className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 px-1 py-4 transition-colors hover:bg-signal-soft/40 sm:px-3"
      >
        {/* rank */}
        <span className="nums text-right text-lg font-medium text-ink-faint tabular-nums group-hover:text-signal">
          {rank}
        </span>

        {/* identity + meta */}
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="truncate font-display text-base font-semibold text-ink">{city.name}</h3>
            <span className="truncate text-xs text-ink-faint">{city.country}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {strengths.map((s) => (
              <span
                key={s.key}
                className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-ink-soft ring-1 ring-line"
              >
                {s.label}
              </span>
            ))}
            {completeness < 1 && (
              <span className="text-[11px] text-ink-faint" title="Some factors lack data">
                {Math.round(completeness * 10)}/10 data
              </span>
            )}
          </div>
        </div>

        {/* score + climate arc */}
        <div className="flex items-center gap-4">
          <div className="hidden w-24 sm:block">
            <ClimateStripe trajectory={traj} height={8} />
            <p className="mt-1 text-right text-[10px] uppercase tracking-wide text-ink-faint">
              climate arc
            </p>
          </div>
          <div className="w-14 text-right">
            <div className="nums font-mono text-2xl font-medium leading-none text-ink tabular-nums">
              {formatScore(score)}
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-signal transition-[width] duration-300"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
