"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuIcon } from "lucide-react";
import type { Role } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu } from "@/components/site/user-menu";

export interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({
  links,
  isAuthenticated,
  session,
}: {
  links: NavLink[];
  isAuthenticated: boolean;
  session?: {
    username: string;
    isAdmin: boolean;
    activeRole: Role | null;
    roles: Role[];
  } | null;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-12 rounded-none"
          aria-label="Menu"
        >
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left text-2xl font-bold tracking-tight">
            seapedia
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:bg-accent rounded-md border border-transparent px-3 py-2 text-sm font-medium hover:border-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          {isAuthenticated && session ? (
            <>
              <UserMenu
                username={session.username}
                isAdmin={session.isAdmin}
                activeRole={session.activeRole}
                roles={session.roles}
              />
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link href="/sign-in">Log in</Link>
              </Button>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/sign-up">Start selling</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
