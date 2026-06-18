import type { Role } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ROLE_VARIANT: Record<
  Role,
  "default" | "secondary" | "success" | "warning" | "info" | "danger"
> = {
  ADMIN: "info",
  BUYER: "default",
  SELLER: "warning",
  DRIVER: "success",
};

export function RoleBadge({
  role,
  className,
}: {
  role: Role;
  className?: string;
}) {
  return (
    <Badge variant={ROLE_VARIANT[role]} className={cn(className)}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}
