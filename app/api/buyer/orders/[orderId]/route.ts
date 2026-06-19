import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { getBuyerOrderDetail } from "@/lib/order/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const { orderId } = await params;
    const order = await getBuyerOrderDetail(session.userId, orderId);
    return jsonOk({ order });
  });
}
