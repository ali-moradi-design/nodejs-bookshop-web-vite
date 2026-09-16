# Feature-Sliced Design (FSD)

This SPA follows FSD layers (top → bottom):

| Layer      | Responsibility                                      | Examples                               |
| ---------- | --------------------------------------------------- | -------------------------------------- |
| `app`      | Providers, router, global styles                    | `app/providers`, `app/router`          |
| `pages`    | Thin route composition                              | `pages/catalog`, `pages/admin/books`   |
| `widgets`  | Composite UI blocks                                 | `header`, `book-detail`, `cart-panel`  |
| `features` | User interactions (forms, toggles, mutations + UI)  | `auth`, `cart`, `pay-order`, `reviews` |
| `entities` | Business data, API, query keys, display cards       | `book`, `order`, `cart`                |
| `shared`   | UI kit, api client, config, i18n, domain-free hooks | `shared/ui`, `shared/api`              |

There is **no** `processes` layer unless a multi-page business flow clearly needs one.

## Public API rule

Import **only downward** and **only via each slice’s public API** (`index.ts`):

```ts
// ✅
import { BookCard, fetchBook } from '@/entities/book';
import { AddToCartButton } from '@/features/cart';
import { LoveRating } from '@/features/reviews';

// ❌ deep internals
import { fetchBook } from '@/entities/book/api/book-api';
```

Public APIs use **named exports** (not `export *`) so the surface is intentional.

Same-layer slices must **not** import each other, except entities via `@x` (below).

## Cross-entity imports (`@x`)

When entity A needs a type from entity B, B exposes it for A:

```
entities/order/@x/cart.ts   → what cart may use from order
entities/order/@x/admin.ts  → what admin may use from order
entities/book/@x/admin.ts   → what admin may use from book
```

Consumer imports:

```ts
import type { Order } from '@/entities/order/@x/cart';
```

Prefer `@x` over lifting domain types into `shared` unless the type is truly transport-level and shared widely.

## Where new code goes

- **New screen / route** → `pages/<name>` (compose widgets/features; keep thin).
- **Button, form, filter, toggle, payment action** → `features/<name>`.
- **CRUD/API + query hooks + card for a business noun** → `entities/<name>`.
  - Prefer **queries** on entities; **mutations with UX (toast/forms)** on features.
- **Header, grid, shell, hero, composed detail/cart panels** → `widgets/<name>`.
- **Button primitive, cn(), api client, theme tokens** → `shared`.

## Current slice map

### `features/`

| Slice                                | Role                                            |
| ------------------------------------ | ----------------------------------------------- |
| `auth`                               | Login/register forms, `RequireAuth`, auth store |
| `cart`                               | Add/update/remove/clear cart actions + badge    |
| `checkout`                           | Checkout form + mutation                        |
| `pay-order`                          | Pay pending order button + mutation             |
| `favorites`                          | Favorite toggle/remove                          |
| `reviews`                            | Create/update review, `LoveRating`, review list |
| `book-filters`                       | Catalog filters, chips, `useCatalogBooks`       |
| `book-search`                        | Header search                                   |
| `profile`                            | Profile form                                    |
| `reports`                            | User issue form                                 |
| `recently-viewed`                    | Local recent books tracking                     |
| `locale-switcher` / `theme-switcher` | Chrome controls                                 |
| `admin-*`                            | Admin CRUD panels (books, orders, users, …)     |

### `entities/`

`admin`, `book`, `cart`, `discount`, `favorite`, `order`, `permission`, `report`, `review`, `role`, `user` — types, API helpers, query keys, `use*Query` hooks, entity UI (e.g. `BookCard`).

### `widgets/`

`header`, `footer`, `home-hero`, `storefront-shell`, `panel-shell`, `admin-shell`, `book-grid`, `book-detail`, `cart-panel`, `recently-viewed`, `kpi-cards`, `admin-charts`.

### `pages/`

Storefront: `home`, `catalog`, `book-detail`, `cart`, `checkout`, `login`, `register`.  
Panel: `panel/dashboard`, `orders`, `order-detail`, `favorites`, `reviews`, `profile`, `report`.  
Admin: `admin/dashboard`, `books`, `orders`, `users`, `roles`, `permissions`, `discounts`, `reports`, `analytics`.

## Checks

```bash
pnpm check:fsd    # upward / deep / cross-slice / @x violations
pnpm typecheck
pnpm test
pnpm build
```

## Notes

- App layouts compose `Header` / `Footer` and wrap panel/admin with `RequireAuth`.
- Shell widgets only render navigation chrome (no auth redirects).
- Mutations that are user actions (pay, add to cart, review) live in **features**; raw `payOrder` API stays on the entity.
- Preserve Niko branding, theme tokens (Pine / Amethyst / Terracotta), cart sheet, and heart ratings when refactoring.
