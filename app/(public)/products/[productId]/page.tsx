import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Store } from "lucide-react";

import { AddToCartButton } from "@/components/buyer/add-to-cart-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getServerSession } from "@/lib/auth/session";
import { formatIDR } from "@/lib/money";
import { getPublicProductSafe } from "@/lib/product/service";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getPublicProductSafe(productId);
  if (!product) notFound();

  const session = await getServerSession();
  const isAuthenticated = !!session;
  const isActiveBuyer = session?.activeRole === "BUYER";

  const initial = product.name.charAt(0).toUpperCase();

  return (
    <div className="page-shell space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/products">
          <ChevronLeft className="size-4" /> Back to catalog
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-[1.2fr_1fr]">
        <div className="bg-muted flex aspect-square items-center justify-center border">
          <span className="text-muted-foreground text-8xl font-bold">{initial}</span>
        </div>

        <div className="space-y-5 lg:py-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              {product.name}
            </h1>
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Store className="size-4" />
              <span className="underline underline-offset-2">{product.store.name}</span>
            </div>
          </div>

          <div className="border bg-price text-price-foreground w-fit px-3 py-1.5 text-lg font-medium">
            {formatIDR(product.price)}
          </div>

          <Separator />

          <div className="space-y-2">
            <h2 className="text-sm font-medium">Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <p className="text-muted-foreground text-sm">
            In stock:{" "}
            <span className="text-foreground font-medium">{product.stock}</span>
          </p>

          <div className="space-y-2">
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              stock={product.stock}
              isAuthenticated={isAuthenticated}
              isActiveBuyer={isActiveBuyer}
            />
            <p className="text-muted-foreground text-xs">
              One cart per store — checkout from a single seller at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
