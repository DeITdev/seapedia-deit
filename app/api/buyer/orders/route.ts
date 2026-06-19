import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { listBuyerOrders } from "@/lib/order/service";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const orders = await listBuyerOrders(session.userId);
    return jsonOk({ orders });
  });
}
