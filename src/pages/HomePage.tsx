import { Link } from 'react-router-dom'
import { WeightsPanel } from '../components/WeightsPanel'
import { RankedList } from '../components/RankedList'
import { ShareButton } from '../components/ShareButton'
import { useScored } from '../state/useScored'
import { useApplySharedWeights } from '../state/urlState'

export function HomePage() {
  useApplySharedWeights()
  const ranked = useScored()

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

          <RankedList ranked={ranked} />

          <p className="mt-6 text-[11px] leading-relaxed text-ink-faint">
            Scores are <em>relative</em> within this set of cities, not absolute. Seed
            values are approximate and being verified — see{' '}
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
