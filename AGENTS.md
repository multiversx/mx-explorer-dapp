# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

---

## Project

MultiversX Blockchain Explorer — a React + Redux Toolkit SPA for browsing the MultiversX Network (mainnet, testnet, devnet). Built with Vite, deployed at `explorer.multiversx.com`.

---

## Commands

```bash
yarn                       # install dependencies (uses yarn, not npm/pnpm)

# Dev — must pick a network config before starting:
cp src/config/config.devnet.ts src/config/index.ts
npm run start-devnet       # copies config + starts dev server → https://localhost:3002

npm run start-mainnet      # mainnet
npm run start-testnet      # testnet

# Build
npm run build-devnet
npm run build-mainnet

# Lint (zero warnings policy)
npm run lint               # eslint src --max-warnings 0

# E2E tests (Cypress, runs against integration-explorer.multiversx.com)
node scripts/cypress.ts    # or: npm run cy:run — full suite + mochawesome report

# Single spec / single test (bypasses the report wrapper):
npx cypress run --spec cypress/e2e/Search/Search.cy.ts
npx cypress open           # interactive runner
```

Cypress hits the deployed `baseUrl` in `cypress.config.ts`, not your local dev server — no local build is needed to run E2E, but a network connection is.

`src/config/index.ts` **must exist** before starting. The `start-*` scripts create it automatically via the `copy-*-config` step, but if you run `npm run start` directly you need it manually.

HTTPS is enabled by default (self-signed cert via `@vitejs/plugin-basic-ssl`). Set `VITE_APP_USE_HTTPS=false` to disable.

---

## Architecture

### Entry & Routing

`src/index.tsx` mounts `<HelmetProvider>` → `App.tsx`. The root route element (`ProviderApp` in `src/App.tsx`) wraps the tree in Redux `<Provider>` + `<Interceptor>`.

The router itself is created in `src/App.tsx` with React Router v7 `createBrowserRouter`; the route definitions it consumes live in `src/routes/routes.tsx`. Every network has its routes prefixed with `/:network/` (e.g. `/devnet/blocks/...`). `generateNetworkRoutes` in `src/routes/helpers/` iterates `networks` from config and wraps routes per network. The `Layout` component (`src/layouts/Layout/`) is the shell that renders the header, hero stats widgets, and footer around page content.

### Network Configuration

`src/config/index.ts` exports `networks: NetworkType[]` — an array of network definitions (id, apiAddress, chainId, adapter, websocket URL, etc.). The active network is stored in Redux (`networksSlice`) and selected via `activeNetworkSelector`. Switching networks dispatches `changeNetwork`.

### Data Fetching — Adapter Pattern

`useAdapter()` (`src/hooks/adapter/useAdapter.ts`) is the single entry point for all API calls. It aggregates domain-specific request hooks (blocks, transactions, accounts, tokens, validators, etc.) and exposes them as a flat object. Internally `useAdapterConfig` reads the active network's `adapter` field (`'api'` or `'elastic'`) and routes calls through the corresponding provider.

All API responses are wrapped by `useAdapterConfig`'s `wrap()` function and return `{ data, success: boolean }` — never throw. Always check `success` before using `data`.

### Polling Loop

`useLoopManager` (`src/hooks/layout/`) runs a `setInterval` that dispatches `triggerRefresh()` on the Redux `refreshSlice`. This updates `timestamp` in the store. Page-level hooks react to `timestamp` from `refreshSelector` to re-fetch data. The poll interval adapts to the API's `refreshRate` (from stats) — typically 6000ms, drops to 600ms after Supernova.

### Websocket (Optional)

When the network config includes `updatesWebsocketUrl`, a Socket.IO connection is established via `useInitWebsocket`. Components that want real-time updates call `useRegisterWebsocketListener` with a subscription name and event handler. Stats updates are the primary websocket consumer — when active, the polling loop defers to websocket events instead.

### Redux Store

`src/redux/store.ts` is a plain Redux Toolkit `configureStore` with no middleware overrides. The root reducer is in `src/redux/reducers.ts`. Selectors use `reselect` and live in `src/redux/selectors/`.

**There is no persistence.** Nothing is written to localStorage by the store and state is rebuilt from the API on every load. `redux-persist` is still listed in `package.json` but is never imported anywhere in `src/`. The names in `reducers.ts` are leftovers from a persistence setup that was removed: `customIgnoredSlices` is simply every slice in the app, `asyncIgnoredSlices` is an empty object, and the exported `ignoredSliceNames` has no remaining callers. Treat all three as vestigial rather than as a persistence allow/deny list.

Key slices:

- `statsSlice` — network stats with `unprocessed` (raw numbers) and `stats` (formatted strings for display)
- `networksSlice` — `activeNetwork` and `defaultNetwork`
- `refreshSlice` — `timestamp` used as the global polling trigger
- Page-specific data slices: `blocks`, `transactions`, `account`, `token`, `nft`, etc.

### Stats Data Pattern

`StatsType` → `ExtendedStatsType` (adds epoch timing) → `ProcessedStatsType` (formatted strings). The `setStats` reducer runs `getExtraStats()` and `processStats()` on every stats update and stores both raw (`unprocessed`) and display-ready (`stats`) values. Always read from `unprocessed` for calculations and from `stats` for display.

### Components vs Widgets

- `src/components/` — reusable presentational components (tables, badges, format utilities, etc.)
- `src/widgets/` — higher-level stateful widgets that wire up Redux and hooks (e.g. `EpochProgressRing`, `BlockHeightStatsCard`, `HeroHome`)
- `src/layouts/` — page-shell layouts (account layout, collection layout, etc.)
- `src/pages/` — route-level page components

### Helpers

`src/helpers/` contains pure utility functions organized by category:

- `formatValue/` — number/token/duration formatting
- `getValue/` — computed value helpers (e.g. `getProgressStepInterval`)
- `processData/` — data transformation (`processStats`, `getExtraStats`)
- `isCondition/`, `hasCondition/` — predicate helpers

### Icons

Free FontAwesome icons are used by default (`npm run prepare-free-icons`, run automatically by `yarn` via `prepare`). Pro icons require a FontAwesome npm token. Icon sets live in `src/icons/` with a generated `index.ts` per variant.

---

## Key Conventions

**`ELLIPSIS` constant** — `'...'` used as loading placeholder before data arrives. Components check `isDataReady` or pass `showEllipsisIfZero` to format helpers.

**Named exports only** — All components and hooks use named arrow function exports (`export const Foo = () => ...`). No default exports.

**`useAdapter()` is always the API call point** — Never call `axios` or fetch directly in components or hooks. Go through `useAdapter()`.

**BigNumber.js** — All numeric calculations use `BigNumber` from `bignumber.js`. Never use plain JS arithmetic on chain values. Use `.toNumber()` / `.toFormat()` only for final display.

**Import order** — ESLint enforces: React → external packages → internal (alphabetized). The `import/order` rule is set to `warn`.
