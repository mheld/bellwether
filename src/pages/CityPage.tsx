import { Link, useParams } from 'react-router-dom'
import { HAZARDS, type Hazard } from '../data/schema'
import { cityById } from '../data/dataset'
import { useScored } from '../state/useScored'
import { useCompare } from '../state/useCompare'
import { overallTrajectory, hazardTrajectory } from '../scoring/climate'
import { cityFactorDetails } from '../ui/cityFacts'
import { population } from '../ui/format'
import { formatScore, riskLabel, riskColorVar } from '../ui/scale'
import { ClimateStripe } from '../components/ClimateStripe'
import { SourceChip } from '../components/SourceChip'

export function CityPage() {
  const { id } = useParams()
  const ranked = useScored()
  const compare = useCompare()

  const city = id ? cityById.get(id) : undefined
  if (!city) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="text-ink-soft">That city isn’t in Bellwether.</p>
        <Link to="/" className="mt-3 inline-block text-signal hover:underline">
          ← Back to the ranking
        </Link>
      </div>
    )
  }

  const idx = ranked.findIndex((r) => r.city.id === city.id)
  const scored = ranked[idx]
  const rank = idx + 1
  const details = cityFactorDetails(city)
  const traj = overallTrajectory(city)
  const scenario = city.factors.climate.hazards.heat.scenario
  const inCompare = compare.has(city.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link to="/" className="text-xs text-ink-soft hover:text-ink">
        ← Ranking
      </Link>

      {/* Header */}
      <header className="mt-4 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="nums font-mono text-sm text-ink-faint tabular-nums">#{rank}</span>
            <span className="text-xs uppercase tracking-wide text-ink-faint">
              for your weights
            </span>
          </div>
          <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-ink">
            {city.name}
          </h1>
          <p className="mt-1 text-ink-soft">
            {city.country} · {city.region} · {population(city.population.value)} people ·{' '}
            {city.factors.importance.value}
          </p>
          {city.blurb && <p className="mt-3 max-w-xl text-sm text-ink-soft">{city.blurb}</p>}
        </div>

        <div className="text-right">
          <div className="nums font-mono text-5xl font-medium leading-none text-ink tabular-nums">
            {formatScore(scored.score)}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wide text-ink-faint">match score</div>
          <button
            onClick={() => compare.toggle(city.id)}
            disabled={!inCompare && compare.isFull()}
            className={
              'mt-3 rounded-md px-3 py-1.5 text-xs transition-colors ' +
              (inCompare
                ? 'bg-ink text-paper'
                : 'ring-1 ring-line-strong text-ink-soft hover:text-ink hover:ring-ink-faint disabled:opacity-40')
            }
          >
            {inCompare ? '✓ In compare' : compare.isFull() ? 'Compare full' : '+ Compare'}
          </button>
        </div>
      </header>

      {/* Climate hero — the centerpiece */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink">
            Climate outlook — today to 2080
          </h2>
          <span className="text-[11px] text-ink-faint">Scenario {scenario}</span>
        </div>

        <div className="mt-4 rounded-lg border border-line bg-paper-raised p-5">
          <ClimateStripe trajectory={traj} showLabels height={20} />
          <p className="mt-3 text-sm text-ink-soft">
            Overall hazard exposure shifts from{' '}
            <strong className="text-ink">{riskLabel(traj.now).toLowerCase()}</strong> today to{' '}
            <strong className="text-ink">{riskLabel(traj.y2080).toLowerCase()}</strong> by 2080,
            averaged across five hazards.
          </p>

          <div className="mt-5 space-y-3 border-t border-line pt-4">
            {HAZARDS.map((h) => (
              <HazardRow key={h.key} hazard={h} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* Factor breakdown */}
      <section className="mt-10">
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink">
          How {city.name} scores, factor by factor
        </h2>
        <p className="mt-1 text-xs text-ink-faint">
          Each bar is this city’s standing <em>relative to the others</em> on that factor (0–100).
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <FactorScoreRow
            label="Climate resilience"
            score={scored.factorScores.climate}
          />
          {details.map((d) => (
            <FactorScoreRow key={d.key} label={d.label} score={scored.factorScores[d.key]}>
              {d.facts.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-ink-soft">{fact.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="nums text-ink tabular-nums">{fact.display}</span>
                    <SourceChip metric={fact.metric} />
                  </span>
                </div>
              ))}
            </FactorScoreRow>
          ))}
        </div>
      </section>
    </div>
  )
}

function HazardRow({
  hazard,
  city,
}: {
  hazard: { key: Hazard; label: string }
  city: import('../data/schema').City
}) {
  const t = hazardTrajectory(city, hazard.key)
  const proj = city.factors.climate.hazards[hazard.key]
  return (
    <div className="grid grid-cols-[8rem_1fr_auto] items-center gap-3">
      <span className="text-sm text-ink-soft">{hazard.label}</span>
      <ClimateStripe trajectory={t} height={12} />
      <span className="flex items-center gap-2">
        <span
          className="nums w-16 text-right text-xs tabular-nums text-ink-soft"
          title={`Today ${Math.round(t.now)} → 2080 ${Math.round(t.y2080)}`}
        >
          {Math.round(t.now)} → {Math.round(t.y2080)}
        </span>
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: riskColorVar(t.y2080) }}
          title={riskLabel(t.y2080)}
        />
        <SourceChip metric={proj.y2080} />
      </span>
    </div>
  )
}

function FactorScoreRow({
  label,
  score,
  children,
}: {
  label: string
  score: number | undefined
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-line p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium text-ink">{label}</h3>
        <span className="nums font-mono text-sm tabular-nums text-ink-soft">
          {score == null ? '—' : formatScore(score)}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-300"
          style={{ width: `${score ?? 0}%` }}
        />
      </div>
      {children && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  )
}
