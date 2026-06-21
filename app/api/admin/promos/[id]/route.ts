import { handleRoute, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth/guards";
import { getPromoById } from "@/lib/discount/service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    await requireAdmin();
    const { id } = await params;
    const promo = await getPromoById(id);
    return jsonOk({ promo });
  });
}
