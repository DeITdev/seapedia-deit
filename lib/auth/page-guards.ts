import "server-only";

import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

import { getServerSession, type SessionPayload } from "@/lib/auth/session";

/** Server-component guard: require an authenticated session with an active role. */
export async function requirePageSession(): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  if (!session.activeRole) redirect("/select-role");
  return session;
}

/**
 * Server-component guard: require a specific active role. Redirects to the
 * generic dashboard when the active role does not match. Authorization always
 * follows the server-verified active role, never any client claim.
 */
export async function requirePageRole(role: Role): Promise<SessionPayload> {
  const session = await requirePageSession();
  const authorized =
    role === "ADMIN"
      ? session.isAdmin && session.activeRole === "ADMIN"
      : session.activeRole === role;
  if (!authorized) redirect("/dashboard");
  return session;
}
