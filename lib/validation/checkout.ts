import { z } from "zod";

export const checkoutSchema = z.object({
  deliveryMethod: z.enum(["INSTANT", "NEXT_DAY", "REGULAR"], {
    error: "Delivery method is required.",
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
