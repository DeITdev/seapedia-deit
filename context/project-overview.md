# SEAPEDIA

## Overview

SEAPEDIA is a multi-role e-commerce marketplace that connects Sellers, Buyers, and delivery Drivers in one platform, with Admins monitoring the whole system. It is built progressively across seven levels, starting from a public marketplace interface and growing into authentication, seller tooling, buyer checkout, discounts, delivery operations, admin monitoring, and security hardening.

The application is a full-stack Next.js app. The backend is API-based (Next.js Route Handlers) and must support every required business flow consistently across both the UI and the API.

## Goals

1. Provide a public marketplace experience that guests can browse without an account.
2. Support multi-role accounts where one non-admin username can be Buyer, Seller, and Driver, with one active role per session.
3. Let Sellers manage a unique store and its products, surfaced in the public catalog.
4. Let Buyers manage a wallet, address, and cart, then checkout with tax, delivery fees, and discounts.
5. Let Drivers find, take, and complete delivery jobs and track their earnings.
6. Give Admins monitoring dashboards, discount management, and overdue auto refund/return handling with time simulation.
7. Harden the system against SQL Injection and XSS, enforce server-side role-based access control, and ship clear documentation and demo data.

## Account Roles

- **Buyer** — manages wallet balance, delivery address, cart, checkout, and order history.
- **Seller** — creates a store (unique name), manages products, processes incoming orders, and views income.
- **Driver** — finds delivery jobs, takes jobs, completes jobs, and views delivery earnings.
- **Admin** — monitors the marketplace, manages discount resources, triggers operational actions (incl. time simulation), and accesses admin-only pages.

A non-admin username may own multiple roles at the same time and must choose an active role for the session after login. Authorization follows the **active role**, not the full list of roles owned. Admin behavior is handled separately from non-admin multi-role behavior.

## Levels

The core challenge is worth 100 points. A submission claiming Level N is assessed on Levels 1 through N only.

1. **Level 1 — Public Marketplace, Authentication, and Reviews (20 pts)**
2. **Level 2 — Building the Seller Experience (15 pts)**
3. **Level 3 — Buyer Wallet, Cart, and Checkout (20 pts)**
4. **Level 4 — Discounts and Seller Order Processing (15 pts)**
5. **Level 5 — Delivery and Driver Workflow (10 pts)**
6. **Level 6 — Admin Monitoring and Overdue Handling (10 pts)**
7. **Level 7 — Security Hardening and Finalization (10 pts)**

Detailed requirements and business rules for each level live in `PRD.md`.

## Scope

### In Scope

- Public landing, product listing, and read-only product detail pages.
- Public application reviews (website/experience feedback, not product reviews).
- Custom authentication: registration, login, logout, password hashing, JWT/session.
- Multi-role accounts with active-role selection and server-enforced role-based access control.
- Seller store and product CRUD; public catalog backed by real data.
- Buyer wallet (dummy top-up + transaction history), delivery address, and cart with single-store checkout.
- Checkout computing subtotal, discount, delivery fee, PPN 12%, and final total; stock reduction; order history.
- Vouchers and Promos with validation during checkout.
- Order lifecycle with timestamped status history; seller order processing.
- Delivery jobs, take/complete flow, and driver earnings.
- Admin monitoring dashboards, voucher/promo management UI, and overdue auto refund/return with time simulation.
- Security hardening (SQLi, XSS, input validation, session/RBAC) and full documentation + seed data.

### Out Of Scope

- Real payment processing (top-up and balances are simulated).
- Real shipping/logistics integrations (delivery is simulated in-app).
- Native mobile applications (the client is a responsive web app).
- Advanced analytics beyond meaningful monitoring summaries for the demo.

## Success Criteria

1. Guests can browse the catalog and product details, and anyone can submit a safely displayed application review.
2. Users can register, login, and (when multi-role) choose an active role; private dashboards are protected by the active role on the backend.
3. Sellers can manage a unique store and its products, which appear in the public catalog.
4. Buyers can top up, manage address and cart, and checkout with correct subtotal, discount, delivery fee, PPN 12%, and final total.
5. Orders move through `Sedang Dikemas` → `Menunggu Pengirim` → `Sedang Dikirim` → `Pesanan Selesai` (or `Dikembalikan`) with timestamped history.
6. Drivers can find, take, and complete jobs and see earnings; Admins can monitor everything and demonstrate at least one overdue auto refund/return via time simulation.
7. SQLi and XSS test cases are handled safely and RBAC is enforced server-side.

## Bonus (25 pts, separate from core)

- **UI quality (10 pts)** — good, creative, intuitive, responsive interface with mandatory dark and light mode.
- **Deployment (15 pts)** — a publicly accessible deployed application the evaluator can test, documented in the README.
