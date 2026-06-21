import { z } from "zod";

export const checkoutSchema = z.object({
  deliveryMethod: z.enum(["INSTANT", "NEXT_DAY", "REGULAR"], {
    error: "Delivery method is required.",
  }),
  voucherCode: z.string().trim().toUpperCase().optional(),
  promoCode: z.string().trim().toUpperCase().optional(),
});

export type CheckoutInput = {
  deliveryMethod: z.infer<typeof checkoutSchema>["deliveryMethod"];
  voucherCode?: string;
  promoCode?: string;
};
