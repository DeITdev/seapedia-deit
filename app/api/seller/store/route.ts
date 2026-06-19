import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { getStoreBySellerId, upsertStoreForSeller } from "@/lib/store/service";
import { storeSchema } from "@/lib/validation/store";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const store = await getStoreBySellerId(session.userId);
    return jsonOk({ store });
  });
}

export async function PUT(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const body = await req.json().catch(() => null);
    const data = storeSchema.parse(body);
    const store = await upsertStoreForSeller(session.userId, data);
    return jsonOk({ store });
  });
}
