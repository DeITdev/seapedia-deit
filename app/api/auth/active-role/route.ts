import { NextRequest } from "next/server";
import type { Role } from "@prisma/client";

import { ApiError, handleRoute, jsonOk } from "@/lib/api";
import { requireSession } from "@/lib/auth/guards";
import { setSessionCookie } from "@/lib/auth/session";
import { activeRoleSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireSession();
    const body = await req.json().catch(() => null);
    const { role } = activeRoleSchema.parse(body);
    const nextRole = role as Role;

    // The user may only activate a role they actually own. Admin identity is
    // handled separately and cannot switch into non-admin roles here.
    if (session.isAdmin || !session.roles.includes(nextRole)) {
      throw new ApiError(403, "You do not own that role.");
    }

    await setSessionCookie({ ...session, activeRole: nextRole });

    return jsonOk({ activeRole: nextRole });
  });
}
