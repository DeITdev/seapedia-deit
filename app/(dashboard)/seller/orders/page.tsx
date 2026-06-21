import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OrderStatusBadge } from "@/components/buyer/order-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requirePageRole } from "@/lib/auth/page-guards";
import { listSellerOrders } from "@/lib/order/service";
import { formatIDR } from "@/lib/money";

function OrderList({ orders }: { orders: Awaited<ReturnType<typeof listSellerOrders>> }) {
  if (orders.length === 0) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground text-sm">No orders in this view.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="max-w-3xl divide-y rounded-lg border">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/seller/orders/${order.id}`}
            className="hover:bg-muted/50 flex items-center justify-between gap-4 px-4 py-4 transition-colors"
          >
            <div className="min-w-0 space-y-1">
              <p className="font-medium">@{order.buyerUsername}</p>
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
  );
}

export default async function SellerOrdersPage() {
  const session = await requirePageRole("SELLER");
  const orders = await listSellerOrders(session.userId);

  const pending = orders.filter((o) => o.status === "SEDANG_DIKEMAS");
  const processed = orders.filter((o) => o.status !== "SEDANG_DIKEMAS");

  return (
    <DashboardShell
      title="Incoming orders"
      description="Orders from buyers at your store."
      role="SELLER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/seller">
          <ChevronLeft className="size-4" /> Back
        </Link>
      </Button>

      {orders.length === 0 ? (
        <Card className="max-w-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground text-sm">No incoming orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="max-w-3xl">
          <TabsList>
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Sedang Dikemas ({pending.length})</TabsTrigger>
            <TabsTrigger value="processed">Processed ({processed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <OrderList orders={orders} />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <OrderList orders={pending} />
          </TabsContent>
          <TabsContent value="processed" className="mt-4">
            <OrderList orders={processed} />
          </TabsContent>
        </Tabs>
      )}
    </DashboardShell>
  );
}
