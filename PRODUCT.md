# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **In-app personas (fictitious):** bank customers who sign up, open savings/checking accounts, transfer money and review their history; bank operators who recharge any account and consult accounts by id.
- **Real users:** a QA engineer / developer who uses the app to learn React + TypeScript and, later, as the target of a Playwright automation lab. They read the UI closely, inspect the DOM, and need predictable structure and stable locators.

## Product Purpose

Banking Test Lab is a learning and test-automation laboratory shaped as a simple online bank. It consumes an existing Go API (`../accounts_api/go_accounts_api`) and must surface every business rule and error that API defines. Success: every feature and error path is reachable from the UI, and the UI is stable and rich enough to practice every Playwright locator and testing concept.

## Positioning

A realistic but fictitious bank built to be tested: business-grade banking flows (idempotent transfers, overdraft limits, daily recharge caps, login lockout) paired with deliberately testable markup (semantic roles, labels, placeholders, alt/title, `data-testid`, stable CSS/XPath hooks, ARIA state).

## Operating Context

- Customer flows: register → login → create accounts → transfer → view paginated history.
- Operator flows: login → recharge an account by number → consult an account by id.
- Used on desktop and mobile widths; responsive is required.
- Money is integer cents; displayed as `en-US` / `USD` (configurable).

## Capabilities and Constraints

- Stack: pnpm, TypeScript 5.9, React 19, Vite, Tailwind v4, shadcn/ui (radix-nova), React Router, TanStack Query, Zustand, React Hook Form + Zod, native `fetch`.
- UI copy in English; code in English; comments in Spanish.
- Layered architecture enforced by ESLint (see `docs/architecture.md`).
- API errors are shown with the backend's `code` and `message`.
- Operators cannot list accounts (API limitation); only lookup by id and recharge by number.

## Brand Commitments

- Name: **Banking Test Lab**. Own fictitious brand; must not imitate any real bank.
- A discreet indication that this is a test environment.

## Evidence on Hand

- Business rules and error catalogue: `../accounts_api/funcionalidades-y-errores.md`, `../accounts_api/openapi.yaml`.
- No real customers, testimonials, or metrics exist; none may be invented.

## Product Principles

1. Every backend rule and error is visible and verifiable in the UI.
2. Structure is predictable and stable, so locators do not break between iterations.
3. Simple enough to learn from: clear layers, no clever abstractions.
4. Trustworthy, calm banking experience; clarity over decoration.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, visible focus, full keyboard operation, screen-reader labels and live regions for errors.
