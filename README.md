# nodejs-bookshop-web-vite

**Vite + React + TypeScript SPA** bookstore frontend for the layered Mongo API  
[`nodejs-bookshop-layered`](https://github.com/ali-moradi-design/nodejs-bookshop-layered).

> **This is not Next.js.** It is a client-side SPA created with Vite + React Router.  
> The separate Next.js App Router frontend lives in [`nodejs-bookshop-web`](https://github.com/ali-moradi-design/nodejs-bookshop-web).

## Stack

- **Vite** · React 19 · TypeScript (strict) · React Router
- Feature-Sliced Design (`src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities`, `src/shared`)
- Tailwind CSS v4 · shadcn/ui · Kokonut UI registry (`@kokonutui`)
- TanStack Query · TanStack Table
- React Hook Form + Zod
- i18next (`en` + `fa`, RTL) · Vazirmatn / Inter
- 3 named themes (Default, Ocean, Ember) × light/dark
- Zustand (theme/locale/auth prefs)
- Vitest · Playwright · Storybook · husky · lint-staged · rollup-plugin-visualizer

## Prerequisites

1. Run the layered backend on `http://localhost:4000` with CORS origin matching this app (`http://localhost:5173`).
2. Seed admin: `admin@bookstore.local` / `Admin123!`

Example backend CORS (layered `.env`):

```bash
CORS_ORIGIN=http://localhost:5173
PORT=4000
```

## Setup

```bash
pnpm install
cp .env.example .env
# VITE_API_URL=http://localhost:4000
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

| Script           | Description                            |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Vite dev server (port 5173)            |
| `pnpm build`     | Typecheck + production build           |
| `pnpm preview`   | Preview production build               |
| `pnpm typecheck` | `tsc -b`                               |
| `pnpm lint`      | ESLint                                 |
| `pnpm test`      | Vitest unit tests                      |
| `pnpm test:e2e`  | Playwright smoke (app must be running) |
| `pnpm storybook` | Storybook                              |
| `pnpm analyze`   | Bundle visualizer (`dist/stats.html`)  |

## Auth & API

- All API calls use `credentials: 'include'` (httpOnly `accessToken` / `refreshToken` cookies).
- Client refresh interceptor retries once on `401` via `POST /api/v1/auth/refresh`.
- Env: `VITE_API_URL` (default `http://localhost:4000`).

## Themes & i18n

- Theme switcher: Default / Ocean / Ember
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
