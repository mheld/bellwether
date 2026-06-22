# Bellwether

A climate-aware city-relocation compass. Rank the world's important cities for living
**long-term** — weighted by what you care about: climate risk through 2080, cost, taxes,
airport connectivity, taxation, expat-friendliness, healthcare, safety, and visa ease.

Pure static frontend, no backend, no live APIs — deploys free on Cloudflare Pages or Vercel.

> **On the data:** values are approximate estimates compiled from public indices
> (GaWC, PwC, EF EPI, World Bank, Numbeo, WRI Aqueduct/IPCC, InterNations) — not a
> redistribution of any provider's dataset, and not relocation advice. Confidence
> varies by factor and is shown on every value; verify before relying on it. See the
> in-app **Methodology** page for the full breakdown.

## Stack

- **React + Vite + TypeScript + Tailwind v4**
- **zod** — validates the curated dataset at build time and on load
- **zustand** — weights / compare state (persisted to `localStorage`)
- Scoring is pure client-side functions over a compiled JSON dataset.

## Develop

This project uses [Devbox](https://www.jetify.com/devbox) to pin the toolchain (Node 24 via
Nix) so every environment is identical. Entering the shell installs npm deps automatically.

With [direnv](https://direnv.net) installed, the committed `.envrc` activates the Devbox env
automatically whenever you `cd` into the project — no manual `devbox shell` needed (run
`direnv allow` once to trust it).

```bash
devbox shell         # enter the pinned env (auto-runs npm install)
devbox run dev       # http://localhost:5173
devbox run test      # scoring + url-state unit tests (vitest)
devbox run build     # build:data → tsc → vite build → dist/
devbox run data      # recompile the dataset after editing city files
devbox run seed      # regenerate the seed city files
```

Plain npm works too if you'd rather not use Devbox (Node 24+ required):

```bash
npm install
npm run dev
npm test
npm run build
```

## The data pipeline

City data lives as **one hand-editable file per city** under `data/cities/<id>.json`, plus a
shared source registry in `data/sources.json`. The build step validates and compiles them:

```
data/cities/*.json + data/sources.json
        │  scripts/build-data.ts  (zod-validate, check source cross-refs, report coverage)
        ▼
src/data/dataset.json             (single compiled file the app loads)
```

```bash
npm run build:data   # recompile after editing any city file (also runs via prebuild)
```

`build:data` fails loudly on an invalid record or an unknown `source` id, so a broken dataset
can never ship. Most values are **sourced from authoritative datasets** at varying confidence —
GaWC 2024 (tier), PwC (tax), EF EPI 2024 (English), World Bank WGI (stability), Numbeo
(cost/housing/healthcare/safety), FlightsFrom (connectivity), WRI Aqueduct + IPCC/CCKP (climate
bands), and InterNations (expat). See the in-app Methodology page for the full confidence
breakdown. Every value carries `source`, `asOf`, and `confidence`. To add or correct a city,
edit its JSON file and re-run `build:data`.

`scripts/seed-cities.ts` regenerates the per-city files from a compact table plus verified
lookup maps; it's a generator, not part of the app build.

## How scoring works

Each raw value becomes a 0–100 **percentile rank** within the cohort (lower-is-better signals
inverted), composites are blended, and your slider weights produce a weighted average. Missing
factors are excluded and their weight redistributed. Climate folds five hazards across three
horizons (today / 2050 / 2080, SSP2-4.5), with user-adjustable horizon emphasis. Full details
live on the in-app Methodology page and in `src/scoring/`.

## Deploy (Cloudflare Workers)

Configured as a static-assets Worker via `wrangler.jsonc` (assets dir `./dist`,
`not_found_handling: "single-page-application"` so client routes like `/city/:id`
and `/compare` resolve to `index.html`). With the repo connected to Cloudflare:

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`

Or run `npm run deploy` (builds, then `npx wrangler deploy`). The primary deploy
path is Cloudflare's connected build on push to `main`.

> SPA routing is handled by the Worker config, **not** a `_redirects` file — the
> Workers assets handler rejects a `/* /index.html 200` catch-all as a redirect loop.

> `wrangler` is intentionally **not** a pinned dependency: it pulls a non-optional
> `sharp` that fails to build from source on Node 24 + macOS, which would break a
> clean `npm install`. `npx wrangler` (and Cloudflare's Linux build) work fine. For
> frequent local deploys, install it globally: `npm i -g wrangler --ignore-scripts`.

Vercel / Cloudflare Pages also work (framework preset: Vite, output `dist`); for
Pages, add a `public/_redirects` with `/* /index.html 200`.
