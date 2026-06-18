import { z } from "zod";

export const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name is too long."),
  rating: z
    .number()
    .int("Rating must be a whole number.")
    .min(1, "Rating must be between 1 and 5.")
    .max(5, "Rating must be between 1 and 5."),
  comment: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters.")
    .max(500, "Comment is too long."),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
