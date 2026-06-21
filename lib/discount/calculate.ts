import type { DiscountType } from "@prisma/client";

import { roundRupiah } from "@/lib/money";

/** Compute discount amount for a single voucher or promo rule. */
export function computeDiscountAmount(
  discountType: DiscountType,
  discountValue: number,
  subtotal: number,
  maxDiscount?: number | null,
): number {
  if (subtotal <= 0) return 0;

  let amount: number;
  if (discountType === "PERCENTAGE") {
    amount = roundRupiah(subtotal * (discountValue / 100));
    if (maxDiscount != null && maxDiscount > 0) {
      amount = Math.min(amount, maxDiscount);
    }
  } else {
    amount = discountValue;
  }

  return Math.min(Math.max(0, amount), subtotal);
}
