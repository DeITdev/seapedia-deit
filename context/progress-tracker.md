# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- **Foundation + Level 1 — COMPLETE** (public marketplace, multi-role auth with active-role selection, public application reviews, reusable UI + role dashboard shells).
- **Level 2 — COMPLETE** (seller store management, product CRUD, DB-backed public catalog).
- **Level 3 — COMPLETE** (buyer wallet, delivery address, cart with single-store rule, checkout with tax/delivery fees, orders).
- Next phase target: **Level 4 — Discounts and Seller Order Processing**.

## Current Goal

- Begin Level 4: Voucher/Promo discounts at checkout and seller order processing (`Sedang Dikemas` → `Menunggu Pengirim`).

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
- Public pages under `app/(public)`: landing, catalog, product detail, sign-in, sign-up, select-role.
- Public application reviews: `GET/POST /api/reviews` + review form (rating picker) and list; comments rendered as escaped text (XSS-safe).
- Reusable UI: `Navbar` (guest vs logged-in, theme toggle, user menu with role switcher + logout), `Footer`, mobile nav sheet, `ProductCard`, `RoleBadge`, review components, `RoleSelection`, and Admin/Seller/Buyer/Driver dashboard shells with a wallet/earnings placeholder.

### Level 2
- Schema: `Store` (unique `name`, one per seller via unique `sellerId`) and `Product` (name, description, price as int IDR, stock). Migration at `prisma/migrations/1_level2_stores_products`.
- Seed: `seller1` gets store **Rumah Kopi Nusantara** with four demo products.
- Validation: `lib/validation/store.ts`, `lib/validation/product.ts`.
- Services: `lib/store/service.ts`, `lib/product/service.ts`, `lib/product/types.ts`; `requireSellerStore` in `lib/auth/guards.ts`.
- Public APIs: `GET /api/products`, `GET /api/products/[productId]`.
- Seller APIs: `GET/PUT /api/seller/store`, `GET/POST /api/seller/products`, `PATCH/DELETE /api/seller/products/[productId]` — all require active `SELLER` role and ownership checks.
- Seller UI: `/seller` workspace with links; `/seller/store` (create/update form with duplicate-name error); `/seller/products` (list + delete); `/seller/products/new`, `/seller/products/[id]/edit`.
- Public catalog wired to DB via `listPublicProductsSafe` / `getPublicProductSafe` (graceful empty state when DB unavailable). Store name shown on cards and product detail. Dummy catalog removed (`lib/dummy-data.ts` deleted).

### Level 3
- Schema: `Wallet`, `WalletTransaction`, `BuyerAddress`, `Cart`, `CartItem`, `Order`, `OrderItem`, `OrderStatusHistory`; enums `DeliveryMethod`, `OrderStatus`, `WalletTransactionType`. Migration at `prisma/migrations/20260619123846_level3_wallet_cart_orders`.
- Seed: `buyer1` gets Rp500.000 wallet + Jakarta address; `multi` gets empty wallet + cart shell.
- Constants: `lib/constants/delivery.ts`, `lib/constants/order.ts`; checkout math in `lib/checkout/calculate.ts`.
- Validation: `lib/validation/wallet.ts`, `address.ts`, `cart.ts`, `checkout.ts`.
- Services: `lib/wallet/service.ts`, `lib/address/service.ts`, `lib/cart/service.ts` (single-store rule), `lib/order/service.ts` (preview + atomic `$transaction` checkout).
- Buyer APIs: `/api/buyer/wallet`, `/api/buyer/address`, `/api/buyer/cart`, `/api/buyer/cart/items`, `/api/buyer/checkout/preview`, `/api/buyer/checkout`, `/api/buyer/orders`.
- Seller API: `GET /api/seller/orders` (incoming list).
- Buyer UI: `/buyer` hub, `/buyer/wallet`, `/buyer/address`, `/buyer/cart`, `/buyer/checkout`, `/buyer/orders`, `/buyer/orders/[orderId]`.
- Seller UI: `/seller/orders` (read-only incoming list; processing stays Level 4).
- Public product detail: `AddToCartButton` with store-conflict dialog.
- Docs: single-store + address model notes in `knowledge.md` and README.

## In Progress

- None.

## Next Up

- Level 4: Voucher/Promo discounts at checkout and seller order processing.

## Verification (Foundation + Level 1 + Level 2 + Level 3)

- `npm run build` (Turbopack) and `npm run lint` both pass clean.
- `npx prisma generate` succeeds; migrations committed through Level 3.
- Run `npm run db:deploy` and `npm run db:seed` after configuring `.env` — seeds demo accounts, reviews, seller1 store + products, buyer1 wallet/address.
- Manual E2E: `buyer1` adds product → checkout → order history; `seller1` sees incoming order; stock and wallet update correctly.

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
- Buyer delivery address: single address per buyer at Level 3; order snapshots preserve history; multiple addresses deferred to a later level.

## Session Notes

- Next.js 16 specifics applied: `cookies()`/`headers()`/`params`/`searchParams` are async; middleware renamed to `proxy.ts` (nodejs runtime); Turbopack + ESLint flat config are default.
- Prisma 7 specifics applied: connection URLs moved out of `schema.prisma` into `prisma.config.ts`; a driver adapter is required on `PrismaClient`. `dotenv/config` is imported in `prisma.config.ts` so the CLI picks up `.env`.
- The reference repo under `repo/` is read-only inspiration and is excluded from `tsconfig` and ESLint.
- Level 2 product fields follow the COMPFEST brief (no category); store info is shown on product detail only, not a separate store page.
- Level 3 checkout uses Prisma interactive `$transaction` for stock decrement, wallet debit, order creation, and cart clear.
