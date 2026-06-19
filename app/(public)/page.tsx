import Link from "next/link";
import {
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/marketplace/product-card";
import { ReviewSection } from "@/components/reviews/review-section";
import { listPublicProductsSafe } from "@/lib/product/service";

const ROLE_HIGHLIGHTS = [
  {
    icon: ShoppingBag,
    title: "Buyers",
    body: "Browse multiple stores, fill your cart, and check out with a wallet.",
  },
  {
    icon: Store,
    title: "Sellers",
    body: "Open a uniquely named store and manage your own product catalog.",
  },
  {
    icon: Truck,
    title: "Drivers",
    body: "Find delivery jobs, take them, and track your earnings.",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    body: "Monitor the marketplace and keep operations running smoothly.",
  },
];

export default async function HomePage() {
  const featured = (await listPublicProductsSafe()).slice(0, 8);

  return (
    <div className="page-shell space-y-16">
      {/* Hero */}
      <section className="border bg-card p-8 sm:p-12 lg:p-16">
        <div className="max-w-3xl space-y-5">
          <span className="pill-inactive inline-block px-3 py-1 text-xs font-medium">
            A multi-seller marketplace
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            One marketplace for buyers, sellers, and drivers.
          </h1>
          <p className="text-muted-foreground text-lg">
            SEAPEDIA connects many independent stores in a single place. Browse
            products from different sellers, no account needed to look around.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/products">
                Explore catalog <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sign-up">Create an account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Built for every role
          </h2>
          <p className="text-muted-foreground text-sm">
            One username can act as a buyer, seller, and driver — choose an
            active role per session.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLE_HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardContent className="space-y-2">
                <span className="bg-muted flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-medium">{title}</h3>
                <p className="text-muted-foreground text-sm">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Featured products
            </h2>
            <p className="text-muted-foreground text-sm">
              A peek at what sellers are offering on SEAPEDIA.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/products">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {featured.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-sm">
              Products will appear here once sellers list them.
            </p>
          ) : (
            featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      <ReviewSection />
    </div>
  );
}
