import type { Metric, Confidence } from '../data/schema'
import { sourceById } from '../data/dataset'

const CONFIDENCE_DOT: Record<Confidence, string> = {
  high: 'var(--color-risk-0)',
  medium: 'var(--color-risk-2)',
  low: 'var(--color-risk-4)',
}

const CONFIDENCE_WORD: Record<Confidence, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
}

/**
 * Inline provenance affordance: a small dot (confidence) + year that reveals a
 * popover with the source, publisher, as-of date, confidence, and any caveat.
 * Hover or keyboard-focus to open.
 */
export function SourceChip({ metric }: { metric: Metric<unknown> }) {
  const source = sourceById.get(metric.source)
  return (
    <span className="group relative inline-flex items-center">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded px-1 text-[11px] text-ink-faint hover:text-ink focus:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-signal"
        aria-label={`Source: ${source?.name ?? metric.source}, as of ${metric.asOf}, ${CONFIDENCE_WORD[metric.confidence]}`}
      >
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ backgroundColor: CONFIDENCE_DOT[metric.confidence] }}
        />
        <span className="nums tabular-nums">{metric.asOf}</span>
      </button>

      <span className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-1.5 w-60 rounded-md border border-line bg-paper-raised p-2.5 text-left text-xs shadow-lg opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <span className="block font-medium text-ink">{source?.name ?? metric.source}</span>
        {source && <span className="mt-0.5 block text-ink-faint">{source.publisher}</span>}
        <span className="mt-1 flex items-center gap-1.5 text-ink-soft">
          <span className="inline-block size-1.5 rounded-full" style={{ backgroundColor: CONFIDENCE_DOT[metric.confidence] }} />
          {CONFIDENCE_WORD[metric.confidence]} · as of {metric.asOf}
        </span>
        {metric.note && <span className="mt-1 block text-ink-faint">{metric.note}</span>}
      </span>
    </span>
  )
}
