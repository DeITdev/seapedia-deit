import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/marketplace/product-card";
import { CatalogFilters } from "@/components/marketplace/catalog-filters";
import { listPublicProductsSafe } from "@/lib/product/service";

export const metadata: Metadata = {
  title: "Catalog — SEAPEDIA",
};

export default async function CatalogPage() {
  const products = await listPublicProductsSafe();

  return (
    <div className="page-shell flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight">Curated for you</h1>
          <p className="text-muted-foreground text-sm">
            {products.length === 0
              ? "No products listed yet. Sellers can add items from their dashboard."
              : `${products.length} products from independent sellers across SEAPEDIA.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="pill-active px-4 py-1.5 text-sm font-medium">Curated</span>
          <span className="pill-inactive px-4 py-1.5 text-sm font-medium">Trending</span>
          <span className="pill-inactive px-4 py-1.5 text-sm font-medium">Hot &amp; New</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-12 lg:grid-cols-6 xl:grid-cols-8">
        <aside className="hidden lg:col-span-2 lg:block xl:col-span-2">
          <CatalogFilters />
        </aside>

        <div className="lg:col-span-4 xl:col-span-6">
          {products.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Check back soon — or sign in as a Seller to list your first product.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-muted-foreground flex items-center gap-1 text-sm lg:hidden">
        <span>Filters available on larger screens</span>
        <ChevronRight className="size-4" />
      </div>
    </div>
  );
}
