import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { ProductForm } from "@/components/seller/product-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageRole } from "@/lib/auth/page-guards";
import { db } from "@/lib/db";
import { getStoreBySellerId } from "@/lib/store/service";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const session = await requirePageRole("SELLER");
  const { productId } = await params;

  const store = await getStoreBySellerId(session.userId);
  if (!store) {
    redirect("/seller/store");
  }

  const product = await db.product.findFirst({
    where: { id: productId, storeId: store.id },
  });
  if (!product) notFound();

  return (
    <DashboardShell
      title="Edit product"
      description={`Update ${product.name}.`}
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
          <ProductForm
            productId={product.id}
            defaultValues={{
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
            }}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
