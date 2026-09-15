# nodejs-bookshop-web-vite

**Vite + React + TypeScript SPA** bookstore frontend for the layered Mongo API  
[`nodejs-bookshop-layered`](https://github.com/ali-moradi-design/nodejs-bookshop-layered).

> **This is not Next.js.** It is a client-side SPA created with Vite + React Router.  
> The separate Next.js App Router frontend lives in [`nodejs-bookshop-web`](https://github.com/ali-moradi-design/nodejs-bookshop-web).

## Stack

- **Vite** · React 19 · TypeScript (strict) · React Router
- Feature-Sliced Design (`src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`)
- Architecture guide: [`docs/fsd.md`](./docs/fsd.md) · `pnpm check:fsd`
- Tailwind CSS v4 · shadcn/ui · Kokonut UI registry (`@kokonutui`)
- TanStack Query · TanStack Table
- React Hook Form + Zod
- i18next (`en` + `fa`, RTL) · Vazirmatn / Inter
- 3 named themes (Default, Desert, Rosy) × light/dark
- Zustand (theme/locale/auth prefs)
- Vitest · Playwright · Storybook · husky · lint-staged · rollup-plugin-visualizer

## Prerequisites

1. Run the layered backend on `http://localhost:4000`.
2. Seed admin: `admin@bookstore.local` / `Admin123!`

Local `pnpm dev` uses the **Vite proxy** (`/api` and `/uploads` → `http://localhost:4000`), so leave `VITE_API_URL` empty to avoid CORS. Direct cross-origin calls still need backend CORS (e.g. `CORS_ORIGIN=http://localhost:5173`).

Example backend CORS when not using the proxy (layered `.env`):

```bash
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
PORT=4000
```

## Setup

```bash
pnpm install
cp .env.example .env
# Leave VITE_API_URL empty to use the Vite proxy (recommended for local dev).
# Set VITE_API_URL=http://localhost:4000 only for direct cross-origin API calls.
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Run with layered backend

```bash
# terminal 1 — API
cd ../nodejs-bookshop-layered
npm run dev   # or: npm start after build
# ensure Mongo is up and seed once: npm run seed

# terminal 2 — this Vite SPA
cd ../nodejs-bookshop-web-vite
pnpm install && pnpm dev
```

## Scripts

| Script                    | Description                                  |
| ------------------------- | -------------------------------------------- |
| `pnpm dev`                | Vite dev server (port 5173)                  |
| `pnpm build`              | Typecheck + production build                 |
| `pnpm preview`            | Preview production build                     |
| `pnpm typecheck`          | `tsc -b`                                     |
| `pnpm lint`               | ESLint                                       |
| `pnpm test`               | Vitest unit tests                            |
| `pnpm test:e2e`           | Playwright smoke (app must be on :5173)      |
| `pnpm playwright:install` | Optional bundled Chromium (needs CDN access) |
| `pnpm storybook`          | Storybook                                    |
| `pnpm analyze`            | Bundle visualizer (`dist/stats.html`)        |

## Auth & API

- All API calls use `credentials: 'include'` (httpOnly `accessToken` / `refreshToken` cookies).
- Client refresh interceptor retries once on `401` via `POST /api/v1/auth/refresh`.
- Env: `VITE_API_URL` — leave empty in local `pnpm dev` to use same-origin paths (`/api/v1`, `/uploads`) via the Vite proxy (no CORS). Set to `http://localhost:4000` only for direct cross-origin calls. Production builds with an empty/unset URL fall back to `http://localhost:4000`.

## E2E (Playwright)

Smoke tests use your **installed Google Chrome** by default (`channel: 'chrome'`), so you do **not** need `playwright install`. That download hits `cdn.playwright.dev`, which returns **403** in some regions.

```bash
pnpm dev                  # app must be on http://localhost:5173
pnpm test:e2e
```

If Chrome is not installed but Edge is:

```powershell
$env:PLAYWRIGHT_CHANNEL="msedge"
pnpm test:e2e
```

Optional: install Playwright’s bundled Chromium only if you have a working VPN/proxy to the CDN (`pnpm playwright:install`).

With an empty `VITE_API_URL`, browser requests go to the Vite origin and are proxied to the API — no CORS setup needed for local e2e. If you set `VITE_API_URL` to the API host, ensure backend `CORS_ORIGIN` includes `http://localhost:5173`.

## Themes & i18n

- Theme switcher: Default (Dusty Olive) / Desert / Rosy
- Mode: light / dark
- Language: EN / FA (RTL + Vazirmatn when FA)
- Preferences persist in `localStorage` via Zustand

## Panels

- **Storefront**: home (featured), catalog (search/filters/pagination), book detail + reviews, cart, checkout
- **User panel** (`/panel`): dashboard, profile, orders (+ pay), favorites, my reviews, issue report
- **Admin** (`/admin`): dashboard KPIs, books CRUD + cover upload, orders status, users, roles, permissions, discounts, issue reports, analytics (lazy-loaded)

## FSD layout

```
src/
  app/          # providers, React Router, global styles
  pages/        # FSD pages composed into routes
  widgets/      # shells, grids, tables, KPIs
  features/     # auth, theme/locale switchers, …
  entities/     # book, user, cart, order, …
  shared/       # api client, ui, i18n, config
```

## Kokonut UI

Registry configured in `components.json`:

```bash
pnpm dlx shadcn@latest add @kokonutui/button
```

## License

MIT
