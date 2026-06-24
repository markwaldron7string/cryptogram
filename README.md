![CI](https://github.com/markwaldron7string/cryptogram/actions/workflows/ci.yml/badge.svg)
![E2E](https://github.com/markwaldron7string/cryptogram/actions/workflows/cypress.yml/badge.svg)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Vitest](https://img.shields.io/badge/Unit-Vitest-6e9f18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Cypress](https://img.shields.io/badge/E2E-Cypress-17202C?logo=cypress&logoColor=white)](https://cypress.io)
[![CoinGecko](https://img.shields.io/badge/Data-CoinGecko-8DC647?logo=coingecko&logoColor=white)](https://coingecko.com)
[![Vercel](https://img.shields.io/badge/Live-Vercel-000000?logo=vercel&logoColor=white)](https://cryptogram-six.vercel.app/)

# Cryptogram

> A real-time cryptocurrency market dashboard — live prices, sparklines, interactive charts, and global market stats for 750+ assets. Portfolio demo project, not financial advice.

**[→ Live Demo](https://cryptogram-six.vercel.app/)**

![Cryptogram homepage — live market dashboard with stats bar, searchable coin table, sparklines, and cyan tech UI](docs/cryptogram-preview.png)

---

## What It Does

Cryptogram pulls live market data from the CoinGecko API and presents it in a fast, responsive dashboard. Browse ranked coins with prices, 24h movement, and 7-day sparklines; drill into individual assets for multi-timeframe charts; compare up to three coins side-by-side; and track favorites in a persistent watchlist.

Built as a portfolio piece to demonstrate modern React patterns, API integration, error handling, and test coverage — not a commercial product.

## Features

| Area | Highlights |
|------|------------|
| **Markets** | 750+ coins (paginated CoinGecko fetch), global stats bar, instant search, gainers/losers/watchlist tabs |
| **Table UX** | Configurable page size (25 / 50 / 100), arrow pagination, horizontal scroll with nav arrows |
| **Charts** | Recharts sparklines + full charts; modal quick-view; detail page with 24H–1Y timeframes |
| **Compare** | Normalized 30-day overlay chart for up to 3 coins |
| **Watchlist** | Star coins; persisted in `localStorage` |
| **Currencies** | 30 fiat options (USD, EUR, GBP, JPY, …) |
| **Polish** | Dark/light theme, auto-refresh every 60s, skeleton loading, animated grid background |
| **Resilience** | Vercel serverless proxy + CoinRanking fallback; retries without bad API keys |

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 19, Context API, CSS custom properties |
| Build | Vite 7 |
| Routing | React Router 7 (`BrowserRouter`) |
| Charts | Recharts 3 |
| Data | CoinGecko API v3 (+ CoinRanking fallback) |
| Deploy | Vercel (SPA rewrites + `/api/coingecko` proxy) |
| Unit tests | Vitest + Testing Library |
| E2E tests | Cypress 15 |
| CI | GitHub Actions (lint, unit, E2E) |

## Project Structure

```
src/
├── components/     # Navbar, Sparkline, ChartModal, MarketStats, …
├── context/        # CoinContext, ThemeContext, WatchlistContext
├── pages/          # Home, Coin, Compare, About
├── utils/          # fetchCoinGecko, formatters, currencies
api/
├── coingeckoHandler.js   # Shared proxy + fallback logic
└── coingecko.js          # Vercel serverless entry
cypress/e2e/        # Smoke, navigation, and README screenshot specs
```

## Testing

All tests run without hitting live APIs — network calls are mocked in unit tests and intercepted in Cypress.

| Command | What it runs |
|---------|--------------|
| `npm test` | Vitest — 19 unit tests (formatters, sparkline helpers, API mapping, context, currencies) |
| `npm run test:e2e` | Cypress — 7 E2E tests (smoke, search, modal, routing, tabs, screenshot) |
| `npm run lint` | ESLint across `src/`, `api/`, and `cypress/` |

**CI** (on every push/PR to `main`): lint + Vitest  
**E2E** (on every push/PR to `main`): production build + Cypress against preview server

```bash
npm test              # unit tests
npm run lint          # eslint
npm run build && npm run test:e2e   # full E2E (needs preview on :4173)
```

## Running Locally

```bash
git clone https://github.com/markwaldron7string/cryptogram
cd cryptogram
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### API key (optional)

CoinGecko works without a key via the built-in dev proxy. For higher rate limits, add a `.env` file:

```
VITE_COINGECKO_KEY=your-demo-api-key
```

The key is used **server-side** by the Vite dev middleware and Vercel proxy — it is not required for the app to function. Invalid keys are automatically retried without authentication.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with live API proxy |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest once |
| `npm run test:e2e` | Run Cypress headless |
| `npm run lint` | Run ESLint |

## CI/CD

- **CI** — ESLint + Vitest on every push and pull request
- **E2E** — Cypress against a production build on every push and PR
- **CD** — Vercel auto-deploys `main`; set `COINGECKO_API_KEY` or `VITE_COINGECKO_KEY` in Vercel env for production rate limits

---

## Interview Talking Points

Use these as starting points — adapt them to your own voice. You don't need to know every detail cold; focus on the *why* behind each decision.

### Elevator pitch (30 seconds)

> "Cryptogram is a crypto market dashboard I built to practice real-world React. It fetches live data from CoinGecko, handles API failures gracefully, and includes unit and E2E tests. I started it as a bootcamp project and rebuilt it into something I'd be proud to show in a portfolio review."

### Architecture & state

- **"I used React Context for shared state — coins, currency, theme, watchlist — because the app is small enough that Redux would be overkill, but multiple pages still need the same data."**
- **"Currency and theme persist user preference; the watchlist uses `localStorage` so there's no backend needed for a demo."**
- **"I separated pure utilities (`formatters`, `sparklineData`, `currencies`) from components so the logic is easy to unit test without rendering UI."**

### API & error handling

- **"All client requests go through `/api/coingecko` — locally via a Vite middleware, in production via a Vercel serverless function. That keeps the API key off the client and lets me add fallback logic in one place."**
- **"If CoinGecko fails, I fall back to CoinRanking and map their response into the same shape my UI expects — so the user still sees data instead of a blank screen."**
- **"I learned the hard way that sending an invalid API key causes 401 errors; I fixed it by validating the key length and retrying without auth, since CoinGecko's public tier works without a key."**
- **"Global market stats are fetched separately from the coin list so a failure on one endpoint doesn't break the entire page."**

### UX decisions

- **"I fetch up to 750 coins in parallel (3 × 250 per CoinGecko's max) and paginate client-side so search and tabs feel instant."**
- **"Auto-refresh runs every 60 seconds but only shows the skeleton on the first load — existing data stays visible during background sync."**
- **"The compare page normalizes prices to percentage change so you can overlay Bitcoin and Ethereum on one chart even though their absolute prices are very different."**

### Testing

- **"Unit tests cover the 'boring but important' stuff — data mapping, sparkline math, and what happens when the API returns an error object instead of an array."**
- **"Cypress tests intercept network calls with fixtures so CI never depends on CoinGecko being up or rate-limiting us."**
- **"I added lint to CI after hitting React hooks warnings locally — catching those before merge saves review time."**

### What you'd improve next (shows growth mindset)

- **"I'd add code-splitting for Recharts to shrink the main bundle — it's the biggest chunk right now."**
- **"WebSocket or SSE for true tick-by-tick prices would be the next step for a production app."**
- **"I'd extract the table into a virtualized list if I needed to render thousands of rows without pagination."**

### Honest "still learning" framings

- **"I'm comfortable reading API docs and debugging network issues — the CoinGecko key bug taught me to always check what's actually being sent in the request."**
- **"I'm still building intuition for when to reach for Context vs. local state, but this project helped me draw the line: global user preferences and fetched data go in Context; form inputs and modals stay local."**
- **"Writing tests before felt intimidating; now I start with the pure functions because they're fast to test and give me confidence when I refactor UI."**

---

## License

Private portfolio project — not licensed for commercial use.
