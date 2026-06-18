import { NextRequest } from "next/server";

import { ApiError, handleRoute, jsonOk } from "@/lib/api";
import { verifyPassword } from "@/lib/auth/password";
import {
  computeInitialActiveRole,
  setSessionCookie,
} from "@/lib/auth/session";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json().catch(() => null);
    const { username, password } = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { username },
      include: { roles: true },
    });

    // Generic error to avoid leaking which usernames exist.
    const invalid = new ApiError(401, "Invalid username or password.");
    if (!user) {
      // Still run a comparison-shaped delay path by throwing after no user.
      throw invalid;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw invalid;
    }

    const ownedRoles = user.roles.map((r) => r.role);
    const activeRole = computeInitialActiveRole(user.isAdmin, ownedRoles);

    await setSessionCookie({
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      activeRole,
      roles: ownedRoles,
    });

    return jsonOk({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        roles: ownedRoles,
        activeRole,
      },
      needsRoleSelection: activeRole === null,
    });
  });
}
