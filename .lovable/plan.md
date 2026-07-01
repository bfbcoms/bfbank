# Phase 0 — Bright Future Bank Foundation

Scope is strictly Phase 0. No marketing pages, no onboarding flows, no dashboards beyond empty authenticated shells.

## 1. Design system (`src/styles.css`)

Replace the default shadcn palette with the BFB tokens:

- `--primary` → Gold `#dbb149` (oklch equivalent), `--primary-foreground` → Black
- `--secondary` / `--foreground` → Black `#000000`
- `--background` light → `#FFFFFF`, dark → `#0A0A0A`
- Neutrals: pure white, off-white `#FAFAFA`, deep grays for borders/muted
- `--radius` → `2px` (institutional sharpness); primary Button variant overridden to `rounded-none`
- Add `--font-display` and `--font-sans` → Inter, loaded via `<link>` in `__root.tsx` head (never `@import` a URL in styles.css)
- Tight tracking utility for headings, generous body line-height
- Remove/override any purple/indigo defaults

Add a Button `institutional` variant (sharp corners, gold bg, black text, no shadow) and update `src/components/ui/button.tsx` variants list.

## 2. PWA shell (manifest-only, installable)

Per rules: manifest-only home-screen support unless the user asks for offline. No service worker, no `vite-plugin-pwa`.

- `public/manifest.webmanifest` — name "Bright Future Bank", short_name "BFB", theme `#dbb149`, background `#000000`, `display: standalone`, icons 192/512
- Icons generated (gold "BFB" mark on black) into `public/icons/`
- Head tags in `src/routes/__root.tsx`: `manifest`, `theme-color`, `apple-touch-icon`, real title/description/OG replacing "Lovable App" defaults

## 3. Routing skeleton (shared web + PWA)

Web and PWA share routes and data; only the layout shell differs. Detect PWA via `display-mode: standalone` and swap the shell (bottom-nav on PWA, top-nav on web) inside a single `AppShell` component. No route duplication.

Route files created empty-but-branded (no lorem, no placeholders):

- `src/routes/index.tsx` — minimal branded landing placeholder ("Bright Future Bank" wordmark + tagline; Phase 1 will replace)
- `src/routes/auth.tsx` — sign-in shell (form wiring lands in Phase 2; renders branded empty state now)
- `src/routes/_authenticated/route.tsx` — integration-managed gate (created when Cloud is enabled)
- `src/routes/_authenticated/index.tsx` — authenticated shell placeholder
- `src/routes/admin/route.tsx` + `src/routes/admin/index.tsx` — admin shell gated by `has_role('admin_*')` via server fn; empty branded state

Replace the blank-page placeholder on `/` in the same edit.

## 4. Lovable Cloud + schema

Enable Lovable Cloud, then apply a hardened version of the provided SQL. Corrections required for it to actually work:

- `public.users` conflicts with Supabase's `auth.users` pattern → rename to `public.profiles` with `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`; drop the standalone email/password columns (auth owns those). Keep `full_name`, `account_type`, `status`.
- Roles table restructured per platform rules: `public.app_role` enum (`super_admin`, `compliance`, `support`, `customer`), `public.user_roles(user_id, role)` with a `SECURITY DEFINER` `has_role(_user_id, _role)` function. This prevents privilege escalation and the recursive-RLS bug in the original `admin_users` policy (which self-references and errors at runtime).
- `admin_users` kept as a thin view/table of admin metadata only; all policies check `has_role()`, never `EXISTS (SELECT FROM admin_users...)`.
- All PKs use `gen_random_uuid()` (pgcrypto, standard) instead of `uuid_generate_v4()`.
- Every `public.*` table gets explicit `GRANT` statements (authenticated + service_role; anon only where policies allow) — required by PostgREST.
- RLS enabled AFTER `CREATE TABLE` and BEFORE `CREATE POLICY` (the original ordering ran `ALTER … ENABLE RLS` before the tables existed).
- Tables covered: `profiles`, `app_role` enum, `user_roles`, `admin_users`, `audit_logs`, `user_devices`, `otp_requests`, `email_templates`, `notification_logs`.
- Audit-log append-only enforced: no UPDATE/DELETE policies; INSERT via service_role only from server fns.

## 5. Auth wiring

- Register `attachSupabaseAuth` in `src/start.ts` `functionMiddleware` (bearer token attach)
- `onAuthStateChange` in `__root.tsx` filtered to SIGNED_IN/OUT/USER_UPDATED
- `_authenticated/route.tsx` uses the integration-managed layout

## 6. Verification (E2E per workspace rule)

After build:
- `tsgo` typecheck passes
- Manual Playwright smoke: `/`, `/auth`, `/_authenticated` redirects to `/auth` when signed out, admin route 403s for non-admins
- Schema verified with `psql` — every table exists, RLS is on, `has_role()` returns expected values

## What is explicitly NOT in Phase 0

Marketing pages, KYC/KYB flows, onboarding, transactions, cards, wallets, email/SMS provider integrations, admin CRUD screens beyond the empty gated shell. Those are Phases 1+.

## Flags requiring your decision before I start

1. **Icon/logo**: I'll generate a minimalist gold "BFB" monogram on black for the PWA icons unless you have a brand asset to upload.
2. **Font**: Inter via Google Fonts `<link>` (free, matches spec). Geist requires self-hosting `.woff2` files — say the word and I'll switch.
3. **Auth providers**: Workspace rules say regulated fintech → email/password + optional Google. Phase 0 only stubs the route; actual provider config lands with Phase 2. OK to defer?
