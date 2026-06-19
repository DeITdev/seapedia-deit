import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CartView } from "@/components/buyer/cart-view";
import { Button } from "@/components/ui/button";
import { requirePageRole } from "@/lib/auth/page-guards";
import { getCartSummary } from "@/lib/cart/service";

export default async function BuyerCartPage() {
  const session = await requirePageRole("BUYER");
  const cart = await getCartSummary(session.userId);

  return (
    <DashboardShell
      title="Cart"
      description="Review items before checkout. One store per cart."
      role="BUYER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/buyer">
          <ChevronLeft className="size-4" /> Back
        </Link>
      </Button>

      <CartView initialCart={cart} />
    </DashboardShell>
  );
}
