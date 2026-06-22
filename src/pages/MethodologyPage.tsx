import {
  FACTORS,
  HORIZONS,
  HAZARDS,
  GAWC_ORDINAL,
  REGIME_GOODNESS,
  type GaWCClass,
  type TaxRegime,
} from '../data/schema'
import { sources } from '../data/dataset'

export function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Methodology</h1>
      <p className="mt-3 text-ink-soft">
        Bellwether turns messy, slow-moving relocation data into a single ranking you can
        steer. Here’s exactly how — including where it’s uncertain, because pretending
        otherwise would make a 50-year projection look more precise than it is.
      </p>

      <Section title="What the score is — and isn’t">
        <p>
          Every score is <strong className="text-ink">relative to the cities in this set</strong>,
          not an absolute measure. A 70 means “better than most of these cities on the things you
          weighted,” not “70% perfect.” Bellwether is a thinking tool, not relocation advice.
        </p>
      </Section>

      <Section title="How a city is scored">
        <ol className="list-decimal space-y-2 pl-5 marker:text-ink-faint">
          <li>
            <strong className="text-ink">Normalize.</strong> Each raw value (price, tax rate,
            index, hazard risk) is converted to a 0–100 <em>percentile rank</em> within the
            current set — outlier-robust and easy to read. Lower-is-better signals (costs, taxes,
            climate risk) are inverted so higher always means better.
          </li>
          <li>
            <strong className="text-ink">Compose.</strong> Multi-part factors are blended —
            housing from buy + rent; taxation from regime, income and capital-gains rates; safety
            from crime and political stability; language &amp; visa from English proficiency and
            residency ease.
          </li>
          <li>
            <strong className="text-ink">Weight.</strong> Your slider values become the relative
            importance of each factor; the final score is their weighted average.
          </li>
          <li>
            <strong className="text-ink">Handle gaps honestly.</strong> A missing factor is
            excluded and its weight redistributed across the rest — a city is never silently
            penalized for a data gap, and coverage is shown where it’s incomplete.
          </li>
        </ol>
      </Section>

      <Section title="The climate fold">
        <p>
          Climate is the reason Bellwether exists, so it gets special treatment. For each of five
          hazards ({HAZARDS.map((h) => h.label.toLowerCase()).join(', ')}) we hold a risk value at
          three horizons:
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {HORIZONS.map((h) => (
            <li
              key={h.key}
              className="rounded-full bg-paper px-3 py-1 text-sm text-ink-soft ring-1 ring-line"
            >
              {h.label}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          The <strong className="text-ink">climate horizon</strong> sliders let you decide how much
          today versus mid- and late-century counts. That’s the honest way to handle projection
          uncertainty — you choose how much to trust the long view. Horizons are aligned to WRI
          Aqueduct and IPCC AR6 published slices under the SSP2-4.5 scenario, so the far number
          isn’t invented by interpolation.
        </p>
      </Section>

      <Section title="Mapping tables">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">City-importance tier → score</h3>
            <p className="mt-1 text-xs text-ink-faint">
              GaWC world-city classification, our public stand-in for proprietary importance models.
            </p>
            <dl className="mt-2 space-y-1 text-sm">
              {(Object.entries(GAWC_ORDINAL) as [GaWCClass, number][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line/60 py-0.5">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="nums tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Tax regime → base score</h3>
            <p className="mt-1 text-xs text-ink-faint">
              Combined with income and capital-gains percentiles for the taxation factor.
            </p>
            <dl className="mt-2 space-y-1 text-sm">
              {(Object.entries(REGIME_GOODNESS) as [TaxRegime, number][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line/60 py-0.5">
                  <dt className="capitalize text-ink-soft">{k}</dt>
                  <dd className="nums tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section title="Factors & where the data comes from">
        <ul className="space-y-2">
          {FACTORS.map((f) => (
            <li key={f.key} className="border-b border-line/60 pb-2">
              <span className="font-medium text-ink">{f.label}</span>
              <span className="text-ink-faint"> — {f.blurb}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="How much to trust each number">
        <p>
          Every value carries a source dot — green (high), amber (medium), red (low) — and an as-of
          date you can hover anywhere it appears. Broadly:
        </p>
        <ul className="space-y-1.5">
          <li>
            <strong className="text-ink">High confidence (authoritative):</strong> city tier (GaWC
            2024), taxation (PwC Worldwide Tax Summaries), English proficiency (EF EPI 2024), and
            political stability (World Bank WGI).
          </li>
          <li>
            <strong className="text-ink">Medium confidence (sourced, but noisier):</strong> cost of
            living, housing buy/rent, healthcare and safety (Numbeo), airport connectivity
            (FlightsFrom), expat-friendliness (InterNations Expat City Ranking), and visa/residency
            ease (a curated rubric of nomad/retirement/investor and PR routes). Real signals, but
            they drift, sample unevenly, or involve judgment.
          </li>
          <li>
            <strong className="text-ink">Low confidence (grounded estimates):</strong>{' '}
            climate hazards are assigned as risk <em>bands</em> (low → severe) per horizon, grounded
            in the World Bank CCKP, IPCC AR6 and WRI Aqueduct. Today’s bands are reasonably solid;
            the 2050 and especially 2080 projections are genuinely uncertain, so use the
            climate-horizon sliders to decide how much they count.
          </li>
          <li>
            <strong className="text-ink">Country proxies (the GaWC long tail):</strong> smaller
            cities below the Beta tier carry an authoritative GaWC tier, tax, language and stability,
            but their cost, housing, safety, healthcare and climate are{' '}
            <em>country-level baselines</em>, not city-specific figures. Their airport connectivity is
            estimated from tier. Treat these as directional placeholders pending city-level data.
          </li>
        </ul>
      </Section>

      <Section title="Sources">
        <ul className="space-y-1.5 text-sm">
          {sources.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-signal hover:underline"
              >
                {s.name}
              </a>
              <span className="text-ink-faint"> — {s.publisher}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 border-t border-line pt-6">
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}
