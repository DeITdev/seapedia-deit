import type { WalletTransactionType } from "@prisma/client";

import { WALLET_TRANSACTION_LABELS } from "@/lib/constants/order";
import { formatIDR } from "@/lib/money";

interface TransactionRow {
  id: string;
  type: WalletTransactionType;
  amount: number;
  note: string | null;
  createdAt: string;
}

export function WalletTransactionList({ transactions }: { transactions: TransactionRow[] }) {
  if (transactions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No transactions yet. Top up to get started.</p>
    );
  }

  return (
    <ul className="divide-border divide-y">
      {transactions.map((txn) => (
        <li key={txn.id} className="flex items-center justify-between py-3 text-sm">
          <div>
            <p className="font-medium">{WALLET_TRANSACTION_LABELS[txn.type]}</p>
            <p className="text-muted-foreground text-xs">
              {txn.note ?? "—"} · {new Date(txn.createdAt).toLocaleString("id-ID")}
            </p>
          </div>
          <span
            className={
              txn.type === "CHECKOUT"
                ? "text-destructive font-medium"
                : "text-success font-medium"
            }
          >
            {txn.type === "CHECKOUT" ? "−" : "+"}
            {formatIDR(txn.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
