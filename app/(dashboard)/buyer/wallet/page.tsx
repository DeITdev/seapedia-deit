import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { WalletTopUpForm } from "@/components/buyer/wallet-top-up-form";
import { WalletTransactionList } from "@/components/buyer/wallet-transaction-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePageRole } from "@/lib/auth/page-guards";
import { getWalletSummary } from "@/lib/wallet/service";

export default async function BuyerWalletPage() {
  const session = await requirePageRole("BUYER");
  const { balance, transactions } = await getWalletSummary(session.userId);

  return (
    <DashboardShell
      title="Wallet"
      description="Top up your balance and view transaction history."
      role="BUYER"
    >
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/buyer">
          <ChevronLeft className="size-4" /> Back
        </Link>
      </Button>

      <BalanceCard label="Current balance" amount={balance} note="Use your wallet to pay at checkout." />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Top up</CardTitle>
        </CardHeader>
        <CardContent>
          <WalletTopUpForm />
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Transaction history</CardTitle>
        </CardHeader>
        <CardContent>
          <WalletTransactionList transactions={transactions} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
