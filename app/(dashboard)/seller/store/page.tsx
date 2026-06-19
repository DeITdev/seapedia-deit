import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { StoreForm } from "@/components/seller/store-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageRole } from "@/lib/auth/page-guards";
import { db } from "@/lib/db";

export default async function SellerStorePage() {
  const session = await requirePageRole("SELLER");

  const store = await db.store.findUnique({
    where: { sellerId: session.userId },
  });

  return (
    <DashboardShell
      title={store ? "Manage store" : "Create store"}
      description="Your store name must be unique across SEAPEDIA."
      role="SELLER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/seller">
          <ChevronLeft className="size-4" /> Back to workspace
        </Link>
      </Button>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Store profile</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreForm defaultName={store?.name ?? ""} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
