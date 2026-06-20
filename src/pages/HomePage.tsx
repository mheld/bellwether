import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { WeightsPanel } from '../components/WeightsPanel'
import { RankedList } from '../components/RankedList'
import { FilterBar } from '../components/FilterBar'
import { ShareButton } from '../components/ShareButton'
import { useScored } from '../state/useScored'
import { useApplySharedWeights } from '../state/urlState'

export function HomePage() {
  useApplySharedWeights()
  const ranked = useScored()

  const [query, setQuery] = useState('')
  const [regions, setRegions] = useState<Set<string>>(new Set())
  const PAGE = 25
  const [visible, setVisible] = useState(PAGE)

  const rankById = useMemo(
    () => new Map(ranked.map((sc, i) => [sc.city.id, i + 1])),
    [ranked],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ranked.filter((sc) => {
      const c = sc.city
      if (regions.size && !regions.has(c.region)) return false
      if (q && !`${c.name} ${c.country}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [ranked, query, regions])

  // Reset the visible window whenever the filtered set changes.
  useEffect(() => setVisible(PAGE), [query, regions])
  const shown = filtered.slice(0, visible)

  const toggleRegion = (r: string) =>
    setRegions((prev) => {
      const next = new Set(prev)
      next.has(r) ? next.delete(r) : next.add(r)
      return next
    })

  const clearFilters = () => {
    setQuery('')
    setRegions(new Set())
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero — the thesis, not a big number. */}
      <section className="border-b border-line py-10 sm:py-14">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-signal">
          A climate-relocation compass
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl">
          Where should you weather the next fifty years?
        </h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Rank the world's important cities by what actually matters to you — climate
          risk through {''}
          <span className="text-ink">2080</span>, cost, taxes, connectivity, and more.
          Move the sliders; the list answers.
        </p>
      </section>

      {/* Workspace */}
      <div className="grid gap-8 py-8 lg:grid-cols-[18rem_1fr] lg:gap-12">
        <aside className="lg:sticky lg:top-20 lg:h-fit lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pr-1">
          <WeightsPanel />
          <div className="mt-5 border-t border-line pt-4">
            <ShareButton />
          </div>
        </aside>

        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {ranked.length} cities, ranked for you
            </h2>
            <Link to="/compare" className="text-xs text-signal hover:underline">
              Compare cities →
            </Link>
          </div>

          <FilterBar
            query={query}
            onQuery={setQuery}
            selected={regions}
            onToggleRegion={toggleRegion}
            onClear={clearFilters}
            count={filtered.length}
            total={ranked.length}
          />

          <RankedList ranked={shown} rankById={rankById} />

          {filtered.length > visible && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setVisible((v) => v + PAGE)}
                className="rounded-md px-3 py-1.5 text-xs text-ink-soft ring-1 ring-line-strong transition-colors hover:text-ink hover:ring-ink-faint"
              >
                Show {Math.min(PAGE, filtered.length - visible)} more
              </button>
              <button
                onClick={() => setVisible(filtered.length)}
                className="text-xs text-signal hover:underline"
              >
                Show all {filtered.length}
              </button>
            </div>
          )}

          <p className="mt-6 text-[11px] leading-relaxed text-ink-faint">
            Scores are <em>relative</em> within this set of cities, not absolute. Most
            factors are sourced; climate projections and a few others are estimates — see{' '}
            <Link to="/methodology" className="underline hover:text-ink">
              how the numbers are made
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
