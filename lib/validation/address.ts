import { z } from "zod";

export const addressSchema = z.object({
  recipientName: z.string().trim().min(2, "Recipient name is required.").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number is required.")
    .max(20, "Phone number is too long.")
    .regex(/^[0-9+\-\s()]+$/, "Phone number format is invalid."),
  street: z.string().trim().min(5, "Street address is required.").max(200),
  city: z.string().trim().min(2, "City is required.").max(100),
  province: z.string().trim().min(2, "Province is required.").max(100),
  postalCode: z.string().trim().min(4, "Postal code is required.").max(10),
});

export type AddressInput = z.infer<typeof addressSchema>;
