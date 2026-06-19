import "server-only";

import { ApiError } from "@/lib/api";
import { db } from "@/lib/db";
import type { PublicProduct, SellerProduct } from "@/lib/product/types";
import type { ProductInput } from "@/lib/validation/product";

const storeSelect = { id: true, name: true } as const;

function toPublicProduct(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  store: { id: string; name: string };
}): PublicProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    store: product.store,
  };
}

function toSellerProduct(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}): SellerProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function listPublicProducts(): Promise<PublicProduct[]> {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { store: { select: storeSelect } },
  });
  return products.map(toPublicProduct);
}

export async function listPublicProductsSafe(): Promise<PublicProduct[]> {
  try {
    return await listPublicProducts();
  } catch {
    return [];
  }
}

export async function getPublicProduct(id: string): Promise<PublicProduct | null> {
  const product = await db.product.findUnique({
    where: { id },
    include: { store: { select: storeSelect } },
  });
  return product ? toPublicProduct(product) : null;
}

export async function getPublicProductSafe(
  id: string,
): Promise<PublicProduct | null> {
  try {
    return await getPublicProduct(id);
  } catch {
    return null;
  }
}

export async function listSellerProducts(sellerId: string): Promise<SellerProduct[]> {
  const store = await db.store.findUnique({ where: { sellerId } });
  if (!store) return [];

  const products = await db.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });
  return products.map(toSellerProduct);
}

export async function createProduct(
  sellerId: string,
  input: ProductInput,
): Promise<SellerProduct> {
  const store = await db.store.findUnique({ where: { sellerId } });
  if (!store) {
    throw new ApiError(404, "Create your store first.");
  }

  const product = await db.product.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      storeId: store.id,
    },
  });
  return toSellerProduct(product);
}

async function getOwnedProduct(productId: string, sellerId: string) {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { store: true },
  });
  if (!product || product.store.sellerId !== sellerId) {
    throw new ApiError(404, "Product not found.");
  }
  return product;
}

export async function updateProduct(
  sellerId: string,
  productId: string,
  input: ProductInput,
): Promise<SellerProduct> {
  await getOwnedProduct(productId, sellerId);

  const product = await db.product.update({
    where: { id: productId },
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
    },
  });
  return toSellerProduct(product);
}

export async function deleteProduct(
  sellerId: string,
  productId: string,
): Promise<void> {
  await getOwnedProduct(productId, sellerId);
  await db.product.delete({ where: { id: productId } });
}
