# Bank Lab (frontend)

Simple banking web app to learn React and TypeScript with a layered architecture. It consumes the Go API in `../accounts_api/go_accounts_api`.

- Architecture and stack: [docs/architecture.md](docs/architecture.md)
- Iteration plan: [docs/iteration-plan.md](docs/iteration-plan.md)

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
├─ app/         # providers, router, layouts
├─ pages/       # one page per route
├─ components/  # ui/ (shadcn) and shared/
├─ features/    # auth, accounts, transfers, movements, recharge
├─ lib/         # http client, errors, formatting, generated API types
├─ store/       # Zustand stores
├─ config/      # env, routes, limits
└─ test/        # Vitest setup
```

Importing from a higher layer (for example, `lib` importing a page) fails `pnpm lint`.
