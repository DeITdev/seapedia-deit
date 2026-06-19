import type { Role } from "@prisma/client";

import { RoleBadge } from "@/components/site/role-badge";

export function DashboardShell({
  title,
  description,
  role,
  children,
}: {
  title: string;
  description?: string;
  role?: Role;
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {role && <RoleBadge role={role} />}
      </div>
      {children}
    </div>
  );
}
