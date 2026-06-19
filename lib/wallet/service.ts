import "server-only";

import type { WalletTransactionType } from "@prisma/client";

import { db } from "@/lib/db";
import type { TopUpInput } from "@/lib/validation/wallet";

export interface WalletTransactionSummary {
  id: string;
  type: WalletTransactionType;
  amount: number;
  note: string | null;
  orderId: string | null;
  createdAt: string;
}

export interface WalletSummary {
  balance: number;
  transactions: WalletTransactionSummary[];
}

function toTransaction(txn: {
  id: string;
  type: WalletTransactionType;
  amount: number;
  note: string | null;
  orderId: string | null;
  createdAt: Date;
}): WalletTransactionSummary {
  return {
    id: txn.id,
    type: txn.type,
    amount: txn.amount,
    note: txn.note,
    orderId: txn.orderId,
    createdAt: txn.createdAt.toISOString(),
  };
}

export async function getOrCreateWallet(userId: string) {
  return db.wallet.upsert({
    where: { userId },
    update: {},
    create: { userId, balance: 0 },
  });
}

export async function getWalletSummary(userId: string): Promise<WalletSummary> {
  const wallet = await getOrCreateWallet(userId);
  const transactions = await db.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return {
    balance: wallet.balance,
    transactions: transactions.map(toTransaction),
  };
}

export async function getWalletBalance(userId: string): Promise<number> {
  const wallet = await getOrCreateWallet(userId);
  return wallet.balance;
}

export async function topUpWallet(userId: string, input: TopUpInput): Promise<WalletSummary> {
  const wallet = await getOrCreateWallet(userId);

  await db.$transaction([
    db.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: input.amount } },
    }),
    db.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "TOP_UP",
        amount: input.amount,
        note: "Wallet top-up",
      },
    }),
  ]);

  return getWalletSummary(userId);
}
