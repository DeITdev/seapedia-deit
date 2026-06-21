import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { getSellerIncomeSummary } from "@/lib/report/service";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const summary = await getSellerIncomeSummary(session.userId);
    return jsonOk({ summary });
  });
}
