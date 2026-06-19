import { handleRoute, jsonOk } from "@/lib/api";
import { listPublicProducts } from "@/lib/product/service";

export async function GET() {
  return handleRoute(async () => {
    const products = await listPublicProducts();
    return jsonOk({ products });
  });
}
