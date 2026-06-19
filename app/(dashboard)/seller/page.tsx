import Link from "next/link";
import { Boxes, ClipboardList, Store, Wallet } from "lucide-react";

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
import { getStoreBySellerIdWithProductCount } from "@/lib/store/service";

export default async function SellerPage() {
  const session = await requirePageRole("SELLER");

  const store = await getStoreBySellerIdWithProductCount(session.userId);

  return (
    <DashboardShell
      title="Seller workspace"
      description="Manage your store, products, and orders."
      role="SELLER"
    >
      <BalanceCard label="Seller earnings" note="Earnings tracking arrives in a later level." />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Store className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">My store</CardTitle>
            <CardDescription>
              {store
                ? `${store.name} — ${store._count.products} product${store._count.products === 1 ? "" : "s"}`
                : "Create a uniquely named store profile."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/seller/store">
                {store ? "Manage store" : "Create store"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Boxes className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">Products</CardTitle>
            <CardDescription>
              Add, edit, and manage your product catalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm" disabled={!store}>
              <Link href="/seller/products">Manage products</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <ClipboardList className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">Incoming orders</CardTitle>
            <CardDescription>Confirm and process orders from buyers.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Coming in Level 4</p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Wallet className="size-5" />
            </div>
            <CardTitle className="mt-2 text-base">Earnings</CardTitle>
            <CardDescription>Track revenue from completed orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Coming in Level 4</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
