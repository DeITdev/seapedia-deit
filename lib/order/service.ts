import "server-only";

import type { DeliveryMethod, OrderStatus } from "@prisma/client";

import { ApiError } from "@/lib/api";
import { getBuyerAddress } from "@/lib/address/service";
import { calculateCheckoutSummary, type CheckoutSummary } from "@/lib/checkout/calculate";
import { getCartSummary } from "@/lib/cart/service";
import { ORDER_STATUS_LABELS } from "@/lib/constants/order";
import { resolveCheckoutDiscounts, type DiscountBreakdown } from "@/lib/discount/service";
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
  voucherDiscount: number;
  promoDiscount: number;
  voucherCode: string | null;
  promoCode: string | null;
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
  discountBreakdown: DiscountBreakdown;
  canCheckout: boolean;
}

function mapOrderDetail(order: {
  id: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  subtotal: number;
  discount: number;
  voucherDiscount: number;
  promoDiscount: number;
  voucherCode: string | null;
  promoCode: string | null;
  deliveryFee: number;
  ppn: number;
  finalTotal: number;
  createdAt: Date;
  store: { name: string };
  items: Array<{
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }>;
  statusHistory: Array<{ status: OrderStatus; createdAt: Date }>;
}): OrderDetail {
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
    voucherDiscount: order.voucherDiscount,
    promoDiscount: order.promoDiscount,
    voucherCode: order.voucherCode,
    promoCode: order.promoCode,
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

async function loadCheckoutContext(userId: string, input: CheckoutInput) {
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
  const discountBreakdown = await resolveCheckoutDiscounts(
    cart.subtotal,
    input.voucherCode,
    input.promoCode,
  );

  const summary = calculateCheckoutSummary(
    cart.subtotal,
    input.deliveryMethod,
    discountBreakdown.totalDiscount,
    {
      voucherDiscount: discountBreakdown.voucherDiscount,
      promoDiscount: discountBreakdown.promoDiscount,
      voucherCode: discountBreakdown.voucher?.code,
      promoCode: discountBreakdown.promo?.code,
    },
  );

  return { cart, address, wallet, summary, discountBreakdown };
}

export async function previewCheckout(
  userId: string,
  input: CheckoutInput,
): Promise<CheckoutPreview> {
  const { cart, address, wallet, summary, discountBreakdown } =
    await loadCheckoutContext(userId, input);

  return {
    cart,
    address,
    walletBalance: wallet.balance,
    summary,
    discountBreakdown,
    canCheckout: wallet.balance >= summary.finalTotal,
  };
}

export async function createOrder(
  userId: string,
  input: CheckoutInput,
): Promise<{ orderId: string }> {
  const { address, wallet } = await loadCheckoutContext(userId, input);

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
    const discountBreakdown = await resolveCheckoutDiscounts(
      cartRecord.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
      input.voucherCode,
      input.promoCode,
      tx,
    );

    if (input.voucherCode && discountBreakdown.errors.voucher) {
      throw new ApiError(400, discountBreakdown.errors.voucher);
    }
    if (input.promoCode && discountBreakdown.errors.promo) {
      throw new ApiError(400, discountBreakdown.errors.promo);
    }

    const subtotal = cartRecord.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const summary = calculateCheckoutSummary(
      subtotal,
      input.deliveryMethod,
      discountBreakdown.totalDiscount,
      {
        voucherDiscount: discountBreakdown.voucherDiscount,
        promoDiscount: discountBreakdown.promoDiscount,
        voucherCode: discountBreakdown.voucher?.code,
        promoCode: discountBreakdown.promo?.code,
      },
    );

    if (wallet.balance < summary.finalTotal) {
      throw new ApiError(400, "Insufficient wallet balance for checkout.");
    }

    if (discountBreakdown.voucher) {
      const updated = await tx.voucher.updateMany({
        where: {
          id: discountBreakdown.voucher.id,
          remainingUsage: { gt: 0 },
        },
        data: { remainingUsage: { decrement: 1 } },
      });
      if (updated.count !== 1) {
        throw new ApiError(400, "This voucher has no remaining uses.");
      }
    }

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
        voucherDiscount: summary.voucherDiscount,
        promoDiscount: summary.promoDiscount,
        voucherId: discountBreakdown.voucher?.id ?? null,
        voucherCode: discountBreakdown.voucher?.code ?? null,
        promoId: discountBreakdown.promo?.id ?? null,
        promoCode: discountBreakdown.promo?.code ?? null,
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

  return mapOrderDetail(order);
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

export type SellerOrderDetail = OrderDetail & { buyerUsername: string };

export async function getSellerOrderDetail(
  sellerId: string,
  orderId: string,
): Promise<SellerOrderDetail> {
  const store = await db.store.findUnique({ where: { sellerId } });
  if (!store) {
    throw new ApiError(404, "Order not found.");
  }

  const order = await db.order.findFirst({
    where: { id: orderId, storeId: store.id },
    include: {
      store: { select: { name: true } },
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
      buyer: { select: { username: true } },
    },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return {
    ...mapOrderDetail(order),
    buyerUsername: order.buyer.username,
  };
}

export async function processSellerOrder(
  sellerId: string,
  orderId: string,
): Promise<{ status: OrderStatus; statusLabel: string }> {
  const store = await db.store.findUnique({ where: { sellerId } });
  if (!store) {
    throw new ApiError(404, "Order not found.");
  }

  const order = await db.order.findFirst({
    where: { id: orderId, storeId: store.id },
  });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  if (order.status !== "SEDANG_DIKEMAS") {
    throw new ApiError(400, "Only orders being packed can be processed.");
  }

  const updated = await db.order.update({
    where: { id: orderId },
    data: {
      status: "MENUNGGU_PENGIRIM",
      statusHistory: {
        create: { status: "MENUNGGU_PENGIRIM" },
      },
    },
  });

  return {
    status: updated.status,
    statusLabel: ORDER_STATUS_LABELS[updated.status],
  };
}
