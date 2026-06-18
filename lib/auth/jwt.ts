import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

import { SESSION_MAX_AGE } from "@/lib/constants";

export interface SessionPayload {
  userId: string;
  username: string;
  isAdmin: boolean;
  // The active role for this session. Null means a multi-role user must still
  // choose one before reaching any private dashboard.
  activeRole: Role | null;
  // All non-admin roles owned by the user (so the UI can offer switching).
  roles: Role[];
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** Verify a raw token. Returns the payload or null when invalid/expired. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: String(payload.userId),
      username: String(payload.username),
      isAdmin: Boolean(payload.isAdmin),
      activeRole: (payload.activeRole as Role | null) ?? null,
      roles: (payload.roles as Role[]) ?? [],
    };
  } catch {
    return null;
  }
}

/**
 * Compute the active role to use right after authentication:
 * - Admins are always ADMIN.
 * - A user owning exactly one role uses it automatically.
 * - A user owning multiple roles must choose (null = needs selection).
 */
export function computeInitialActiveRole(
  isAdmin: boolean,
  roles: Role[],
): Role | null {
  if (isAdmin) return "ADMIN";
  if (roles.length === 1) return roles[0];
  return null;
}
