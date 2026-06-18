import { handleRoute, jsonOk } from "@/lib/api";
import { requireSession } from "@/lib/auth/guards";
import { loadProfile } from "@/lib/auth/service";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireSession();
    const profile = await loadProfile(session.userId, session.activeRole);
    return jsonOk({
      user: profile,
      needsRoleSelection: session.activeRole === null,
    });
  });
}
