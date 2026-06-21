import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CheckoutSummaryCard } from "@/components/buyer/checkout-summary";
import { OrderStatusBadge } from "@/components/buyer/order-status-badge";
import { OrderStatusTimeline } from "@/components/buyer/order-status-timeline";
import { ProcessOrderButton } from "@/components/seller/process-order-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requirePageRole } from "@/lib/auth/page-guards";
import { DELIVERY_METHOD_LABELS } from "@/lib/constants/delivery";
import { getSellerOrderDetail } from "@/lib/order/service";
import { formatIDR } from "@/lib/money";

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await requirePageRole("SELLER");
  const { orderId } = await params;

  let order;
  try {
    order = await getSellerOrderDetail(session.userId, orderId);
  } catch {
    notFound();
  }

  const canProcess = order.status === "SEDANG_DIKEMAS";

  return (
    <DashboardShell
      title={`Order #${order.id.slice(-8)}`}
      description={`From @${order.buyerUsername}`}
      role="SELLER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/seller/orders">
          <ChevronLeft className="size-4" /> Back to orders
        </Link>
      </Button>

      <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Status</CardTitle>
              <OrderStatusBadge status={order.status} label={order.statusLabel} />
            </CardHeader>
            <CardContent>
              <OrderStatusTimeline entries={order.statusHistory} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span>{formatIDR(item.lineTotal)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Method: </span>
                {DELIVERY_METHOD_LABELS[order.deliveryMethod]}
              </p>
              <Separator />
              <p className="font-medium">{order.recipientName}</p>
              <p className="text-muted-foreground">{order.phone}</p>
              <p className="text-muted-foreground">
                {order.street}, {order.city}, {order.province} {order.postalCode}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CheckoutSummaryCard
                summary={{
                  subtotal: order.subtotal,
                  discount: order.discount,
                  voucherDiscount: order.voucherDiscount,
                  promoDiscount: order.promoDiscount,
                  voucherCode: order.voucherCode ?? undefined,
                  promoCode: order.promoCode ?? undefined,
                  taxableBase: order.subtotal - order.discount,
                  ppn: order.ppn,
                  deliveryFee: order.deliveryFee,
                  finalTotal: order.finalTotal,
                  deliveryMethod: order.deliveryMethod,
                }}
                walletBalance={0}
                canCheckout
                showWallet={false}
              />
              {canProcess && <ProcessOrderButton orderId={order.id} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
