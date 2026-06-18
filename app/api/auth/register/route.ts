import { NextRequest } from "next/server";

import { ApiError, handleRoute, jsonOk } from "@/lib/api";
import { hashPassword } from "@/lib/auth/password";
import {
  computeInitialActiveRole,
  setSessionCookie,
} from "@/lib/auth/session";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const body = await req.json().catch(() => null);
    const { username, email, password, roles } = registerSchema.parse(body);

    const existing = await db.user.findFirst({
      where: { OR: [{ username }, { email }] },
      select: { username: true, email: true },
    });
    if (existing) {
      const field = existing.username === username ? "Username" : "Email";
      throw new ApiError(409, `${field} is already taken.`);
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        username,
        email,
        passwordHash,
        roles: { create: roles.map((role) => ({ role })) },
      },
      include: { roles: true },
    });

    const ownedRoles = user.roles.map((r) => r.role);
    const activeRole = computeInitialActiveRole(false, ownedRoles);

    await setSessionCookie({
      userId: user.id,
      username: user.username,
      isAdmin: false,
      activeRole,
      roles: ownedRoles,
    });

    return jsonOk(
      {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: false,
          roles: ownedRoles,
          activeRole,
        },
        needsRoleSelection: activeRole === null,
      },
      201,
    );
  });
}
