import "server-only";

import type { DeliveryMethod, OrderStatus } from "@prisma/client";

import { ApiError } from "@/lib/api";
import { getBuyerAddress } from "@/lib/address/service";
import { calculateCheckoutSummary, type CheckoutSummary } from "@/lib/checkout/calculate";
import { getCartSummary } from "@/lib/cart/service";
import { ORDER_STATUS_LABELS } from "@/lib/constants/order";
import { db } from "@/lib/db";
import { getOrCreateWallet } from "@/lib/wallet/service";
import type { CheckoutInput } from "@/lib/validation/checkout";

export interface OrderListItem {
  id: string;
  storeName: string;
  status: OrderStatus;
  statusLabel: string;
  finalTotal: number;
  itemCount: number;
  createdAt: string;
}

export interface OrderStatusEntry {
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
}

export interface OrderItemDetail {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDetail {
  id: string;
  storeName: string;
  status: OrderStatus;
  statusLabel: string;
  deliveryMethod: DeliveryMethod;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  ppn: number;
  finalTotal: number;
  items: OrderItemDetail[];
  statusHistory: OrderStatusEntry[];
  createdAt: string;
}

export interface CheckoutPreview {
  cart: Awaited<ReturnType<typeof getCartSummary>>;
  address: NonNullable<Awaited<ReturnType<typeof getBuyerAddress>>>;
  walletBalance: number;
  summary: CheckoutSummary;
  canCheckout: boolean;
}

async function loadCheckoutContext(userId: string, deliveryMethod: DeliveryMethod) {
  const cart = await getCartSummary(userId);

  if (cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty.");
  }

  if (!cart.store) {
    throw new ApiError(400, "Cart store is missing.");
  }

  const address = await getBuyerAddress(userId);
  if (!address) {
    throw new ApiError(400, "Please set your delivery address before checkout.");
  }

  const wallet = await getOrCreateWallet(userId);
  const summary = calculateCheckoutSummary(cart.subtotal, deliveryMethod, 0);

  return { cart, address, wallet, summary };
}

export async function previewCheckout(
  userId: string,
  input: CheckoutInput,
): Promise<CheckoutPreview> {
  const { cart, address, wallet, summary } = await loadCheckoutContext(
    userId,
    input.deliveryMethod,
  );

  return {
    cart,
    address,
    walletBalance: wallet.balance,
    summary,
    canCheckout: wallet.balance >= summary.finalTotal,
  };
}

export async function createOrder(userId: string, input: CheckoutInput): Promise<{ orderId: string }> {
  const { address, wallet, summary } = await loadCheckoutContext(
    userId,
    input.deliveryMethod,
  );

  if (wallet.balance < summary.finalTotal) {
    throw new ApiError(400, "Insufficient wallet balance for checkout.");
  }

  const cartRecord = await db.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cartRecord || cartRecord.items.length === 0) {
    throw new ApiError(400, "Your cart is empty.");
  }

  const orderId = await db.$transaction(async (tx) => {
    for (const item of cartRecord.items) {
      const updated = await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      if (updated.stock < 0) {
        throw new ApiError(400, `${item.product.name} does not have enough stock.`);
      }
    }

    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: summary.finalTotal } },
    });

    if (updatedWallet.balance < 0) {
      throw new ApiError(400, "Insufficient wallet balance for checkout.");
    }

    const order = await tx.order.create({
      data: {
        buyerId: userId,
        storeId: cartRecord.storeId!,
        deliveryMethod: input.deliveryMethod,
        recipientName: address.recipientName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        subtotal: summary.subtotal,
        discount: summary.discount,
        deliveryFee: summary.deliveryFee,
        ppn: summary.ppn,
        finalTotal: summary.finalTotal,
        status: "SEDANG_DIKEMAS",
        items: {
          create: cartRecord.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
          })),
        },
        statusHistory: {
          create: { status: "SEDANG_DIKEMAS" },
        },
      },
    });

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "CHECKOUT",
        amount: summary.finalTotal,
        orderId: order.id,
        note: `Order ${order.id.slice(-8)}`,
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cartRecord.id } });
    await tx.cart.update({
      where: { id: cartRecord.id },
      data: { storeId: null },
    });

    return order.id;
  });

  return { orderId };
}

export async function listBuyerOrders(userId: string): Promise<OrderListItem[]> {
  const orders = await db.order.findMany({
    where: { buyerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      store: { select: { name: true } },
      items: { select: { quantity: true } },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    storeName: order.store.name,
    status: order.status,
    statusLabel: ORDER_STATUS_LABELS[order.status],
    finalTotal: order.finalTotal,
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: order.createdAt.toISOString(),
  }));
}

export async function getBuyerOrderDetail(
  userId: string,
  orderId: string,
): Promise<OrderDetail> {
  const order = await db.order.findFirst({
    where: { id: orderId, buyerId: userId },
    include: {
      store: { select: { name: true } },
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return {
    id: order.id,
    storeName: order.store.name,
    status: order.status,
    statusLabel: ORDER_STATUS_LABELS[order.status],
    deliveryMethod: order.deliveryMethod,
    recipientName: order.recipientName,
    phone: order.phone,
    street: order.street,
    city: order.city,
    province: order.province,
    postalCode: order.postalCode,
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    ppn: order.ppn,
    finalTotal: order.finalTotal,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.unitPrice * item.quantity,
    })),
    statusHistory: order.statusHistory.map((entry) => ({
      status: entry.status,
      statusLabel: ORDER_STATUS_LABELS[entry.status],
      createdAt: entry.createdAt.toISOString(),
    })),
    createdAt: order.createdAt.toISOString(),
  };
}

export type SellerOrderListItem = OrderListItem & { buyerUsername: string };

export async function listSellerOrders(sellerId: string): Promise<SellerOrderListItem[]> {
  const store = await db.store.findUnique({ where: { sellerId } });
  if (!store) {
    return [];
  }

  const orders = await db.order.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    include: {
      store: { select: { name: true } },
      items: { select: { quantity: true } },
      buyer: { select: { username: true } },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    storeName: order.store.name,
    status: order.status,
    statusLabel: ORDER_STATUS_LABELS[order.status],
    finalTotal: order.finalTotal,
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: order.createdAt.toISOString(),
    buyerUsername: order.buyer.username,
  }));
}

