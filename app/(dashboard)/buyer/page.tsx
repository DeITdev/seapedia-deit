import { ShoppingCart, PackageCheck, Wallet, Ticket } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { FeatureGrid, type FeatureItem } from "@/components/dashboard/feature-grid";
import { requirePageRole } from "@/lib/auth/page-guards";

const FEATURES: FeatureItem[] = [
  { icon: ShoppingCart, title: "Cart & checkout", body: "Add products and check out from a single store.", level: 3 },
  { icon: PackageCheck, title: "My orders", body: "Track order status from payment to delivery.", level: 3 },
  { icon: Wallet, title: "Wallet top-up", body: "Top up your balance and pay for orders.", level: 3 },
  { icon: Ticket, title: "Vouchers", body: "Apply discount vouchers at checkout.", level: 6 },
];

export default async function BuyerPage() {
  await requirePageRole("BUYER");

  return (
    <DashboardShell
      title="Buyer workspace"
      description="Browse, buy, and track your orders."
      role="BUYER"
    >
      <BalanceCard label="Buyer wallet" />
      <FeatureGrid items={FEATURES} />
    </DashboardShell>
  );
}
