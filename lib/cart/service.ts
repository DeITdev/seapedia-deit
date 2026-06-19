import "server-only";

import { ApiError } from "@/lib/api";
import { db } from "@/lib/db";
import type { AddToCartInput, UpdateCartItemInput } from "@/lib/validation/cart";

export interface CartItemSummary {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
  stock: number;
}

export interface CartSummary {
  store: { id: string; name: string } | null;
  items: CartItemSummary[];
  itemCount: number;
  subtotal: number;
}

async function getOrCreateCart(userId: string) {
  return db.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      store: { select: { id: true, name: true } },
      items: {
        include: {
          product: {
            select: { id: true, name: true, price: true, stock: true, storeId: true },
          },
        },
        orderBy: { product: { name: "asc" } },
      },
    },
  });
}

function toCartSummary(cart: Awaited<ReturnType<typeof getOrCreateCart>>): CartSummary {
  const items: CartItemSummary[] = cart.items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    lineTotal: item.product.price * item.quantity,
    stock: item.product.stock,
  }));

  return {
    store: cart.store,
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
  };
}

export async function getCartSummary(userId: string): Promise<CartSummary> {
  const cart = await getOrCreateCart(userId);
  return toCartSummary(cart);
}

export async function addToCart(userId: string, input: AddToCartInput): Promise<CartSummary> {
  const product = await db.product.findUnique({
    where: { id: input.productId },
    include: { store: { select: { id: true, name: true } } },
  });

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (product.stock < 1) {
    throw new ApiError(400, "This product is out of stock.");
  }

  const cart = await getOrCreateCart(userId);

  if (cart.storeId && cart.storeId !== product.storeId) {
    throw new ApiError(
      409,
      `Your cart contains items from ${cart.store?.name ?? "another store"}. Clear your cart before adding products from ${product.store.name}.`,
      {
        storeConflict: true,
        currentStore: cart.store,
        newStore: product.store,
      },
    );
  }

  const existing = cart.items.find((i) => i.productId === product.id);
  const newQty = (existing?.quantity ?? 0) + input.quantity;

  if (newQty > product.stock) {
    throw new ApiError(400, `Only ${product.stock} item(s) available in stock.`);
  }

  if (!cart.storeId) {
    await db.cart.update({
      where: { id: cart.id },
      data: { storeId: product.storeId },
    });
  }

  if (existing) {
    await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: input.quantity,
      },
    });
  }

  return getCartSummary(userId);
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  input: UpdateCartItemInput,
): Promise<CartSummary> {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId === productId);

  if (!item) {
    throw new ApiError(404, "Item not in cart.");
  }

  if (input.quantity > item.product.stock) {
    throw new ApiError(400, `Only ${item.product.stock} item(s) available in stock.`);
  }

  await db.cartItem.update({
    where: { id: item.id },
    data: { quantity: input.quantity },
  });

  return getCartSummary(userId);
}

export async function removeCartItem(userId: string, productId: string): Promise<CartSummary> {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.productId === productId);

  if (!item) {
    throw new ApiError(404, "Item not in cart.");
  }

  await db.cartItem.delete({ where: { id: item.id } });

  const remaining = cart.items.length - 1;
  if (remaining === 0) {
    await db.cart.update({
      where: { id: cart.id },
      data: { storeId: null },
    });
  }

  return getCartSummary(userId);
}

export async function clearCart(userId: string): Promise<CartSummary> {
  const cart = await getOrCreateCart(userId);

  await db.$transaction([
    db.cartItem.deleteMany({ where: { cartId: cart.id } }),
    db.cart.update({ where: { id: cart.id }, data: { storeId: null } }),
  ]);

  return getCartSummary(userId);
}

export async function getCartItemCount(userId: string): Promise<number> {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: { items: true },
  });
  if (!cart) return 0;
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}
