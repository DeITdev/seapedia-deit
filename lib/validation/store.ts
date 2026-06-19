import { z } from "zod";

export const storeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters.")
    .max(60, "Store name is too long."),
});

export type StoreInput = z.infer<typeof storeSchema>;
