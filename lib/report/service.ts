import "server-only";

import { db } from "@/lib/db";

export interface BuyerSpendingSummary {
  totalSpending: number;
  orderCount: number;
}

export interface SellerIncomeSummary {
  revenue: number;
  orderCount: number;
  pendingCount: number;
  processedCount: number;
}

const ACTIVE_ORDER_FILTER = { status: { not: "DIKEMBALIKAN" as const } };

export async function getBuyerSpendingSummary(
  userId: string,
): Promise<BuyerSpendingSummary> {
  const agg = await db.order.aggregate({
    where: { buyerId: userId, ...ACTIVE_ORDER_FILTER },
    _sum: { finalTotal: true },
    _count: { id: true },
  });

  return {
    totalSpending: agg._sum.finalTotal ?? 0,
    orderCount: agg._count.id,
  };
}

export async function getSellerIncomeSummary(
  sellerId: string,
): Promise<SellerIncomeSummary> {
  const store = await db.store.findUnique({ where: { sellerId } });
  if (!store) {
    return { revenue: 0, orderCount: 0, pendingCount: 0, processedCount: 0 };
  }

  const orders = await db.order.findMany({
    where: { storeId: store.id, ...ACTIVE_ORDER_FILTER },
    select: { subtotal: true, discount: true, status: true },
  });

  let revenue = 0;
  let pendingCount = 0;
  let processedCount = 0;

  for (const order of orders) {
    revenue += order.subtotal - order.discount;
    if (order.status === "SEDANG_DIKEMAS") {
      pendingCount += 1;
    } else {
      processedCount += 1;
    }
  }

  return {
    revenue,
    orderCount: orders.length,
    pendingCount,
    processedCount,
  };
}
