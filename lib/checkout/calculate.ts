import type { DeliveryMethod } from "@prisma/client";

import { getDeliveryFee } from "@/lib/constants/delivery";
import { roundRupiah } from "@/lib/money";

export interface CheckoutSummary {
  subtotal: number;
  discount: number;
  voucherDiscount: number;
  promoDiscount: number;
  voucherCode?: string;
  promoCode?: string;
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
  options?: {
    voucherDiscount?: number;
    promoDiscount?: number;
    voucherCode?: string;
    promoCode?: string;
  },
): CheckoutSummary {
  const cappedDiscount = Math.min(Math.max(0, discount), subtotal);
  const taxableBase = subtotal - cappedDiscount;
  const ppn = roundRupiah(taxableBase * 0.12);
  const deliveryFee = getDeliveryFee(deliveryMethod);
  const finalTotal = taxableBase + ppn + deliveryFee;

  return {
    subtotal,
    discount: cappedDiscount,
    voucherDiscount: options?.voucherDiscount ?? 0,
    promoDiscount: options?.promoDiscount ?? 0,
    voucherCode: options?.voucherCode,
    promoCode: options?.promoCode,
    taxableBase,
    ppn,
    deliveryFee,
    finalTotal,
    deliveryMethod,
  };
}
