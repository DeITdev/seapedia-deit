import { z } from "zod";

const discountTypeSchema = z.enum(["PERCENTAGE", "FIXED"]);

const discountValueFields = {
  discountType: discountTypeSchema,
  discountValue: z
    .number({ error: "Discount value is required." })
    .int("Discount value must be a whole number."),
  maxDiscount: z
    .number()
    .int("Max discount must be a whole number.")
    .min(0, "Max discount cannot be negative.")
    .optional()
    .nullable(),
  expiresAt: z.coerce.date({ error: "Expiry date is required." }),
};

function refineDiscountValue(
  data: { discountType: "PERCENTAGE" | "FIXED"; discountValue: number },
  ctx: z.RefinementCtx,
) {
  if (data.discountType === "PERCENTAGE") {
    if (data.discountValue < 1 || data.discountValue > 100) {
      ctx.addIssue({
        code: "custom",
        message: "Percentage must be between 1 and 100.",
        path: ["discountValue"],
      });
    }
  } else if (data.discountValue <= 0) {
    ctx.addIssue({
      code: "custom",
      message: "Fixed discount must be greater than zero.",
      path: ["discountValue"],
    });
  }
}

export const createVoucherSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "Code must be at least 2 characters.")
      .max(32, "Code is too long.")
      .transform((v) => v.toUpperCase()),
    ...discountValueFields,
    remainingUsage: z
      .number({ error: "Remaining usage is required." })
      .int("Remaining usage must be a whole number.")
      .min(0, "Remaining usage cannot be negative."),
  })
  .superRefine(refineDiscountValue);

export const createPromoSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2, "Code must be at least 2 characters.")
      .max(32, "Code is too long.")
      .transform((v) => v.toUpperCase()),
    ...discountValueFields,
  })
  .superRefine(refineDiscountValue);

export type CreateVoucherInput = z.infer<typeof createVoucherSchema>;
export type CreatePromoInput = z.infer<typeof createPromoSchema>;
