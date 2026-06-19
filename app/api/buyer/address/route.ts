import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { getBuyerAddress, upsertBuyerAddress } from "@/lib/address/service";
import { addressSchema } from "@/lib/validation/address";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const address = await getBuyerAddress(session.userId);
    return jsonOk({ address });
  });
}

export async function PUT(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const body = await req.json().catch(() => null);
    const input = addressSchema.parse(body);
    const address = await upsertBuyerAddress(session.userId, input);
    return jsonOk({ address });
  });
}
