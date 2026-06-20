import { useCompare, MAX_COMPARE } from '../state/useCompare'

/** Small add/remove-from-compare button, usable over a stretched-link row. */
export function CompareToggle({ cityId, className = '' }: { cityId: string; className?: string }) {
  const selected = useCompare((s) => s.ids.includes(cityId))
  const full = useCompare((s) => s.ids.length >= MAX_COMPARE)
  const toggle = useCompare((s) => s.toggle)
  const disabled = !selected && full

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(cityId)
      }}
      disabled={disabled}
      aria-pressed={selected}
      title={
        selected
          ? 'In compare — click to remove'
          : full
            ? `Compare is full (${MAX_COMPARE} max)`
            : 'Add to compare'
      }
      aria-label={selected ? `Remove ${cityId} from compare` : `Add ${cityId} to compare`}
      className={
        'grid size-7 shrink-0 place-items-center rounded-md text-sm leading-none transition-colors ' +
        (selected
          ? 'bg-ink text-paper'
          : 'text-ink-faint ring-1 ring-line hover:text-ink hover:ring-line-strong disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-ink-faint disabled:hover:ring-line') +
        ' ' +
        className
      }
    >
      {selected ? '✓' : '+'}
    </button>
  )
}
