# Banking Test Lab (frontend)

Simple banking web app to learn React and TypeScript with a layered architecture. It is also the target application of a future, separate Playwright automation project. It consumes the Go API in `../accounts_api/go_accounts_api`.

- Architecture and stack: [docs/architecture.md](docs/architecture.md)
- Iteration plan: [docs/iteration-plan.md](docs/iteration-plan.md)
- Product context (used by the design skill): [PRODUCT.md](PRODUCT.md)

## Features

| Role     | Feature                                                                   | Route                        |
| -------- | ------------------------------------------------------------------------- | ---------------------------- |
| Guest    | Sign up, sign in (with 429 lockout countdown)                             | `/register`, `/login`        |
| Customer | Dashboard: selected account, recent movements, all accounts, open account | `/accounts`                  |
| Customer | Account detail with paginated history (20 per page)                       | `/accounts/:id?page=N`       |
| Customer | Transfer with review step and `Idempotency-Key`                           | `/transfer?from=<accountId>` |
| Operator | Recharge any account by number, receipt, find account by id               | `/operator`                  |
| Operator | Account detail and history (read only)                                    | `/operator/accounts/:id`     |
| Everyone | Light, dark and system theme · 404 page · error screen                    | —                            |

All API errors are shown with the backend `code` and `message` (validation errors under their field, business errors in an alert). Server and network errors also show a global toast.

## Requirements

- Node.js 22+
- pnpm
- The Go API running on `http://localhost:3000` (see its own README; it needs PostgreSQL via `docker compose`)

## Getting started

```bash
# 1. Start the API (in ../accounts_api/go_accounts_api, following its README)

# 2. Install dependencies
pnpm install

# 3. Start the frontend on http://localhost:5173
pnpm dev
```

The Vite dev server proxies `/api/*` to the API and strips the prefix (`/api/accounts` → `http://localhost:3000/accounts`), because the API does not enable CORS. To point to another API URL:

```bash
API_TARGET=http://localhost:4000 pnpm dev
```

## Test users

| Role     | Email                 | Password            | How it is created                |
| -------- | --------------------- | ------------------- | -------------------------------- |
| Operator | `operator@bank.local` | `Operator2026!`     | API seed (`seeds/operators.sql`) |
| Customer | any                   | 8 to 128 characters | Sign up at `/register`           |

A new customer starts without accounts. To get money to transfer: open an account, then sign in as the operator and recharge it by its account number (max 5 recharges and $3,000,000.00 per account per day; cash up to $3,000.00 each). Checking accounts can also go down to -$5,000.00.

## Scripts

| Script           | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `pnpm dev`       | Development server                                    |
| `pnpm build`     | Type check and production build                       |
| `pnpm preview`   | Serve the production build                            |
| `pnpm typecheck` | TypeScript check only                                 |
| `pnpm lint`      | ESLint, including the layer boundaries rule           |
| `pnpm format`    | Format with Prettier                                  |
| `pnpm test`      | Unit tests with Vitest (`pnpm test:watch` to watch)   |
| `pnpm gen:api`   | Regenerate `src/lib/api-types.ts` from `openapi.yaml` |

## Project structure

```
src/
├─ app/         # providers, router, layouts, route guards
├─ pages/       # one page per route
├─ components/  # ui/ (shadcn) and shared/ (MoneyText, EmptyState, AmountInput...)
├─ features/    # auth, accounts, movements, transfers, recharge
│  └─ <feature>/components · hooks · services · api · types.ts · schemas.ts
├─ lib/         # http client, errors, money, dates, query keys, generated API types
├─ store/       # Zustand session store
├─ config/      # env, routes, business limits, money format
└─ test/        # Vitest setup and helpers
```

`pnpm lint` fails when a layer imports a higher one (for example, `lib` importing a page) or when one feature imports another feature's components, hooks, services or API. Features may only share each other's domain files (`types.ts`, `balance.ts`...).

## Testability

The UI is built so every Playwright locator strategy can be practiced: semantic roles, labels, placeholders, `alt` and `title`, `data-testid` on dynamic elements, stable CSS classes and predictable markup for XPath, and ARIA state attributes (`aria-invalid`, `aria-busy`, `aria-pressed`, `aria-current`). See the locator guide in [docs/architecture.md](docs/architecture.md).
