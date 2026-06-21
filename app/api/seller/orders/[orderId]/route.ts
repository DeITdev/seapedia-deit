import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { getSellerOrderDetail } from "@/lib/order/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const { orderId } = await params;
    const order = await getSellerOrderDetail(session.userId, orderId);
    return jsonOk({ order });
  });
}
