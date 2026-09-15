# Feature-Sliced Design (FSD)

This SPA follows FSD layers (top → bottom):

| Layer      | Responsibility                                      | Examples                             |
| ---------- | --------------------------------------------------- | ------------------------------------ |
| `app`      | Providers, router, global styles                    | `app/providers`, `app/router`        |
| `pages`    | Thin route composition                              | `pages/catalog`, `pages/admin/books` |
| `widgets`  | Composite UI blocks                                 | `header`, `home-hero`, `admin-shell` |
| `features` | User interactions (forms, toggles, mutations + UI)  | `auth`, `cart`, `book-filters`       |
| `entities` | Business data, API, query keys, display cards       | `book`, `order`, `cart`              |
| `shared`   | UI kit, api client, config, i18n, domain-free hooks | `shared/ui`, `shared/api`            |

There is **no** `processes` layer unless a multi-page business flow clearly needs one.

## Public API rule

Import **only downward** and **only via each slice’s public API** (`index.ts`):

```ts
// ✅
import { BookCard, fetchBook } from '@/entities/book';
import { AddToCartButton } from '@/features/cart';

// ❌ deep internals
import { fetchBook } from '@/entities/book/api/book-api';
```

Same-layer slices must **not** import each other, except entities via `@x` (below).

## Cross-entity imports (`@x`)

When entity A needs a type from entity B, B exposes it for A:

```
entities/order/@x/cart.ts   → what cart may use from order
entities/book/@x/admin.ts   → what admin may use from book
```

Consumer imports:

```ts
import type { Order } from '@/entities/order/@x/cart';
```

Prefer `@x` over lifting domain types into `shared` unless the type is truly transport-level and shared widely.

## Where new code goes

- **New screen / route** → `pages/<name>` (compose widgets/features; keep thin).
- **Button, form, filter, toggle tied to a use-case** → `features/<name>`.
- **CRUD/API + card for a business noun** → `entities/<name>`.
- **Header, grid, shell, hero** → `widgets/<name>`.
- **Button primitive, cn(), api client, theme tokens** → `shared`.

## Checks

```bash
pnpm check:fsd    # upward / deep / cross-slice / @x violations
pnpm typecheck
pnpm build
```

## Notes

- App layouts compose `Header` / `Footer` and wrap panel/admin with `RequireAuth`.
- Shell widgets only render navigation chrome (no auth redirects).
- Prefer named public-API exports when clarifying intent; `export *` is still used in places.
