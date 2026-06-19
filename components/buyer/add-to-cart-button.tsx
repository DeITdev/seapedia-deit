"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  stock: number;
  isAuthenticated: boolean;
  isActiveBuyer: boolean;
}

interface StoreConflict {
  currentStore: { id: string; name: string } | null;
  newStore: { id: string; name: string };
}

export function AddToCartButton({
  productId,
  productName,
  stock,
  isAuthenticated,
  isActiveBuyer,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [conflict, setConflict] = React.useState<StoreConflict | null>(null);

  if (!isAuthenticated) {
    return (
      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href={`/sign-in?next=/products/${productId}`}>
          <ShoppingCart className="size-4" /> Sign in to add to cart
        </Link>
      </Button>
    );
  }

  if (!isActiveBuyer) {
    return (
      <Button
        size="lg"
        className="w-full sm:w-auto"
        variant="outline"
        onClick={() =>
          toast.info("Switch to the Buyer role from your account menu to add items to cart.")
        }
      >
        <ShoppingCart className="size-4" /> Add to cart (Buyer role required)
      </Button>
    );
  }

  async function addToCart(clearFirst = false) {
    setLoading(true);

    if (clearFirst) {
      await fetch("/api/buyer/cart", { method: "DELETE" });
    }

    const res = await fetch("/api/buyer/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.status === 409 && data?.details?.storeConflict) {
      setConflict({
        currentStore: data.details.currentStore,
        newStore: data.details.newStore,
      });
      return;
    }

    if (!res.ok) {
      toast.error(data?.error ?? "Failed to add to cart.");
      return;
    }

    setConflict(null);
    toast.success(`${productName} added to cart.`);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label htmlFor="qty">Quantity</Label>
          <Input
            id="qty"
            type="number"
            min={1}
            max={stock}
            value={quantity}
            className="w-24"
            onChange={(e) =>
              setQuantity(Math.min(stock, Math.max(1, e.target.valueAsNumber || 1)))
            }
          />
        </div>
        <Button
          size="lg"
          disabled={loading || stock < 1}
          onClick={() => addToCart(false)}
        >
          <ShoppingCart className="size-4" />
          {loading ? "Adding…" : "Add to cart"}
        </Button>
      </div>

      <Dialog open={!!conflict} onOpenChange={(open) => !open && setConflict(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Different store in cart</DialogTitle>
            <DialogDescription>
              Your cart has items from{" "}
              <strong>{conflict?.currentStore?.name ?? "another store"}</strong>. SEAPEDIA only
              allows checkout from one store at a time. Clear your cart and add{" "}
              <strong>{conflict?.newStore.name}</strong> items instead?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConflict(null)}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={() => addToCart(true)}>
              Clear cart and add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
