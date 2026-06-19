import { z } from "zod";

export const topUpSchema = z.object({
  amount: z
    .number({ error: "Amount is required." })
    .int("Amount must be a whole number of rupiah.")
    .min(10_000, "Minimum top-up is Rp10.000.")
    .max(10_000_000, "Maximum top-up is Rp10.000.000."),
});

export type TopUpInput = z.infer<typeof topUpSchema>;
