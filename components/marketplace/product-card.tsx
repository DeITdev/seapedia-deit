import Link from "next/link";

import { formatIDR } from "@/lib/money";
import type { PublicProduct } from "@/lib/product/types";

function ProductThumb({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="bg-muted flex aspect-square items-center justify-center">
      <span className="text-muted-foreground text-5xl font-bold">{initial}</span>
    </div>
  );
}

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="hover-shadow-hard flex h-full flex-col overflow-hidden rounded-md border bg-card transition-shadow"
    >
      <ProductThumb name={product.name} />

      <div className="flex flex-1 flex-col gap-3 border-y p-4">
        <h2 className="line-clamp-4 text-lg font-medium">{product.name}</h2>
        <p className="text-muted-foreground text-sm font-medium underline underline-offset-2">
          {product.store.name}
        </p>
      </div>

      <div className="p-4">
        <div className="border bg-price text-price-foreground w-fit px-2 py-1 text-sm font-medium">
          {formatIDR(product.price)}
        </div>
      </div>
    </Link>
  );
}
