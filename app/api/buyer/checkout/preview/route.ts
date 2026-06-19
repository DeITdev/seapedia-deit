import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { previewCheckout } from "@/lib/order/service";
import { checkoutSchema } from "@/lib/validation/checkout";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const body = await req.json().catch(() => null);
    const input = checkoutSchema.parse(body);
    const preview = await previewCheckout(session.userId, input);
    return jsonOk({ preview });
  });
}
