import { ApiError, handleRoute, jsonOk } from "@/lib/api";
import { getPublicProduct } from "@/lib/product/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  return handleRoute(async () => {
    const { productId } = await params;
    const product = await getPublicProduct(productId);
    if (!product) {
      throw new ApiError(404, "Product not found.");
    }
    return jsonOk({ product });
  });
}
