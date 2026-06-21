import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { getBuyerSpendingSummary } from "@/lib/report/service";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const summary = await getBuyerSpendingSummary(session.userId);
    return jsonOk({ summary });
  });
}
