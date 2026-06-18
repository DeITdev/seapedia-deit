# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds.
- Do not mix unrelated concerns in one component or route.
- Respect the system boundaries defined in `architecture-context.md`.
- Implement against the specs in `PRD.md` and `knowledge.md`. Do not invent product behavior.

## TypeScript

- Strict mode is required throughout the project.
- Avoid `any`; use explicit interfaces or narrowly scoped types.
- Use `interface` for object contracts.
- Validate unknown external input at system boundaries before trusting it (recommended: Zod schemas in `lib/`).

## Next.js

- Default to React Server Components.
- Add `"use client"` only when the component needs browser interactivity, hooks, or client state (theme toggle, cart interactions, forms with live validation).
- Keep route handlers in `app/api/` focused on a single responsibility.
- Long-running or scheduled work (overdue evaluation) belongs in a dedicated service/command, not inline in a page render.
- Separate public route groups from role-protected dashboard route groups.

## API Routes

- Validate and parse request input before any logic runs.
- Authenticate the request, then authorize against the **active role** before any protected action.
- Enforce resource ownership before any mutation (own store/product/order/cart/job only).
- Push business logic (checkout math, discount validation, stock changes, overdue handling) into `lib/` services; keep handlers thin.
- Return consistent, predictable response shapes for success and error.
- Reject invalid or dangerous input with clear error messages.

## Security (baseline, enforced from the start)

- **SQL Injection**: use Prisma's safe query APIs / parameterized queries only. Never build SQL by string concatenation with user input.
- **XSS**: escape or sanitize user-generated content (application reviews, comments, store/product text) before rendering. Never use `dangerouslySetInnerHTML` with unsanitized input.
- **Authorization**: enforce role and ownership server-side; never trust role claims coming from the UI. Admin-only routes reject non-admins.
- **Sessions**: logout must invalidate/clear the token or session; use reasonable expiration and document it.
- **Validation**: validate required fields (email, phone, rating, quantity, price, stock, discount values) before persisting.
- **Money**: never use floating-point arithmetic for currency; use integer minor units or `Decimal`.
- **Idempotency**: overdue refund/return and stock restoration must be safe to re-run without double effects.

## Styling

- Use the CSS custom-property tokens defined in `globals.css` and mapped to Tailwind — no raw Tailwind color classes (e.g. `slate-*`, `zinc-*`) or hardcoded hex values.
- Support **both dark and light mode**; every token must resolve correctly in both themes. Do not hardcode colors that only work in one mode.
- Reference tokens through their Tailwind utility names (e.g. `bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-primary`). See `ui-context.md` for the token set.
- Maintain the border-radius scale defined in `ui-context.md`.
- Add shadcn/ui components via the `shadcn` CLI rather than handwriting primitives.

## Data and Storage

- All relational data belongs in Supabase PostgreSQL via Prisma.
- Schema changes go through Prisma migrations; never hand-edit the database out of band.
- Demo accounts and discount seed data live in the Prisma seed script.
- Wallet balance changes always create a matching `WalletTransaction`; order status changes always create an `OrderStatusHistory` entry.

## File Organization

- `lib/` — shared infrastructure: Prisma client, auth/session/password helpers, access-control guards, validation schemas, business-logic services.
- `app/api/` — route handlers for auth, role selection, catalog, cart, checkout, orders, delivery, admin, and discounts.
- `app/` — public pages and role-protected dashboards.
- `components/ui/` — shadcn/ui primitives (protected; do not modify).
- `components/` — app-level feature UI; no business logic.
- `prisma/` — schema, migrations, seed script.
- Name files after the responsibility they contain, not the technology.
