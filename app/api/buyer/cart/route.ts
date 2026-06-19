import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { clearCart, getCartSummary } from "@/lib/cart/service";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const cart = await getCartSummary(session.userId);
    return jsonOk({ cart });
  });
}

export async function DELETE() {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const cart = await clearCart(session.userId);
    return jsonOk({ cart });
  });
}
