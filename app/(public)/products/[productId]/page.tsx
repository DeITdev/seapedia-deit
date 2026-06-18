import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatIDR } from "@/lib/money";
import { getDummyProduct, getDummyProducts } from "@/lib/dummy-data";

export function generateStaticParams() {
  return getDummyProducts().map((p) => ({ productId: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = getDummyProduct(productId);
  if (!product) notFound();

  const initial = product.name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/products">
          <ChevronLeft className="size-4" /> Back to catalog
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="from-primary/15 to-accent flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br">
          <span className="text-primary/70 text-8xl font-bold">{initial}</span>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Badge variant="outline" className="text-muted-foreground">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Store className="size-4" />
              <span>{product.store}</span>
            </div>
          </div>

          <p className="text-3xl font-bold">{formatIDR(product.price)}</p>

          <Separator />

          <div className="space-y-2">
            <h2 className="text-sm font-medium">Description</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          <p className="text-muted-foreground text-sm">
            In stock: <span className="text-foreground font-medium">{product.stock}</span>
          </p>

          <div className="space-y-2">
            <Button size="lg" className="w-full" disabled>
              Add to cart (coming soon)
            </Button>
            <p className="text-muted-foreground text-center text-xs">
              Cart &amp; checkout arrive in a later level. Browsing is open to
              everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
