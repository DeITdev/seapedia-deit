import { Users, Store, ShoppingBag, Activity } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FeatureGrid, type FeatureItem } from "@/components/dashboard/feature-grid";
import { requirePageRole } from "@/lib/auth/page-guards";

const FEATURES: FeatureItem[] = [
  { icon: Users, title: "Users", body: "View and manage marketplace accounts.", level: 7 },
  { icon: Store, title: "Stores", body: "Monitor seller stores across the platform.", level: 7 },
  { icon: ShoppingBag, title: "Orders", body: "Oversee orders and resolve issues.", level: 7 },
  { icon: Activity, title: "Activity", body: "Track marketplace activity and health.", level: 7 },
];

export default async function AdminPage() {
  await requirePageRole("ADMIN");

  return (
    <DashboardShell
      title="Admin workspace"
      description="Monitor the marketplace and manage operations."
      role="ADMIN"
    >
      <FeatureGrid items={FEATURES} />
    </DashboardShell>
  );
}
