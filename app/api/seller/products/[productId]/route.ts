import { NextRequest } from "next/server";

import { handleRoute, jsonOk } from "@/lib/api";
import { requireActiveRole } from "@/lib/auth/guards";
import { deleteProduct, updateProduct } from "@/lib/product/service";
import { productSchema } from "@/lib/validation/product";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const { productId } = await params;
    const body = await req.json().catch(() => null);
    const data = productSchema.parse(body);
    const product = await updateProduct(session.userId, productId, data);
    return jsonOk({ product });
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  return handleRoute(async () => {
    const session = await requireActiveRole("SELLER");
    const { productId } = await params;
    await deleteProduct(session.userId, productId);
    return jsonOk({ deleted: true });
  });
}
