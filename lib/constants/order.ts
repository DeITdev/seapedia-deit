import type { DeliveryMethod, OrderStatus } from "@prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  SEDANG_DIKEMAS: "Sedang Dikemas",
  MENUNGGU_PENGIRIM: "Menunggu Pengirim",
  SEDANG_DIKIRIM: "Sedang Dikirim",
  PESANAN_SELESAI: "Pesanan Selesai",
  DIKEMBALIKAN: "Dikembalikan",
};

export const WALLET_TRANSACTION_LABELS = {
  TOP_UP: "Top-up",
  CHECKOUT: "Checkout",
  REFUND: "Refund",
} as const;

export { DELIVERY_METHOD_LABELS, DELIVERY_METHOD_DESCRIPTIONS } from "@/lib/constants/delivery";

export type { DeliveryMethod, OrderStatus };
