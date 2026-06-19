import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AddressForm } from "@/components/buyer/address-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageRole } from "@/lib/auth/page-guards";
import { getBuyerAddress } from "@/lib/address/service";

export default async function BuyerAddressPage() {
  const session = await requirePageRole("BUYER");
  const address = await getBuyerAddress(session.userId);

  return (
    <DashboardShell
      title="Delivery address"
      description="Your shipping destination for all orders."
      role="BUYER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/buyer">
          <ChevronLeft className="size-4" /> Back
        </Link>
      </Button>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">My address</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressForm
            defaultValues={
              address
                ? {
                    recipientName: address.recipientName,
                    phone: address.phone,
                    street: address.street,
                    city: address.city,
                    province: address.province,
                    postalCode: address.postalCode,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
