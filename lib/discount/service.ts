import "server-only";

import type { Prisma } from "@prisma/client";

import { ApiError } from "@/lib/api";
import { computeDiscountAmount } from "@/lib/discount/calculate";
import { db } from "@/lib/db";
import type { CreatePromoInput, CreateVoucherInput } from "@/lib/validation/discount";

export interface AppliedDiscount {
  id: string;
  code: string;
  amount: number;
}

export interface DiscountBreakdown {
  voucher: AppliedDiscount | null;
  promo: AppliedDiscount | null;
  voucherDiscount: number;
  promoDiscount: number;
  totalDiscount: number;
  errors: { voucher?: string; promo?: string };
}

type DbClient = Prisma.TransactionClient | typeof db;

function normalizeCode(code?: string): string | undefined {
  const trimmed = code?.trim();
  return trimmed ? trimmed.toUpperCase() : undefined;
}

function isExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() < now.getTime();
}

export function resolveDiscountBreakdown(
  subtotal: number,
  voucher: {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    maxDiscount: number | null;
    remainingUsage: number;
    expiresAt: Date;
  } | null,
  promo: {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    maxDiscount: number | null;
    expiresAt: Date;
  } | null,
  now = new Date(),
): DiscountBreakdown {
  const errors: DiscountBreakdown["errors"] = {};
  let voucherResult: AppliedDiscount | null = null;
  let promoResult: AppliedDiscount | null = null;

  if (voucher) {
    if (isExpired(voucher.expiresAt, now)) {
      errors.voucher = "This voucher has expired.";
    } else if (voucher.remainingUsage <= 0) {
      errors.voucher = "This voucher has no remaining uses.";
    } else {
      const amount = computeDiscountAmount(
        voucher.discountType,
        voucher.discountValue,
        subtotal,
        voucher.maxDiscount,
      );
      voucherResult = { id: voucher.id, code: voucher.code, amount };
    }
  }

  if (promo) {
    if (isExpired(promo.expiresAt, now)) {
      errors.promo = "This promo has expired.";
    } else {
      const amount = computeDiscountAmount(
        promo.discountType,
        promo.discountValue,
        subtotal,
        promo.maxDiscount,
      );
      promoResult = { id: promo.id, code: promo.code, amount };
    }
  }

  const rawTotal =
    (voucherResult?.amount ?? 0) + (promoResult?.amount ?? 0);
  const totalDiscount = Math.min(rawTotal, subtotal);

  if (rawTotal > subtotal && (voucherResult || promoResult)) {
    const scale = subtotal / rawTotal;
    if (voucherResult) {
      voucherResult = {
        ...voucherResult,
        amount: Math.round(voucherResult.amount * scale),
      };
    }
    if (promoResult) {
      promoResult = {
        ...promoResult,
        amount: Math.round(promoResult.amount * scale),
      };
    }
    const adjusted =
      (voucherResult?.amount ?? 0) + (promoResult?.amount ?? 0);
    return {
      voucher: voucherResult,
      promo: promoResult,
      voucherDiscount: voucherResult?.amount ?? 0,
      promoDiscount: promoResult?.amount ?? 0,
      totalDiscount: Math.min(adjusted, subtotal),
      errors,
    };
  }

  return {
    voucher: voucherResult,
    promo: promoResult,
    voucherDiscount: voucherResult?.amount ?? 0,
    promoDiscount: promoResult?.amount ?? 0,
    totalDiscount,
    errors,
  };
}

export async function resolveCheckoutDiscounts(
  subtotal: number,
  voucherCode?: string,
  promoCode?: string,
  client: DbClient = db,
): Promise<DiscountBreakdown> {
  const normalizedVoucher = normalizeCode(voucherCode);
  const normalizedPromo = normalizeCode(promoCode);
  const errors: DiscountBreakdown["errors"] = {};

  let voucher = null;
  let promo = null;

  if (normalizedVoucher) {
    voucher = await client.voucher.findUnique({
      where: { code: normalizedVoucher },
    });
    if (!voucher) {
      errors.voucher = "Voucher code is invalid.";
    }
  }

  if (normalizedPromo) {
    promo = await client.promo.findUnique({
      where: { code: normalizedPromo },
    });
    if (!promo) {
      errors.promo = "Promo code is invalid.";
    }
  }

  const breakdown = resolveDiscountBreakdown(subtotal, voucher, promo);

  const mergedErrors = { ...errors, ...breakdown.errors };
  const voucherDiscount = mergedErrors.voucher ? 0 : breakdown.voucherDiscount;
  const promoDiscount = mergedErrors.promo ? 0 : breakdown.promoDiscount;

  return {
    voucher: mergedErrors.voucher ? null : breakdown.voucher,
    promo: mergedErrors.promo ? null : breakdown.promo,
    voucherDiscount,
    promoDiscount,
    totalDiscount: Math.min(subtotal, voucherDiscount + promoDiscount),
    errors: mergedErrors,
  };
}

export interface VoucherDetail {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number | null;
  remainingUsage: number;
  expiresAt: string;
  createdAt: string;
}

export interface PromoDetail {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number | null;
  expiresAt: string;
  createdAt: string;
}

function mapVoucher(v: {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number | null;
  remainingUsage: number;
  expiresAt: Date;
  createdAt: Date;
}): VoucherDetail {
  return {
    id: v.id,
    code: v.code,
    discountType: v.discountType,
    discountValue: v.discountValue,
    maxDiscount: v.maxDiscount,
    remainingUsage: v.remainingUsage,
    expiresAt: v.expiresAt.toISOString(),
    createdAt: v.createdAt.toISOString(),
  };
}

function mapPromo(p: {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number | null;
  expiresAt: Date;
  createdAt: Date;
}): PromoDetail {
  return {
    id: p.id,
    code: p.code,
    discountType: p.discountType,
    discountValue: p.discountValue,
    maxDiscount: p.maxDiscount,
    expiresAt: p.expiresAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
  };
}

export async function createVoucher(input: CreateVoucherInput): Promise<VoucherDetail> {
  try {
    const voucher = await db.voucher.create({
      data: {
        code: input.code,
        discountType: input.discountType,
        discountValue: input.discountValue,
        maxDiscount: input.maxDiscount ?? null,
        remainingUsage: input.remainingUsage,
        expiresAt: input.expiresAt,
      },
    });
    return mapVoucher(voucher);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      throw new ApiError(409, "A voucher with this code already exists.");
    }
    throw err;
  }
}

export async function createPromo(input: CreatePromoInput): Promise<PromoDetail> {
  try {
    const promo = await db.promo.create({
      data: {
        code: input.code,
        discountType: input.discountType,
        discountValue: input.discountValue,
        maxDiscount: input.maxDiscount ?? null,
        expiresAt: input.expiresAt,
      },
    });
    return mapPromo(promo);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      throw new ApiError(409, "A promo with this code already exists.");
    }
    throw err;
  }
}

export async function listVouchers(): Promise<VoucherDetail[]> {
  const vouchers = await db.voucher.findMany({ orderBy: { createdAt: "desc" } });
  return vouchers.map(mapVoucher);
}

export async function listPromos(): Promise<PromoDetail[]> {
  const promos = await db.promo.findMany({ orderBy: { createdAt: "desc" } });
  return promos.map(mapPromo);
}

export async function getVoucherById(id: string): Promise<VoucherDetail> {
  const voucher = await db.voucher.findUnique({ where: { id } });
  if (!voucher) {
    throw new ApiError(404, "Voucher not found.");
  }
  return mapVoucher(voucher);
}

export async function getPromoById(id: string): Promise<PromoDetail> {
  const promo = await db.promo.findUnique({ where: { id } });
  if (!promo) {
    throw new ApiError(404, "Promo not found.");
  }
  return mapPromo(promo);
}
