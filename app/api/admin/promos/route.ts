import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/guards";
import { createPromo, listPromos } from "@/lib/discount/service";
import { createPromoSchema } from "@/lib/validation/discount";

export async function GET() {
  return handleRoute(async () => {
    await requireAdmin();
    const promos = await listPromos();
    return jsonOk({ promos });
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const input = createPromoSchema.parse(body);
    const promo = await createPromo(input);
    return jsonOk({ promo }, 201);
  });
}
