import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { processSellerOrder } from "@/lib/order/service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const { orderId } = await params;
    const result = await processSellerOrder(session.userId, orderId);
    return jsonOk({ result });
  });
}
