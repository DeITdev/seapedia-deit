# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata

- **Project Name:** seapedia-deit
- **Date:** 2026-06-21
- **Prepared by:** TestSprite AI Team
- **Scope:** Focused Level 4 regression slice (5 of 37 planned frontend tests)
- **Target:** `http://localhost:3000` via TestSprite tunnel
- **Demo credentials used:** `buyer1` / `Buyer123!`, `seller1` / `Seller123!`

---

## 2️⃣ Requirement Validation Summary

### Requirement: Public marketplace catalog

- **Description:** Guests can browse products and open detail pages without signing in.

#### Test TC001 — Browse products and open a product detail as a guest

- **Test Code:** [TC001_Browse_products_and_open_a_product_detail_as_a_guest.py](./TC001_Browse_products_and_open_a_product_detail_as_a_guest.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f078ecfa-827f-4c78-9f73-1a41f4e4d081/a877c8b7-9192-4a56-9269-55add2117c00
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Guest navigation to `/products`, product card click, and product detail assertions (back link, stock count, guest add-to-cart prompt) all succeeded against seeded catalog data.

---

### Requirement: Seller order processing and income reports

- **Description:** Sellers can open eligible incoming orders and advance them from packing to waiting for pickup.

#### Test TC004 — Process an incoming seller order

- **Test Code:** [TC004_Process_an_incoming_seller_order.py](./TC004_Process_an_incoming_seller_order.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f078ecfa-827f-4c78-9f73-1a41f4e4d081/6657c86c-cb79-4ff7-bd21-93e7cbfbcd1f
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Seller sign-in, navigation to orders list, opening a `Sedang Dikemas` order, and clicking **Process order** completed successfully. Level 4 seller processing workflow is working end-to-end.

---

### Requirement: Voucher and promo discounts

- **Description:** Buyers can apply voucher and promo codes at checkout and see discounts reflected in the order summary.

#### Test TC018 — Apply a voucher at checkout and see the discount reflected

- **Test Code:** [TC018_Apply_a_voucher_at_checkout_and_see_the_discount_reflected.py](./TC018_Apply_a_voucher_at_checkout_and_see_the_discount_reflected.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f078ecfa-827f-4c78-9f73-1a41f4e4d081/7f23bda9-1327-4b8a-9b0c-1c518606f882
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Buyer authenticated, product added to cart, and checkout voucher flow reached a passing verdict. Generated script had some redundant add-to-cart retries but the AI judge marked the run as passed.

#### Test TC025 — Apply both eligible discounts together in checkout

- **Test Code:** [TC025_Apply_both_eligible_discounts_together_in_checkout.py](./TC025_Apply_both_eligible_discounts_together_in_checkout.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f078ecfa-827f-4c78-9f73-1a41f4e4d081/9986193b-6e69-490a-8835-4f260b60a04d
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Checkout accepted seeded codes `SAVE10` and `WELCOME50K` together; voucher/promo input fields and order summary panel were visible with both codes applied. Combined discount behavior (Level 4 core) verified.

---

### Requirement: Buyer orders and spending reports

- **Description:** Buyers can view spending summary and recent order activity from their dashboard.

#### Test TC031 — View spending summary from the buyer dashboard

- **Test Code:** [TC031_View_spending_summary_from_the_buyer_dashboard.py](./TC031_View_spending_summary_from_the_buyer_dashboard.py)
- **Test Error:** Partial verification — spending summary found, but no "Recent order activity" section on the page visited.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/f078ecfa-827f-4c78-9f73-1a41f4e4d081/67da1211-0752-4432-b38c-b00b25573165
- **Status:** ❌ Failed
- **Severity:** MEDIUM
- **Analysis / Findings:** The test landed on `/dashboard` (generic role hub) instead of `/buyer` (buyer workspace where **Total spending** lives). The generic dashboard shows wallet balance only, not the spending summary card. There is also no inline "Recent order activity" widget — orders are linked via a separate **My orders** card on `/buyer`. This looks like a **test-plan mismatch** rather than a broken spending API; refine TC031 to navigate to `/buyer` and assert the **Total spending** balance card plus a link to `/buyer/orders`.

---

## 3️⃣ Coverage & Matching Metrics

- **80%** of executed tests passed (4 / 5)

| Requirement                              | Total Tests | ✅ Passed | ❌ Failed |
|------------------------------------------|-------------|-----------|-----------|
| Public marketplace catalog               | 1           | 1         | 0         |
| Seller order processing                  | 1           | 1         | 0         |
| Voucher and promo discounts              | 2           | 2         | 0         |
| Buyer orders and spending reports        | 1           | 0         | 1         |
| **Total (this run)**                     | **5**       | **4**     | **1**     |

**Full suite status:** 37 frontend tests drafted in `testsprite_frontend_test_plan.json`; 5 executed in this run. Remaining 32 tests not yet run.

---

## 4️⃣ Key Gaps / Risks

> 80% of the focused Level 4 slice passed. Core discount checkout and seller order processing are verified.

**Risks and follow-ups:**

1. **TC031 plan quality** — Several generated tests use `/login` instead of `/sign-in`, and TC031 targets the wrong dashboard route. Update the plan before the next run (use `/sign-in`, `/buyer` for buyer spending).
2. **Incomplete suite coverage** — Only 5 of 37 tests were executed. Run the full plan (or at least auth, cart, checkout, seller income) for broader confidence.
3. **Wallet state sensitivity** — TC031 observed `Rp 0` wallet on the generic dashboard; seed data expects `buyer1` with Rp500.000. Confirm DB seed is applied and tests navigate to role-specific pages.
4. **CLI auth blocked** — `testsprite auth status` reports an invalid/revoked API key. MCP tunnel testing worked, but CLI-based runs need a fresh key from [TestSprite API settings](https://www.testsprite.com/dashboard/settings/apikey).
5. **No recent-orders widget** — If product intent is an inline recent-orders panel on the buyer hub, that UI does not exist yet; only a link to `/buyer/orders` is present.

**Recommended next steps:**

- Re-run TC031 after updating the plan to target `/buyer`.
- Execute remaining high-priority tests (`TC002`, `TC006`, `TC014`, `TC016`, `TC019`) via:
  ```bash
  node ~/.npm/_npx/.../testsprite-mcp/dist/index.js generateCodeAndExecute
  ```
  (with updated `testIds` in MCP config), or run the full 37-test plan.
- Regenerate TestSprite CLI credentials with `testsprite auth configure` for dashboard/CI integration.

---
