import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product is required."),
  quantity: z
    .number({ error: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ error: "Quantity is required." })
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
