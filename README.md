# SEAPEDIA

A multi-role marketplace (COMPFEST 18 Software Engineering Academy task) connecting
**buyers, sellers, and drivers** in one place. Built full-stack with Next.js App
Router, Route Handlers, Prisma + Supabase PostgreSQL, custom JWT/bcrypt auth, and
shadcn/ui + Tailwind CSS v4.

This repository currently implements **Foundation through Level 4**: the public
marketplace, multi-role authentication, seller store/product management, buyer
wallet, cart (single-store), checkout with vouchers/promos and PPN 12%, seller
order processing, and spending/income reports.

## Tech stack

- **Next.js 16** (App Router, Turbopack, Route Handlers) + **React 19**
- **Prisma 7** ORM with the **pg driver adapter** → **Supabase PostgreSQL**
- Custom auth: **bcryptjs** password hashing + **jose** JWT in an httpOnly cookie
- **Zod** validation, **Tailwind CSS v4**, **shadcn/ui**, **next-themes** (dark/light)

## Prerequisites

- Node.js 20.9+ (LTS) and npm
- A Supabase project (free tier works) for PostgreSQL

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from the template and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — Supabase **pooled** connection (port 6543, `?pgbouncer=true`). Used at runtime.
   - `DIRECT_URL` — Supabase **direct** connection (port 5432). Used by Prisma Migrate.
   - `AUTH_SECRET` — a long random string (`openssl rand -base64 48`).

3. Apply the database schema and seed demo data:

   ```bash
   npm run db:deploy   # applies prisma/migrations to your database
   npm run db:seed     # seeds demo accounts + sample reviews
   ```

   During active schema development you can use `npm run db:migrate` instead of `db:deploy`.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Demo accounts (after seeding)

| Username  | Password    | Roles                     |
| --------- | ----------- | ------------------------- |
| `admin`   | `Admin123!` | Admin                     |
| `buyer1`  | `Buyer123!` | Buyer                     |
| `seller1` | `Seller123!`| Seller                    |
| `driver1` | `Driver123!`| Driver                    |
| `multi`   | `Multi123!` | Buyer + Seller + Driver   |

`multi` owns several roles, so after login it must choose an **active role**
before reaching a dashboard, and can switch roles from the account menu.

`buyer1` is seeded with **Rp500.000** wallet balance and a Jakarta delivery address
for an end-to-end checkout demo against `seller1`'s store.

## Business rules (Level 3–4)

- **Single-store cart:** one cart may only contain products from **one store**.
  Adding from a different store is blocked (409) and the UI offers to clear the
  cart first. Enforced in `lib/cart/service.ts` and shown on cart/product pages.
- **Checkout totals:** subtotal → discount (voucher + promo, capped at subtotal)
  → PPN 12% on taxable base → delivery fee (not taxed) → final total. One voucher
  and one promo may be combined per checkout. See `context/knowledge.md`.
- **Buyer address:** one saved address per buyer (Level 3); snapshotted onto each
  order at checkout. Multiple addresses planned for a later level.
- **Seller processing:** orders start as `Sedang Dikemas`; the seller processes
  them to `Menunggu Pengirim` before a driver can take the job.
- **Reports:** buyer spending = sum of `finalTotal`; seller revenue = sum of
  `(subtotal − discount)`; both exclude returned orders.

## Seed discount codes (after `npm run db:seed`)

| Code | Type | Rule | Status |
| ---- | ---- | ---- | ------ |
| `SAVE10` | Voucher | 10% off, max Rp50.000, 10 uses | Valid |
| `FLAT25K` | Voucher | Fixed Rp25.000, 5 uses | Valid |
| `USEDUP` | Voucher | Fixed Rp10.000 | Exhausted |
| `EXPIRED10` | Voucher | 10% off | Expired |
| `WELCOME50K` | Promo | Fixed Rp50.000 | Valid |
| `PROMO15` | Promo | 15% off, max Rp75.000 | Valid |
| `OLDPROMO` | Promo | Fixed Rp20.000 | Expired |

## Admin discount APIs (Level 4)

Log in as `admin` / `Admin123!` (active role must be Admin), then use the session
cookie with these endpoints:

```bash
# Create a voucher
curl -X POST http://localhost:3000/api/admin/vouchers \
  -H "Content-Type: application/json" \
  -b "seapedia_session=YOUR_TOKEN" \
  -d '{"code":"NEW10","discountType":"PERCENTAGE","discountValue":10,"maxDiscount":30000,"remainingUsage":5,"expiresAt":"2026-12-31T00:00:00.000Z"}'

# List vouchers
curl http://localhost:3000/api/admin/vouchers -b "seapedia_session=YOUR_TOKEN"

# Create a promo
curl -X POST http://localhost:3000/api/admin/promos \
  -H "Content-Type: application/json" \
  -b "seapedia_session=YOUR_TOKEN" \
  -d '{"code":"SUMMER","discountType":"FIXED","discountValue":15000,"expiresAt":"2026-12-31T00:00:00.000Z"}'
```

Full Admin UI for vouchers/promos arrives in Level 6.

## Scripts

| Script              | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server (Turbopack)             |
| `npm run build`     | Production build                             |
| `npm run start`     | Start the production server                  |
| `npm run lint`      | Run ESLint                                   |
| `npm run db:generate` | Generate the Prisma client                 |
| `npm run db:migrate`  | Create/apply a dev migration               |
| `npm run db:deploy`   | Apply committed migrations                  |
| `npm run db:seed`     | Seed demo accounts + reviews               |
| `npm run db:studio`   | Open Prisma Studio                         |

## Project structure

```
app/
  (public)/        Guest-facing pages: landing, catalog, product, auth, select-role
  (dashboard)/     Role-protected workspaces: dashboard, admin, seller, buyer, driver
  api/             Route Handlers (auth, reviews, seller, buyer, admin discounts)
components/        UI primitives (ui/), site chrome, marketplace, reviews, dashboard
lib/               auth, validation, db, discount, report, order, money, api helpers
prisma/            schema.prisma, migrations, seed.ts
proxy.ts           Next.js 16 "proxy" (renamed middleware) for auth redirects
context/           Product & architecture documentation
repo/              Read-only reference project (not part of the app)
```

## Notes

- Authorization is always enforced **server-side** based on the session's
  verified active role (never trusting client-supplied role claims).
- All money is integer Indonesian Rupiah (IDR) — no floating-point currency math.
- The public catalog is database-backed (Level 2): products from seller stores via
  `GET /api/products` and Prisma services.
