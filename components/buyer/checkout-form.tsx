"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DeliveryMethod } from "@prisma/client";
import { toast } from "sonner";

import { CheckoutSummaryCard } from "@/components/buyer/checkout-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CheckoutPreview } from "@/lib/order/service";
import {
  DELIVERY_FEES,
  DELIVERY_METHOD_DESCRIPTIONS,
  DELIVERY_METHOD_LABELS,
  DELIVERY_METHODS,
} from "@/lib/constants/delivery";
import { formatIDR } from "@/lib/money";

function formatAddressLines(address: {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}): string {
  return `${address.street}, ${address.city}, ${address.province} ${address.postalCode}`;
}

interface AddressSummary {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

export function CheckoutForm({
  initialPreview,
  address,
}: {
  initialPreview: CheckoutPreview;
  address: AddressSummary;
}) {
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = React.useState<DeliveryMethod>(
    initialPreview.summary.deliveryMethod,
  );
  const [preview, setPreview] = React.useState(initialPreview);
  const [loading, setLoading] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  async function fetchPreview(method: DeliveryMethod) {
    setLoading(true);
    const res = await fetch("/api/buyer/checkout/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryMethod: method }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data?.error ?? "Failed to load checkout preview.");
      return;
    }

    setPreview(data.data.preview);
  }

  function onMethodChange(method: DeliveryMethod) {
    setDeliveryMethod(method);
    fetchPreview(method);
  }

  async function confirmCheckout() {
    setConfirming(true);
    const res = await fetch("/api/buyer/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryMethod }),
    });
    const data = await res.json();
    setConfirming(false);

    if (!res.ok) {
      toast.error(data?.error ?? "Checkout failed.");
      return;
    }

    toast.success("Order placed successfully!");
    router.push(`/buyer/orders/${data.data.result.orderId}`);
    router.refresh();
  }

  return (
    <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{address.recipientName}</p>
            <p className="text-muted-foreground">{address.phone}</p>
            <p className="text-muted-foreground mt-1">{formatAddressLines(address)}</p>
            <Button asChild variant="link" className="mt-2 h-auto p-0">
              <Link href="/buyer/address">Edit address</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Method</Label>
              <Select
                value={deliveryMethod}
                onValueChange={(v) => onMethodChange(v as DeliveryMethod)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {DELIVERY_METHOD_LABELS[method]} — {formatIDR(DELIVERY_FEES[method])} (
                      {DELIVERY_METHOD_DESCRIPTIONS[method]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cart items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {preview.cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatIDR(item.lineTotal)}</span>
              </div>
            ))}
            <p className="text-muted-foreground text-xs">
              From {preview.cart.store?.name}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CheckoutSummaryCard
            summary={preview.summary}
            walletBalance={preview.walletBalance}
            canCheckout={preview.canCheckout}
          />
          <Button
            className="w-full"
            disabled={!preview.canCheckout || confirming || loading}
            onClick={confirmCheckout}
          >
            {confirming ? "Placing order…" : "Confirm checkout"}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/buyer/cart">Back to cart</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
