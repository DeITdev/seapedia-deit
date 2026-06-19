import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { getWalletSummary, topUpWallet } from "@/lib/wallet/service";
import { topUpSchema } from "@/lib/validation/wallet";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const wallet = await getWalletSummary(session.userId);
    return jsonOk({ wallet });
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireActiveRole("BUYER");
    const body = await req.json().catch(() => null);
    const input = topUpSchema.parse(body);
    const wallet = await topUpWallet(session.userId, input);
    return jsonOk({ wallet }, 201);
  });
}
