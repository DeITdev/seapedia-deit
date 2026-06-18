import { Truck, MapPin, History, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { FeatureGrid, type FeatureItem } from "@/components/dashboard/feature-grid";
import { requirePageRole } from "@/lib/auth/page-guards";

const FEATURES: FeatureItem[] = [
  { icon: MapPin, title: "Available jobs", body: "Find delivery jobs ready to be picked up.", level: 5 },
  { icon: Truck, title: "Active deliveries", body: "Manage deliveries you have accepted.", level: 5 },
  { icon: History, title: "Delivery history", body: "Review your completed deliveries.", level: 5 },
  { icon: Wallet, title: "Earnings", body: "Track what you have earned from deliveries.", level: 5 },
];

export default async function DriverPage() {
  await requirePageRole("DRIVER");

  return (
    <DashboardShell
      title="Driver workspace"
      description="Find delivery jobs and track your earnings."
      role="DRIVER"
    >
      <BalanceCard label="Driver earnings" note="Earnings tracking arrives in a later level." />
      <FeatureGrid items={FEATURES} />
    </DashboardShell>
  );
}
