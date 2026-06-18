import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { RoleSelection } from "@/components/auth/role-selection";
import { getServerSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Choose a role — SEAPEDIA",
};

export default async function SelectRolePage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  if (session.activeRole) redirect("/dashboard");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-16">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Choose your active role
        </h1>
        <p className="text-muted-foreground text-sm">
          You own multiple roles. Pick the one you want to use this session — you
          can switch anytime from the menu.
        </p>
      </div>
      <RoleSelection roles={session.roles} />
    </div>
  );
}
