# Demo accounts (seed data)

These accounts are created by `npm run db:seed` (`prisma/seed.ts`). Use them to sign in at `/sign-in`.

**Passwords are for local/demo use only.** Do not reuse them in production.

## Sign in with any seeded account

| Username | Password   | Roles                    |
| -------- | ---------- | ------------------------ |
| `admin`  | `Admin123!` | Admin                    |
| `buyer1` | `Buyer123!` | Buyer                    |
| `seller1`| `Seller123!`| Seller                   |
| `driver1`| `Driver123!`| Driver                   |
| `multi`  | `Multi123!` | Buyer + Seller + Driver  |

## Emails (registration / profile)

| Username | Email                 |
| -------- | --------------------- |
| `admin`  | `admin@seapedia.test` |
| `buyer1` | `buyer@seapedia.test` |
| `seller1`| `seller@seapedia.test`|
| `driver1`| `driver@seapedia.test`|
| `multi`  | `multi@seapedia.test` |

## Notes

- **`multi`** — after login you must pick an **active role** on `/select-role` (Buyer, Seller, or Driver). Authorization follows the active role for that session.
- **`admin`** — admin-only; not part of the multi-role selection flow.
- **`seller1`** — has a pre-seeded store **Rumah Kopi Nusantara** with demo products (Level 2). Sign in with active role **Seller** to manage the store at `/seller`.
- Re-seed anytime: `npm run db:seed` (upserts accounts; does not wipe existing data).
