import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OrderStatusBadge } from "@/components/buyer/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requirePageRole } from "@/lib/auth/page-guards";
import { listBuyerOrders } from "@/lib/order/service";
import { formatIDR } from "@/lib/money";

export default async function BuyerOrdersPage() {
  const session = await requirePageRole("BUYER");
  const orders = await listBuyerOrders(session.userId);

  return (
    <DashboardShell
      title="My orders"
      description="Track your order status from payment to delivery."
      role="BUYER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/buyer">
          <ChevronLeft className="size-4" /> Back
        </Link>
      </Button>

      {orders.length === 0 ? (
        <Card className="max-w-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground text-sm">No orders yet.</p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/products">Browse catalog</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="max-w-2xl divide-y rounded-lg border">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/buyer/orders/${order.id}`}
                className="hover:bg-accent flex items-center justify-between gap-4 px-4 py-4 transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium">{order.storeName}</p>
                  <p className="text-muted-foreground text-xs">
                    {order.itemCount} item(s) · {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>
                  <OrderStatusBadge status={order.status} label={order.statusLabel} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatIDR(order.finalTotal)}</span>
                  <ChevronRight className="text-muted-foreground size-4" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardShell>
  );
}
