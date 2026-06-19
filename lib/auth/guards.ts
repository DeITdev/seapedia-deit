import "server-only";

import type { Role } from "@prisma/client";

import { ApiError } from "@/lib/api";
import { getServerSession, type SessionPayload } from "@/lib/auth/session";
import { getStoreBySellerId } from "@/lib/store/service";

/** Require an authenticated session. Throws 401 otherwise. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getServerSession();
  if (!session) {
    throw new ApiError(401, "You must be signed in.");
  }
  return session;
}

/**
 * Require that the session's ACTIVE role matches one of the allowed roles.
 * Authorization always follows the active role, never the full set owned.
 * Admin (isAdmin) is authorized only for the ADMIN role.
 */
export async function requireActiveRole(
  ...allowed: Role[]
): Promise<SessionPayload> {
  const session = await requireSession();

  if (!session.activeRole) {
    throw new ApiError(403, "Select an active role first.");
  }
  if (!allowed.includes(session.activeRole)) {
    throw new ApiError(
      403,
      `This action requires the ${allowed.join(" or ")} role.`,
    );
  }
  return session;
}

/** Require admin privileges (active ADMIN role). Throws 403 otherwise. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (!session.isAdmin || session.activeRole !== "ADMIN") {
    throw new ApiError(403, "Admin access only.");
  }
  return session;
}

/** Require that the seller has created a store. Throws 404 otherwise. */
export async function requireSellerStore(session: SessionPayload) {
  const store = await getStoreBySellerId(session.userId);
  if (!store) {
    throw new ApiError(404, "Create your store first.");
  }
  return store;
}
