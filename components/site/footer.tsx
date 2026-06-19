import Link from "next/link";

import { Logo } from "@/components/site/logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground flex w-full flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <div className="space-y-2">
          <Logo />
          <p className="max-w-sm text-xs">
            SEAPEDIA is a multi-role marketplace connecting buyers, sellers, and
            drivers in one place.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/products" className="hover:text-foreground">
            Catalog
          </Link>
          <Link href="/sign-up" className="hover:text-foreground">
            Become a seller
          </Link>
          <Link href="/#reviews" className="hover:text-foreground">
            Reviews
          </Link>
        </nav>
      </div>
      <div className="text-muted-foreground border-t py-4 text-center text-xs">
        &copy; {new Date().getFullYear()} SEAPEDIA. Built for COMPFEST 18.
      </div>
    </footer>
  );
}
