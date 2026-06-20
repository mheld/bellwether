import { FACTORS, HORIZONS, type FactorKey } from '../data/schema'
import { useWeights } from '../state/useWeights'
import { PRESETS } from '../state/presets'

export function WeightsPanel() {
  const { factors, horizon, setFactor, setHorizon, setAll, reset } = useWeights()

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink">
            What matters to you
          </h2>
          <p className="mt-0.5 text-xs text-ink-faint">
            Start from a preset, then fine-tune. The ranking updates live.
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs text-ink-soft underline decoration-line-strong underline-offset-2 hover:text-ink"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() =>
              setAll({ factors: preset.factors, horizon: preset.horizon, hazard: preset.hazard })
            }
            title={preset.blurb}
            className="rounded-full px-2.5 py-1 text-xs text-ink-soft ring-1 ring-line transition-colors hover:bg-signal-soft hover:text-ink hover:ring-signal-soft"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {FACTORS.map((f) => (
          <div key={f.key}>
            <FactorSlider
              factorKey={f.key}
              label={f.label}
              blurb={f.blurb}
              value={factors[f.key]}
              onChange={(v) => setFactor(f.key, v)}
            />
            {f.key === 'climate' && (
              <div className="mt-3 ml-3 border-l-2 border-signal-soft pl-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-soft">
                  Climate horizon — how much each era counts
                </p>
                <div className="mt-2 space-y-2">
                  {HORIZONS.map((h) => (
                    <MiniSlider
                      key={h.key}
                      label={h.label}
                      value={horizon[h.key]}
                      onChange={(v) => setHorizon(h.key, v)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FactorSlider({
  factorKey,
  label,
  blurb,
  value,
  onChange,
}: {
  factorKey: FactorKey
  label: string
  blurb: string
  value: number
  onChange: (v: number) => void
}) {
  const muted = value === 0
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={`w-${factorKey}`} className={muted ? 'text-sm text-ink-faint' : 'text-sm text-ink'}>
          {label}
        </label>
        <span className="nums text-xs text-ink-soft tabular-nums">{value}</span>
      </div>
      <input
        id={`w-${factorKey}`}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-signal)]"
        aria-describedby={`d-${factorKey}`}
      />
      <p id={`d-${factorKey}`} className="mt-1 text-[11px] leading-snug text-ink-faint">
        {blurb}
      </p>
    </div>
  )
}

function MiniSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 shrink-0 text-[11px] text-ink-soft nums">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-risk-3)]"
        aria-label={`Weight for ${label}`}
      />
    </div>
  )
}
