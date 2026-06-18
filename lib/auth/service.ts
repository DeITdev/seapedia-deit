import "server-only";

import type { Role } from "@prisma/client";

import { db } from "@/lib/db";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  roles: Role[];
  activeRole: Role | null;
}

/** Load a user's profile (with owned roles) by id, or null if not found. */
export async function loadProfile(
  userId: string,
  activeRole: Role | null,
): Promise<UserProfile | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  });
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    roles: user.roles.map((r) => r.role),
    activeRole,
  };
}
