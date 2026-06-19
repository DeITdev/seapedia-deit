"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/site/user-menu";
import { MobileNav, type NavLink } from "@/components/site/mobile-nav";

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catalog" },
];

interface NavbarClientProps {
  session: {
    username: string;
    isAdmin: boolean;
    activeRole: Role | null;
    roles: Role[];
  } | null;
}

function NavbarItem({
  href,
  children,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "nav-link outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        isActive && "nav-link-active",
      )}
    >
      {children}
    </Link>
  );
}

function AuthPanel({
  session,
}: {
  session: NavbarClientProps["session"];
}) {
  if (session) {
    return (
      <div className="flex h-full items-stretch">
        <div className="border-border flex items-center border-l px-3">
          <ThemeToggle />
        </div>
        <div className="border-border flex items-center border-l px-3">
          <UserMenu
            username={session.username}
            isAdmin={session.isAdmin}
            activeRole={session.activeRole}
            roles={session.roles}
          />
        </div>
        <Button
          asChild
          className="border-border h-full rounded-none border-l border-t-0 border-r-0 border-b-0 px-8 text-lg lg:px-12"
        >
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full items-stretch">
      <div className="border-border hidden items-center border-l px-3 sm:flex">
        <ThemeToggle />
      </div>
      <Button
        asChild
        variant="ghost"
        className="border-border h-full rounded-none border-l border-t-0 border-r-0 border-b-0 bg-transparent px-8 text-lg hover:bg-transparent hover:underline lg:px-12"
      >
        <Link href="/sign-in">Log in</Link>
      </Button>
      <Button
        asChild
        className="border-border h-full rounded-none border-l border-t-0 border-r-0 border-b-0 px-8 text-lg lg:px-12"
      >
        <Link href="/sign-up">Start selling</Link>
      </Button>
    </div>
  );
}

export function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-background sticky top-0 z-40 flex h-20 items-stretch justify-between border-b font-medium">
      <Link href="/" className="flex shrink-0 items-center pl-6">
        <span className="text-4xl font-bold tracking-tight lg:text-5xl">
          seapedia
        </span>
      </Link>

      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:flex lg:items-center lg:gap-2">
        {NAV_LINKS.map((link) => (
          <NavbarItem
            key={link.href}
            href={link.href}
            isActive={
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            }
          >
            {link.label}
          </NavbarItem>
        ))}
      </div>

      <div className="ml-auto flex h-full items-stretch">
        <div className="hidden lg:flex">
          <AuthPanel session={session} />
        </div>

        <div className="flex items-center gap-1 pr-2 lg:hidden">
          {!session && (
            <div className="border-border flex items-center border-l pl-2">
              <ThemeToggle />
            </div>
          )}
          <MobileNav links={NAV_LINKS} isAuthenticated={!!session} session={session} />
        </div>
      </div>
    </nav>
  );
}
