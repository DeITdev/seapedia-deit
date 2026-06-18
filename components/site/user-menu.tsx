"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronDown, LayoutDashboard, LogOut, Repeat } from "lucide-react";
import type { Role } from "@prisma/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/site/role-badge";
import { ROLE_LABELS } from "@/lib/constants";

interface UserMenuProps {
  username: string;
  isAdmin: boolean;
  activeRole: Role | null;
  roles: Role[];
}

export function UserMenu({
  username,
  isAdmin,
  activeRole,
  roles,
}: UserMenuProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function switchRole(role: Role) {
    setPending(true);
    const res = await fetch("/api/auth/active-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setPending(false);
    if (res.ok) {
      toast.success(`Active role: ${ROLE_LABELS[role]}`);
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      toast.error(data?.error ?? "Could not switch role.");
    }
  }

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setPending(false);
    toast.success("Signed out.");
    router.push("/");
    router.refresh();
  }

  const switchableRoles = isAdmin ? [] : roles.filter((r) => r !== activeRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 gap-2 px-2" disabled={pending}>
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
            {username}
          </span>
          <ChevronDown className="size-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="truncate">{username}</span>
          {activeRole ? (
            <span className="flex items-center gap-1.5 text-xs font-normal">
              <span className="text-muted-foreground">Active role</span>
              <RoleBadge role={activeRole} />
            </span>
          ) : (
            <span className="text-muted-foreground text-xs font-normal">
              No active role selected
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        {switchableRoles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Switch role
            </DropdownMenuLabel>
            {switchableRoles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => switchRole(role)}
                disabled={pending}
              >
                <Repeat /> {ROLE_LABELS[role]}
              </DropdownMenuItem>
            ))}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={logout}
          disabled={pending}
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
