# Knowledge Base

Concrete rules, formulas, and defaults for SEAPEDIA. The challenge brief leaves several rules to the implementer's discretion ("you may decide... but the rule must be clear and consistent"). This file records those decisions so the UI, backend, and README stay consistent. Update here first if a rule changes.

## Currency and Money Handling

- All amounts are in **Indonesian Rupiah (IDR)** and stored as **integers** (rupiah has no commonly used minor unit). No floating-point currency math.
- If a calculation produces a fraction (e.g. percentage discount or tax), **round to the nearest whole rupiah** (round half up) before storing/displaying.
- Display format: `Rp` prefix with thousands separators (e.g. `Rp1.250.000`).

## Checkout Calculation

Order of operations (documented and consistent across the app and README):

1. **Subtotal** = sum of `unit price × quantity` for all cart items.
2. **Discount** = total discount from a valid Voucher and/or Promo (see Discounts). Discount applies to the subtotal and is capped at the subtotal (discount can never exceed subtotal).
3. **Taxable base** = `Subtotal − Discount`.
4. **PPN (12%)** = `round(Taxable base × 0.12)`. Tax is applied to the goods amount **after** discount and **does not** include the delivery fee.
5. **Delivery fee** = fixed fee per delivery method (see Delivery Fees). Not taxed.
6. **Final total** = `(Subtotal − Discount) + PPN + Delivery fee`.

The checkout summary must always show all five lines: subtotal, discount, delivery fee, PPN 12%, and final total. Buyers cannot checkout if wallet balance < final total.

### Worked example

- Subtotal: `Rp200.000`
- Discount: `Rp20.000` → taxable base `Rp180.000`
- PPN 12%: `round(180.000 × 0.12)` = `Rp21.600`
- Delivery fee (Next Day): `Rp12.000`
- Final total: `180.000 + 21.600 + 12.000` = `Rp213.600`

## Delivery Methods and Fees

| Method   | Fee (IDR) | Characteristic            |
| -------- | --------- | ------------------------- |
| Instant  | 20.000    | Fastest, highest fee      |
| Next Day | 12.000    | Mid                       |
| Regular  | 8.000     | Slowest, cheapest         |

Delivery fee must differ by method (enforced). Values are configurable defaults; change here if adjusted.

## Discounts: Vouchers vs Promos

- **Voucher**: has a `code`, an **expiry date**, and **remaining usage** (a finite usage count that decrements per successful use). Each successful checkout using a voucher decrements its remaining usage.
- **Promo**: has a `code` and an **expiry date** (no usage cap; campaign-style).
- Both may define a discount rule. Default supported rules: **percentage of subtotal** (with optional max-discount cap) or **fixed amount**. Keep the rule explicit per voucher/promo record.

### Combination rule (decision)

- A checkout may apply **at most one Voucher AND at most one Promo simultaneously** (they can be combined).
- Both apply to the subtotal; the combined discount is capped at the subtotal.
- The validation result and checkout summary must clearly distinguish the Voucher discount from the Promo discount.

### Validity rules

- Expired Vouchers or Promos cannot be used.
- Vouchers with no remaining usage cannot be used.
- Invalid/expired/exhausted codes are rejected with a clear error message; the rest of the checkout still computes.

## Order Lifecycle and Transitions

Main statuses (must stay visible): `Sedang Dikemas` → `Menunggu Pengirim` → `Sedang Dikirim` → `Pesanan Selesai`, with `Dikembalikan` as the overdue terminal status.

| Transition                              | Actor   | Trigger                          |
| --------------------------------------- | ------- | -------------------------------- |
| (created) → `Sedang Dikemas`            | system  | successful checkout              |
| `Sedang Dikemas` → `Menunggu Pengirim`  | Seller  | seller processes the order       |
| `Menunggu Pengirim` → `Sedang Dikirim`  | Driver  | driver takes the job             |
| `Sedang Dikirim` → `Pesanan Selesai`    | Driver  | driver confirms completion       |
| any active state → `Dikembalikan`       | system  | overdue auto return/refund       |

Every transition appends a timestamped `OrderStatusHistory` entry. Orders never change silently.

## Driver Earnings (decision)

- A Driver earns **80% of the order's delivery fee** for each completed job (status reaches `Pesanan Selesai`).
- Earnings are recorded per completed job and summed in the Driver dashboard.
- Example: Next Day delivery fee `Rp12.000` → driver earning `Rp9.600`.

## Overdue SLA and Auto Return/Refund (decision)

SLA is measured in **simulated days** from the order's checkout time, evaluated against the system clock.

| Method   | SLA (deadline to reach `Pesanan Selesai`) |
| -------- | ----------------------------------------- |
| Instant  | 1 day                                     |
| Next Day | 2 days                                    |
| Regular  | 4 days                                    |

When the simulated date passes an order's deadline and the order has **not** reached `Pesanan Selesai`, the order is overdue and is auto returned/refunded:

1. Move the order to `Dikembalikan` and append a timestamped status entry.
2. **Refund** the amount the Buyer paid (final total) back to the Buyer wallet, recorded as a `WalletTransaction` (type: refund).
3. **Restore stock** for each order item by its quantity.
4. **Reverse Seller income** for that order (reversal transaction / income-report adjustment) so it is not counted as income.
5. The operation is **idempotent**: an already-returned order is skipped — no double refund, double reversal, or double stock restoration.

Only orders that were successfully checked out and paid are eligible for refund.

## Time Simulation (decision)

- A single `SystemClock` record holds the simulated "current date".
- "Simulate next day" advances the clock by one day and runs overdue evaluation across eligible orders. Exposed as an **Admin-triggered action** (and can also be driven by a command/worker).
- All SLA/overdue logic reads the simulated date, never the real wall clock, so the demo is deterministic.

## Single-Store Checkout (rationale)

SEAPEDIA is a multi-seller marketplace, so a cart holds products from **one store only**. This keeps one order tied to one Seller (clean processing, income, and delivery ownership). If a Buyer adds a product from a different store, the system prevents it and prompts the Buyer to clear the cart first. This rule is enforced in the backend, shown in the UI, and documented in the README.

## Buyer Delivery Address (decision)

- **Level 3:** one delivery address per buyer (`BuyerAddress.userId` is unique). Saved at `/buyer/address` and reused for every checkout.
- **At checkout:** address fields are **snapshotted** onto the `Order` record so past orders stay accurate if the buyer edits their profile later.
- **Future upgrade:** multiple saved addresses with a default picker at checkout. Migration path: drop the `userId` unique constraint, add `isDefault`, extend `/api/buyer/address` to address-book CRUD. Orders already snapshot address — no change needed to order history.

## Seed Data / Demo Accounts

The Prisma seed script provisions demonstrable accounts and discount data. Suggested set (final credentials documented in the README):

- **Admin** — admin-only access (created via seed; document how to create an admin in the README).
- **Seller** — owns a store with a few seeded products.
- **Buyer** — has wallet balance and a delivery address for an end-to-end checkout demo.
- **Driver** — can find and take jobs.
- **Multi-role account** — one non-admin username owning Buyer + Seller + Driver, to demonstrate active-role selection and role-based authorization.
- **Seed Vouchers and Promos** — at least one valid and one expired/exhausted of each, to demo validation.

## Open Defaults To Revisit

These are reasonable starting values, safe to tune later (update this file when changed): delivery fees, driver earning percentage (80%), SLA days per method, default discount caps, and starting seed wallet balances.
