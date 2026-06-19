import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { addToCart } from "@/lib/cart/service";
import { addToCartSchema } from "@/lib/validation/cart";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const body = await req.json().catch(() => null);
    const input = addToCartSchema.parse(body);
    const cart = await addToCart(session.userId, input);
    return jsonOk({ cart }, 201);
  });
}
