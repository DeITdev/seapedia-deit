import type { OrderStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

const VARIANT_MAP: Record<
  OrderStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  SEDANG_DIKEMAS: "secondary",
  MENUNGGU_PENGIRIM: "outline",
  SEDANG_DIKIRIM: "default",
  PESANAN_SELESAI: "default",
  DIKEMBALIKAN: "destructive",
};

export function OrderStatusBadge({
  label,
  status,
}: {
  label: string;
  status: OrderStatus;
}) {
  return <Badge variant={VARIANT_MAP[status]}>{label}</Badge>;
}
