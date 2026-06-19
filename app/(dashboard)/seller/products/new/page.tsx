import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";

import { ProductForm } from "@/components/seller/product-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageRole } from "@/lib/auth/page-guards";
import { getStoreBySellerId } from "@/lib/store/service";

export default async function NewProductPage() {
  const session = await requirePageRole("SELLER");

  const store = await getStoreBySellerId(session.userId);
  if (!store) {
    redirect("/seller/store");
  }

  return (
    <DashboardShell
      title="Add product"
      description={`New product for ${store.name}.`}
      role="SELLER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/seller/products">
          <ChevronLeft className="size-4" /> Back to products
        </Link>
      </Button>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Product details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
