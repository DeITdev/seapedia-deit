import type { OrderStatus } from "@prisma/client";

export interface OrderStatusTimelineEntry {
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
}

export function OrderStatusTimeline({
  entries,
}: {
  entries: OrderStatusTimelineEntry[];
}) {
  return (
    <ol className="space-y-3">
      {entries.map((entry, i) => (
        <li key={`${entry.status}-${entry.createdAt}`} className="flex gap-3 text-sm">
          <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs">
            {i + 1}
          </span>
          <div>
            <p className="font-medium">{entry.statusLabel}</p>
            <p className="text-muted-foreground text-xs">
              {new Date(entry.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
