import type { DeliveryMethod } from "@prisma/client";

import { getDeliveryFee } from "@/lib/constants/delivery";
import { roundRupiah } from "@/lib/money";

export interface CheckoutSummary {
  subtotal: number;
  discount: number;
  taxableBase: number;
  ppn: number;
  deliveryFee: number;
  finalTotal: number;
  deliveryMethod: DeliveryMethod;
}

export function calculateCheckoutSummary(
  subtotal: number,
  deliveryMethod: DeliveryMethod,
  discount = 0,
): CheckoutSummary {
  const cappedDiscount = Math.min(Math.max(0, discount), subtotal);
  const taxableBase = subtotal - cappedDiscount;
  const ppn = roundRupiah(taxableBase * 0.12);
  const deliveryFee = getDeliveryFee(deliveryMethod);
  const finalTotal = taxableBase + ppn + deliveryFee;

  return {
    subtotal,
    discount: cappedDiscount,
    taxableBase,
    ppn,
    deliveryFee,
    finalTotal,
    deliveryMethod,
  };
}
