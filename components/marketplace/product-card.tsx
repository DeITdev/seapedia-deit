import Link from "next/link";
import { Store } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/money";
import type { DummyProduct } from "@/lib/dummy-data";

function ProductThumb({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="from-primary/15 to-accent flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br">
      <span className="text-primary/70 text-5xl font-bold">{initial}</span>
    </div>
  );
}

export function ProductCard({ product }: { product: DummyProduct }) {
  return (
    <Card className="group gap-3 overflow-hidden py-3 transition-shadow hover:shadow-md">
      <CardContent className="px-3">
        <Link href={`/products/${product.id}`}>
          <ProductThumb name={product.name} />
        </Link>
      </CardContent>
      <CardContent className="space-y-2 px-3">
        <Badge variant="outline" className="text-muted-foreground">
          {product.category}
        </Badge>
        <Link
          href={`/products/${product.id}`}
          className="hover:text-primary line-clamp-2 block text-sm font-medium transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-base font-semibold">{formatIDR(product.price)}</p>
      </CardContent>
      <CardFooter className="text-muted-foreground gap-1.5 px-3 text-xs">
        <Store className="size-3.5" />
        <span className="truncate">{product.store}</span>
      </CardFooter>
    </Card>
  );
}
