import Link from "next/link";
import { MapPin, PackageCheck, ShoppingCart, Wallet, Ticket } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requirePageRole } from "@/lib/auth/page-guards";
import { getCartItemCount } from "@/lib/cart/service";
import { getBuyerSpendingSummary } from "@/lib/report/service";
import { getWalletBalance } from "@/lib/wallet/service";

export default async function BuyerPage() {
  const session = await requirePageRole("BUYER");
  const [balance, cartCount, spending] = await Promise.all([
    getWalletBalance(session.userId),
    getCartItemCount(session.userId),
    getBuyerSpendingSummary(session.userId),
  ]);

  return (
    <DashboardShell
      title="Buyer workspace"
      description="Browse, buy, and track your orders."
      role="BUYER"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <BalanceCard
          label="Buyer wallet"
          amount={balance}
          note="Top up and pay for orders at checkout."
        />
        <BalanceCard
          label="Total spending"
          amount={spending.totalSpending}
          note={`${spending.orderCount} order${spending.orderCount === 1 ? "" : "s"} placed (excl. returns).`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <ShoppingCart className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">Cart & checkout</CardTitle>
            <CardDescription>
              {cartCount > 0
                ? `${cartCount} item(s) in your cart`
                : "Add products from a single store and check out."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/buyer/cart">View cart</Link>
            </Button>
            {cartCount > 0 && (
              <Button asChild size="sm">
                <Link href="/buyer/checkout">Checkout</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <PackageCheck className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">My orders</CardTitle>
            <CardDescription>Track order status from payment to delivery.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/buyer/orders">View orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Wallet className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">Wallet</CardTitle>
            <CardDescription>Top up your balance and view transaction history.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/buyer/wallet">Manage wallet</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <MapPin className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">Delivery address</CardTitle>
            <CardDescription>Your shipping destination for all orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/buyer/address">Manage address</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Ticket className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">Discount codes</CardTitle>
            <CardDescription>
              Apply voucher and promo codes at checkout for savings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/buyer/checkout">Apply at checkout</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
