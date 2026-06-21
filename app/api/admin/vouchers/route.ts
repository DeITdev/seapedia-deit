import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/guards";
import { createVoucher, listVouchers } from "@/lib/discount/service";
import { createVoucherSchema } from "@/lib/validation/discount";

export async function GET() {
  return handleRoute(async () => {
    await requireAdmin();
    const vouchers = await listVouchers();
    return jsonOk({ vouchers });
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const input = createVoucherSchema.parse(body);
    const voucher = await createVoucher(input);
    return jsonOk({ voucher }, 201);
  });
}
