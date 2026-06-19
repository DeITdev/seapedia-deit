import "server-only";

import { db } from "@/lib/db";
import type { AddressInput } from "@/lib/validation/address";

export interface BuyerAddressSummary {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  updatedAt: string;
}

function toAddressSummary(address: {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  updatedAt: Date;
}): BuyerAddressSummary {
  return {
    recipientName: address.recipientName,
    phone: address.phone,
    street: address.street,
    city: address.city,
    province: address.province,
    postalCode: address.postalCode,
    updatedAt: address.updatedAt.toISOString(),
  };
}

export async function getBuyerAddress(userId: string): Promise<BuyerAddressSummary | null> {
  const address = await db.buyerAddress.findUnique({ where: { userId } });
  return address ? toAddressSummary(address) : null;
}

export async function upsertBuyerAddress(
  userId: string,
  input: AddressInput,
): Promise<BuyerAddressSummary> {
  const address = await db.buyerAddress.upsert({
    where: { userId },
    update: input,
    create: { userId, ...input },
  });
  return toAddressSummary(address);
}

export function formatAddressLines(address: BuyerAddressSummary): string {
  return `${address.street}, ${address.city}, ${address.province} ${address.postalCode}`;
}
