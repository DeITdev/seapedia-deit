import "server-only";

import { Prisma } from "@prisma/client";

import { ApiError } from "@/lib/api";
import { db } from "@/lib/db";
import type { StoreInput } from "@/lib/validation/store";

export interface StoreSummary {
  id: string;
  name: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getStoreBySellerId(
  sellerId: string,
): Promise<StoreSummary | null> {
  return db.store.findUnique({ where: { sellerId } });
}

export async function getStoreBySellerIdWithProductCount(sellerId: string) {
  return db.store.findUnique({
    where: { sellerId },
    include: { _count: { select: { products: true } } },
  });
}

export async function upsertStoreForSeller(
  sellerId: string,
  input: StoreInput,
): Promise<StoreSummary> {
  try {
    return await db.store.upsert({
      where: { sellerId },
      update: { name: input.name },
      create: { name: input.name, sellerId },
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new ApiError(409, "Store name is already taken.");
    }
    throw err;
  }
}

export async function getStorePublicSummary(storeId: string) {
  return db.store.findUnique({
    where: { id: storeId },
    select: { id: true, name: true },
  });
}
