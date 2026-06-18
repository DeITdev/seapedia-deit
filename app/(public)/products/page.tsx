import type { Metadata } from "next";

import { ProductCard } from "@/components/marketplace/product-card";
import { getDummyProducts } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Catalog — SEAPEDIA",
};

export default function CatalogPage() {
  const products = getDummyProducts();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
        <p className="text-muted-foreground text-sm">
          {products.length} products from independent sellers across SEAPEDIA.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
