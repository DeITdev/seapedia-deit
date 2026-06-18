# SEAPEDIA

A multi-role marketplace (COMPFEST 18 Software Engineering Academy task) connecting
**buyers, sellers, and drivers** in one place. Built full-stack with Next.js App
Router, Route Handlers, Prisma + Supabase PostgreSQL, custom JWT/bcrypt auth, and
shadcn/ui + Tailwind CSS v4.

This repository currently implements **Foundation + Level 1**: the public
marketplace, multi-role authentication with per-session active-role selection,
public application reviews, and reusable UI with role dashboard shells.

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
  api/             Route Handlers (auth, reviews)
components/        UI primitives (ui/), site chrome, marketplace, reviews, dashboard
lib/               auth, validation, db client, money, api helpers, constants
prisma/            schema.prisma, migrations, seed.ts
proxy.ts           Next.js 16 "proxy" (renamed middleware) for auth redirects
context/           Product & architecture documentation
repo/              Read-only reference project (not part of the app)
```

## Notes

- Authorization is always enforced **server-side** based on the session's
  verified active role (never trusting client-supplied role claims).
- All money is integer Indonesian Rupiah (IDR) — no floating-point currency math.
- The Level 1 catalog uses dummy data (`lib/dummy-data.ts`); database-backed
  products arrive in Level 2.
