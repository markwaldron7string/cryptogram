![CI](https://github.com/markwaldron7string/cryptogram/actions/workflows/ci.yml/badge.svg)
![E2E](https://github.com/markwaldron7string/cryptogram/actions/workflows/cypress.yml/badge.svg)

# Cryptogram

> A real-time cryptocurrency dashboard that tracks live prices, market data, and historical trends across hundreds of coins, powered by the CoinGecko API.

**[→ Live Demo](https://cryptogram-six.vercel.app/)**

![Cryptogram app preview](docs/cryptogram-preview.png)

---

## What It Does

Cryptogram pulls live market data from the CoinGecko API and presents it in a browsable dashboard. Users can view a ranked list of coins with current price, market cap, and 24-hour movement, switch the display currency, drill into an individual coin for detailed stats, and read price history through interactive charts and inline sparklines.

## Features

- **Live market data** — coin rankings, prices, and market caps fetched in real time from CoinGecko.
- **Currency switching** — toggle the displayed fiat currency; all values update to match.
- **Per-coin detail pages** — dedicated view for each coin with expanded statistics and a full price chart.
- **Inline sparklines** — compact trend charts on the coin list, color-coded green or red based on whether the coin is up or down over the sampled window.
- **Interactive charts** — historical price visualization built with Recharts, including a modal chart view.
- **Loading states** — skeleton placeholders while data is in flight, for a smooth perceived load.

## Tech Stack

- **React 19** — UI with hooks and the Context API for shared coin/currency state
- **Vite 7** — build tooling and dev server
- **React Router 7** — client-side routing between the home dashboard and coin detail pages
- **Recharts** — line charts and sparkline visualizations
- **react-loading-skeleton** — loading placeholders
- **CoinGecko API** — live cryptocurrency market data
- **Vitest** + **Testing Library** — unit testing
- **Vercel** — deployment (auto-deploys on every push to `main`)

## Testing

Unit-tested with Vitest and Testing Library, covering logic and error handling rather than presentational markup:

- **Sparkline helpers** — downsampling a price series to a clean set of points (always preserving the most recent price) and determining whether a coin's trend is positive, with tests for core cases and boundaries.
- **Data mapping** — the functions that reshape API responses (including the CoinRanking fallback source) into the app's coin-table and coin-detail shapes, with deterministic timestamp handling.
- **Context resilience** — the coin data provider is tested against a failed API response (mocked fetch) to confirm it degrades gracefully: the coin list stays a valid array and a user-friendly error message is surfaced rather than crashing the UI.

All network access in tests is mocked, so the suite never calls the live API.

```bash
npm test
```

The same suite runs in CI on every push and pull request (see the badge above).

## CI/CD

- **CI** — GitHub Actions runs the Vitest suite on every push and pull request (the badge above reflects its status).
- **CD** — Deployment is handled automatically by Vercel, which builds and ships every push to `main`. The CoinGecko API key is configured as a Vercel environment variable rather than committed to the repo.

## Running Locally

```bash
git clone https://github.com/markwaldron7string/cryptogram
cd cryptogram
npm install
```

Create a `.env` file in the project root with your CoinGecko API key:

```
VITE_COINGECKO_KEY=your-key-here
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Note:** The CoinGecko key is read at build time via `import.meta.env`. Because this is a client-side app, treat the key as a public, rate-limited demo key rather than a secret — it is bundled into the deployed front-end. The `.env` file is gitignored to keep it out of source control.

## Available Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm test` — run the Vitest suite once
- `npm run lint` — run ESLint

## License

Private portfolio project.
