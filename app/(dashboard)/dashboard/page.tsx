import Link from "next/link";
import type { Role } from "@prisma/client";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/site/role-badge";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requirePageSession } from "@/lib/auth/page-guards";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/constants";

const ROLE_PATH: Record<Role, string> = {
  ADMIN: "/admin",
  BUYER: "/buyer",
  SELLER: "/seller",
  DRIVER: "/driver",
};

export default async function DashboardPage() {
  const session = await requirePageSession();
  const activeRole = session.activeRole as Role;

  return (
    <DashboardShell
      title={`Hi, ${session.username}`}
      description="Your SEAPEDIA workspace overview."
      role={activeRole}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active workspace</CardTitle>
            <CardDescription>
              You are currently acting as a {ROLE_LABELS[activeRole]}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              {ROLE_DESCRIPTIONS[activeRole]}
            </p>
            <Button asChild>
              <Link href={ROLE_PATH[activeRole]}>
                Go to {ROLE_LABELS[activeRole]} workspace{" "}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <BalanceCard />
      </div>

      {!session.isAdmin && session.roles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your roles</CardTitle>
            <CardDescription>
              Roles you own. Switch the active role from the account menu.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {session.roles.map((role) => (
              <RoleBadge key={role} role={role} />
            ))}
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}
