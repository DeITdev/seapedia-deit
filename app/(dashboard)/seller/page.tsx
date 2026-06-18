import { Store, Boxes, ClipboardList, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { FeatureGrid, type FeatureItem } from "@/components/dashboard/feature-grid";
import { requirePageRole } from "@/lib/auth/page-guards";

const FEATURES: FeatureItem[] = [
  { icon: Store, title: "My store", body: "Create a uniquely named store profile.", level: 2 },
  { icon: Boxes, title: "Products", body: "Add, edit, and manage your product catalog.", level: 2 },
  { icon: ClipboardList, title: "Incoming orders", body: "Confirm and process orders from buyers.", level: 4 },
  { icon: Wallet, title: "Earnings", body: "Track revenue from completed orders.", level: 4 },
];

export default async function SellerPage() {
  await requirePageRole("SELLER");

  return (
    <DashboardShell
      title="Seller workspace"
      description="Manage your store, products, and orders."
      role="SELLER"
    >
      <BalanceCard label="Seller earnings" note="Earnings tracking arrives in a later level." />
      <FeatureGrid items={FEATURES} />
    </DashboardShell>
  );
}
