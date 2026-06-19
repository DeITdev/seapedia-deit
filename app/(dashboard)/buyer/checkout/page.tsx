import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CheckoutForm } from "@/components/buyer/checkout-form";
import { Button } from "@/components/ui/button";
import { requirePageRole } from "@/lib/auth/page-guards";
import { getBuyerAddress } from "@/lib/address/service";
import { getCartSummary } from "@/lib/cart/service";
import { previewCheckout } from "@/lib/order/service";

export default async function BuyerCheckoutPage() {
  const session = await requirePageRole("BUYER");

  const cart = await getCartSummary(session.userId);
  if (cart.items.length === 0) {
    redirect("/buyer/cart");
  }

  const address = await getBuyerAddress(session.userId);
  if (!address) {
    redirect("/buyer/address");
  }

  const preview = await previewCheckout(session.userId, {
    deliveryMethod: "NEXT_DAY",
  });

  return (
    <DashboardShell
      title="Checkout"
      description="Review your order and confirm payment from your wallet."
      role="BUYER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/buyer/cart">
          <ChevronLeft className="size-4" /> Back to cart
        </Link>
      </Button>

      <CheckoutForm initialPreview={preview} address={address} />
    </DashboardShell>
  );
}
