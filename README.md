# Bright Future Bank

Cross-border banking platform providing multi-currency accounts, international
transfers, card issuance and institutional compliance tooling. The repository
contains the customer web application, installable PWA and the internal
operations console served from a single TanStack Start codebase.

## Stack

- **Framework** — TanStack Start (React 19, Vite 7)
- **Routing** — TanStack Router with typed, file-based routes under `src/routes`
- **Styling** — Tailwind CSS v4 with a project-owned design system in `src/styles.css`
- **State / data** — TanStack Query
- **Backend** — Supabase (Postgres, Row Level Security, Auth, Storage, Edge)
- **Payments / FX** — Nium API (server-side, via typed server functions)
- **KYC / KYB** — Didit (webhook-verified with HMAC and idempotency)
- **Testing** — Vitest (unit / component), Playwright (end-to-end)

## Getting started

```bash
bun install
bun run dev
```

The dev server listens on `http://localhost:8080`. Environment variables are
loaded from `.env`; see `Environment` below for the required keys.

## Scripts

| Command             | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| `bun run dev`       | Start the local dev server with HMR                      |
| `bun run build`     | Produce a production build                               |
| `bun run preview`   | Serve the production build locally                       |
| `bun run test`      | Run the unit / component test suite (Vitest)             |
| `bun run test:watch`| Run Vitest in watch mode                                 |
| `bun run lint`      | Lint sources                                             |
| `bun run format`    | Format sources with Prettier                             |

## Environment

Public values ship in `.env` with the `VITE_` prefix and are safe to expose to
the browser. Server-only secrets are stored in the backend secret manager and
must never be written to source control.

Required public variables:

| Variable                     | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| `VITE_PUBLIC_SITE_URL`       | Canonical public origin, no trailing slash          |
| `VITE_SUPPORT_EMAIL`         | Customer-facing support address                     |
| `VITE_SUPABASE_URL`          | Supabase project URL                                |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key                  |

Required server-only secrets (managed outside the repo):

- `SUPABASE_SERVICE_ROLE_KEY`
- `NIUM_API_KEY`, `NIUM_CLIENT_HASH_ID`
- `DIDIT_BASE_URL`, `DIDIT_WEBHOOK_SECRET`, `DIDIT_MOCK_MODE`

## Architecture

```
src/
  routes/                File-based routes (public, /app/*, /admin/*, /api/*)
  layouts/               Shell layouts for web, PWA and admin surfaces
  components/            Reusable UI (marketing/, ui/ shadcn primitives, etc.)
  lib/                   Domain logic, server functions, telemetry, helpers
  integrations/supabase/ Generated client, typed schema, auth middleware
  pwa/                   Service-worker registration
  hooks/                 Cross-cutting React hooks
supabase/                Database migrations, config and RLS policies
tests/                   Playwright end-to-end suites
```

Server-only code lives in `*.server.ts` files or under `src/routes/api/`;
those files are excluded from the client bundle by the bundler's import
protection. Server functions authored with `createServerFn` provide typed RPC
to the client; public HTTP endpoints (webhooks, cron) live under
`src/routes/api/public/*` and must authenticate their callers.

## Security

- Row Level Security is enabled on every application table and every table
  carries explicit grants; `service_role` is the only role permitted to write
  to append-only audit tables.
- Role checks use the security-definer `public.has_role(user_id, role)`
  function so RLS policies never self-reference.
- Webhooks verify an HMAC signature over the raw request body with a
  timing-safe compare, then deduplicate by event id.
- Client input is validated with Zod on both sides of the network boundary.

## Testing

Unit tests live next to the code they exercise (`*.test.ts[x]`). End-to-end
flows (authentication, onboarding, KYC review) live under `tests/e2e/`.

## Deployment

Production builds are Cloudflare Worker–compatible. Any package that assumes
a full Node runtime is unsupported; prefer Web-standard APIs, fetch-based
SDKs or WASM variants intended for the edge.

## License

Proprietary. All rights reserved.
