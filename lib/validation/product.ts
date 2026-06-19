import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(120, "Product name is too long."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(2000, "Description is too long."),
  price: z
    .number({ error: "Price must be a number." })
    .int("Price must be a whole number of rupiah.")
    .min(0, "Price cannot be negative."),
  stock: z
    .number({ error: "Stock must be a number." })
    .int("Stock must be a whole number.")
    .min(0, "Stock cannot be negative."),
});

export type ProductInput = z.infer<typeof productSchema>;
