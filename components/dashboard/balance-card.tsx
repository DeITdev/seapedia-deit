import { Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/money";

export function BalanceCard({
  label = "Wallet balance",
  amount = 0,
  note = "Wallet & payments arrive in a later level.",
}: {
  label?: string;
  amount?: number;
  note?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
          <Wallet className="size-6" />
        </span>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-semibold">{formatIDR(amount)}</p>
          <p className="text-muted-foreground text-xs">{note}</p>
        </div>
      </CardContent>
    </Card>
  );
}
