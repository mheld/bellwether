import { REGIONS } from '../ui/regions'

interface FilterBarProps {
  query: string
  onQuery: (q: string) => void
  selected: Set<string>
  onToggleRegion: (region: string) => void
  onClear: () => void
  count: number
  total: number
}

export function FilterBar({
  query,
  onQuery,
  selected,
  onToggleRegion,
  onClear,
  count,
  total,
}: FilterBarProps) {
  const active = query.length > 0 || selected.size > 0

  return (
    <div className="mb-4 space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="Search city or country…"
        className="w-full rounded-md border border-line-strong bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-signal focus:outline-none focus-visible:ring-1 focus-visible:ring-signal"
        aria-label="Search cities or countries"
      />

      <div className="flex flex-wrap gap-1.5">
        {REGIONS.map((r) => {
          const on = selected.has(r)
          return (
            <button
              key={r}
              onClick={() => onToggleRegion(r)}
              aria-pressed={on}
              className={
                'rounded-full px-2.5 py-1 text-xs transition-colors ' +
                (on
                  ? 'bg-ink text-paper'
                  : 'text-ink-soft ring-1 ring-line hover:text-ink hover:ring-line-strong')
              }
            >
              {r}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-ink-faint">
        <span className="nums tabular-nums">
          {count} of {total}
        </span>
        {active && (
          <button onClick={onClear} className="underline hover:text-ink">
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
