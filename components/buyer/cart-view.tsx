"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CartSummary } from "@/lib/cart/service";
import { formatIDR } from "@/lib/money";

export function CartView({ initialCart }: { initialCart: CartSummary }) {
  const router = useRouter();
  const [cart, setCart] = React.useState(initialCart);
  const [loading, setLoading] = React.useState<string | null>(null);

  async function updateQty(productId: string, quantity: number) {
    setLoading(productId);
    const res = await fetch(`/api/buyer/cart/items/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    setLoading(null);

    if (!res.ok) {
      toast.error(data?.error ?? "Failed to update quantity.");
      return;
    }

    setCart(data.data.cart);
    router.refresh();
  }

  async function removeItem(productId: string) {
    setLoading(productId);
    const res = await fetch(`/api/buyer/cart/items/${productId}`, { method: "DELETE" });
    const data = await res.json();
    setLoading(null);

    if (!res.ok) {
      toast.error(data?.error ?? "Failed to remove item.");
      return;
    }

    setCart(data.data.cart);
    toast.success("Item removed.");
    router.refresh();
  }

  async function clearCart() {
    setLoading("clear");
    const res = await fetch("/api/buyer/cart", { method: "DELETE" });
    const data = await res.json();
    setLoading(null);

    if (!res.ok) {
      toast.error(data?.error ?? "Failed to clear cart.");
      return;
    }

    setCart(data.data.cart);
    toast.success("Cart cleared.");
    router.refresh();
  }

  if (cart.items.length === 0) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground text-sm">Your cart is empty.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/products">Browse catalog</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm">
            <Store className="size-4" />
            <span>
              All items from <strong>{cart.store?.name}</strong> — single-store checkout
            </span>
          </div>
          <CardTitle className="text-base">Cart ({cart.itemCount} items)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground text-sm">{formatIDR(item.price)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={loading === item.productId || item.quantity <= 1}
                  onClick={() => updateQty(item.productId, item.quantity - 1)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={loading === item.productId || item.quantity >= item.stock}
                  onClick={() => updateQty(item.productId, item.quantity + 1)}
                >
                  <Plus className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={loading === item.productId}
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="w-24 text-right text-sm font-medium">{formatIDR(item.lineTotal)}</p>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>{formatIDR(cart.subtotal)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/buyer/checkout">Proceed to checkout</Link>
            </Button>
            <Button
              variant="outline"
              disabled={loading === "clear"}
              onClick={clearCart}
            >
              Clear cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
