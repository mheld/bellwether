import { HORIZONS, type Horizon } from '../data/schema'
import { riskColorVar, riskLabel } from '../ui/scale'

interface ClimateStripeProps {
  /** risk 0-100 at each horizon */
  trajectory: Record<Horizon, number>
  showLabels?: boolean
  /** stripe height in px */
  height?: number
  className?: string
}

/**
 * The signature element: a city's climate arc rendered as a now → 2050 → 2080
 * ramp, each slice colored by hazard severity (kin to warming stripes). The
 * leftward-to-rightward color shift is the whole point — you read the future at
 * a glance.
 */
export function ClimateStripe({
  trajectory,
  showLabels = false,
  height = 10,
  className = '',
}: ClimateStripeProps) {
  return (
    <div className={className}>
      <div
        className="flex overflow-hidden rounded-sm ring-1 ring-black/5"
        style={{ height }}
        role="img"
        aria-label={
          'Climate risk arc — ' +
          HORIZONS.map((h) => `${h.label}: ${riskLabel(trajectory[h.key])}`).join(', ')
        }
      >
        {HORIZONS.map((h) => (
          <div
            key={h.key}
            className="flex-1"
            style={{ backgroundColor: riskColorVar(trajectory[h.key]) }}
            title={`${h.label}: ${riskLabel(trajectory[h.key])} (${Math.round(trajectory[h.key])})`}
          />
        ))}
      </div>
      {showLabels && (
        <div className="mt-1 flex text-[10px] uppercase tracking-wide text-ink-faint nums">
          {HORIZONS.map((h) => (
            <span key={h.key} className="flex-1 text-center first:text-left last:text-right">
              {h.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
