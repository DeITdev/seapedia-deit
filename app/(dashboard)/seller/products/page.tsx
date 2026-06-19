import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { ProductList } from "@/components/seller/product-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { requirePageRole } from "@/lib/auth/page-guards";
import { listSellerProducts } from "@/lib/product/service";
import { getStoreBySellerId } from "@/lib/store/service";

export default async function SellerProductsPage() {
  const session = await requirePageRole("SELLER");

  const store = await getStoreBySellerId(session.userId);
  if (!store) {
    redirect("/seller/store");
  }

  const products = await listSellerProducts(session.userId);

  return (
    <DashboardShell
      title="Products"
      description={`Manage products for ${store.name}.`}
      role="SELLER"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/seller">
            <ChevronLeft className="size-4" /> Back to workspace
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/seller/products/new">
            <Plus className="size-4" /> Add product
          </Link>
        </Button>
      </div>

      <ProductList products={products} />
    </DashboardShell>
  );
}
