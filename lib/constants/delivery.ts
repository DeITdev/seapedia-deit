import type { DeliveryMethod } from "@prisma/client";

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  INSTANT: 20_000,
  NEXT_DAY: 12_000,
  REGULAR: 8_000,
};

export const DELIVERY_METHOD_LABELS: Record<DeliveryMethod, string> = {
  INSTANT: "Instant",
  NEXT_DAY: "Next Day",
  REGULAR: "Regular",
};

export const DELIVERY_METHOD_DESCRIPTIONS: Record<DeliveryMethod, string> = {
  INSTANT: "Fastest delivery",
  NEXT_DAY: "Arrives next day",
  REGULAR: "Standard delivery",
};

export const DELIVERY_METHODS = Object.keys(DELIVERY_FEES) as DeliveryMethod[];

export function getDeliveryFee(method: DeliveryMethod): number {
  return DELIVERY_FEES[method];
}
