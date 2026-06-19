import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { removeCartItem, updateCartItemQuantity } from "@/lib/cart/service";
import { updateCartItemSchema } from "@/lib/validation/cart";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const { productId } = await params;
    const body = await req.json().catch(() => null);
    const input = updateCartItemSchema.parse(body);
    const cart = await updateCartItemQuantity(session.userId, productId, input);
    return jsonOk({ cart });
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const { productId } = await params;
    const cart = await removeCartItem(session.userId, productId);
    return jsonOk({ cart });
  });
}
