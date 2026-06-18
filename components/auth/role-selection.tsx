"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import type { Role } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RoleSelection({ roles }: { roles: Role[] }) {
  const router = useRouter();
  const [pending, setPending] = React.useState<Role | null>(null);

  async function choose(role: Role) {
    setPending(role);
    const res = await fetch("/api/auth/active-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      toast.success(`Active role: ${ROLE_LABELS[role]}`);
      router.push("/dashboard");
      router.refresh();
    } else {
      setPending(null);
      const data = await res.json().catch(() => null);
      toast.error(data?.error ?? "Could not select role.");
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {roles.map((role) => (
        <button
          key={role}
          type="button"
          disabled={pending !== null}
          onClick={() => choose(role)}
          className={cn(
            "text-left transition-transform hover:-translate-y-0.5 disabled:opacity-60",
          )}
        >
          <Card className="hover:border-primary h-full">
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{ROLE_LABELS[role]}</span>
                <ArrowRight className="text-muted-foreground size-4" />
              </div>
              <p className="text-muted-foreground text-sm">
                {ROLE_DESCRIPTIONS[role]}
              </p>
              {pending === role && (
                <p className="text-primary text-xs">Selecting…</p>
              )}
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}
