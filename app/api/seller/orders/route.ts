import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { listSellerOrders } from "@/lib/order/service";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const orders = await listSellerOrders(session.userId);
    return jsonOk({ orders });
  });
}
