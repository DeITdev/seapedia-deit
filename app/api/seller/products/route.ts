import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { createProduct, listSellerProducts } from "@/lib/product/service";
import { productSchema } from "@/lib/validation/product";

export async function GET() {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const products = await listSellerProducts(session.userId);
    return jsonOk({ products });
  });
}

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const body = await req.json().catch(() => null);
    const data = productSchema.parse(body);
    const product = await createProduct(session.userId, data);
    return jsonOk({ product }, 201);
  });
}
