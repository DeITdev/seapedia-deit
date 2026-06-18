import { handleRoute, jsonOk } from "@/lib/api";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  return handleRoute(async () => {
    await destroySession();
    return jsonOk({ success: true });
  });
}
