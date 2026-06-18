# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- **Foundation + Level 1 — COMPLETE** (public marketplace, multi-role auth with active-role selection, public application reviews, reusable UI + role dashboard shells).
- Next phase target: **Level 2 — Seller stores and product management** (real products replace the dummy catalog).

## Current Goal

- Begin Level 2: Seller store creation (unique store name), product CRUD, and replacing the dummy catalog (`lib/dummy-data.ts`) with database-backed products.

## Completed

### Foundation
- Scaffolded on the existing Next.js 16 (App Router, Turbopack) root project; root-based imports (`@/*` -> `./*`).
- Design system in `app/globals.css`: full shadcn light/dark token set (oklch) with a teal SEAPEDIA primary, semantic `success/warning/info/danger` tokens, radius scale, Geist fonts.
- `next-themes` provider (class-based) + CSS-driven theme toggle; `sonner` toaster.
- shadcn/ui set up manually (CLI hung on a React 19 peer-dep prompt): `components.json`, `lib/utils.ts`, and primitives in `components/ui/*` (button, input, textarea, label, card, badge, separator, skeleton, avatar, sonner, tabs, dialog, dropdown-menu, sheet, select, form). `button/input/textarea` use canonical token classes (no hardcoded `bg-white`).
- Data layer: Prisma 7 + `@prisma/client` with the **pg driver adapter** (`@prisma/adapter-pg`). Connection config lives in `prisma.config.ts` (Prisma 7 removed `url`/`directUrl` from the schema). `lib/db.ts` is the pooled-connection client singleton. `.env.example` documents `DATABASE_URL` (pooled) + `DIRECT_URL` (direct, for migrations) + `AUTH_SECRET`.
- `lib/` services: `auth/password.ts` (bcryptjs), `auth/jwt.ts` (pure jose sign/verify + active-role helper), `auth/session.ts` (httpOnly cookie helpers), `auth/guards.ts` (API role/ownership guards), `auth/page-guards.ts` (redirect guards for server components), `auth/service.ts` (profile shaping), `validation/*` (Zod schemas), `money.ts` (IDR integer + `Rp` formatting), `api.ts` (success/error response shapes + route wrapper), `constants.ts`.

### Level 1
- Schema (`prisma/schema.prisma`): `User`, `UserRole` (multi-role per non-admin user), `ApplicationReview`, `Role` enum. Initial migration committed at `prisma/migrations/0_init`. `prisma/seed.ts` seeds demo accounts (incl. a multi-role user) and sample reviews.
- Auth Route Handlers: `POST /api/auth/register`, `/login`, `/logout`, `GET /api/auth/me`, `POST /api/auth/active-role`. Session = signed JWT (HS256) in an httpOnly cookie carrying `userId` + `activeRole` + owned `roles`.
- RBAC: `proxy.ts` (Next 16's renamed middleware) for coarse auth redirects; server-side enforcement via guards in every protected page (`(dashboard)` layout + per-role pages) and API route. Authorization always follows the server-verified active role.
- Public pages under `app/(public)`: landing, catalog (dummy data), product detail, sign-in, sign-up, select-role.
- Public application reviews: `GET/POST /api/reviews` + review form (rating picker) and list; comments rendered as escaped text (XSS-safe).
- Reusable UI: `Navbar` (guest vs logged-in, theme toggle, user menu with role switcher + logout), `Footer`, mobile nav sheet, `ProductCard`, `RoleBadge`, review components, `RoleSelection`, and Admin/Seller/Buyer/Driver dashboard shells with a wallet/earnings placeholder.

## In Progress

- None.

## Next Up

- Level 2: Seller `Store` model (unique name), `Product` model, seller product CRUD UI + APIs, and DB-backed catalog/detail pages.

## Verification (Foundation + Level 1)

- `npm run build` (Turbopack) and `npm run lint` both pass clean.
- `npx prisma generate` succeeds; initial migration SQL generated offline and committed.
- **Requires a real Supabase database** to run `npm run db:deploy` (or `db:migrate`) and `npm run db:seed` — fill `.env` with Supabase `DATABASE_URL` + `DIRECT_URL` first. The landing page degrades gracefully (empty review list) when no DB is configured.

## Open Questions

- None outstanding. Chosen rules and defaults that the brief left open are recorded in `knowledge.md`.

## Architecture Decisions (locked)

- Full-stack Next.js (App Router); backend implemented as Route Handlers in `app/api`. No separate backend service.
- Database: Supabase PostgreSQL accessed via Prisma ORM (Prisma 7 driver adapter `@prisma/adapter-pg`; config in `prisma.config.ts`).
- Auth: custom JWT/session with bcryptjs; users stored in our own DB. Multi-role ownership with an active-role chosen per session; authorization keyed off the active role and enforced server-side.
- UI: Tailwind v4 + shadcn/ui, mandatory dark + light mode, responsive desktop/mobile.
- Money handled with exact precision (integer rupiah), never floating point.
- Time simulation via a controllable system clock plus an Admin-triggered "simulate next day" action for overdue handling (later level).
- Architect for all 7 levels; build incrementally starting at Level 1.

## Session Notes

- Next.js 16 specifics applied: `cookies()`/`headers()`/`params`/`searchParams` are async; middleware renamed to `proxy.ts` (nodejs runtime); Turbopack + ESLint flat config are default.
- Prisma 7 specifics applied: connection URLs moved out of `schema.prisma` into `prisma.config.ts`; a driver adapter is required on `PrismaClient`. `dotenv/config` is imported in `prisma.config.ts` so the CLI picks up `.env`.
- The reference repo under `repo/` is read-only inspiration and is excluded from `tsconfig` and ESLint.
