import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be at most 30 characters.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username may only contain letters, numbers, and underscores.",
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(100, "Password is too long.");

export const registerSchema = z.object({
  username: usernameSchema,
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: passwordSchema,
  // Non-admin roles to grant on registration. At least one is required.
  roles: z
    .array(z.enum(["BUYER", "SELLER", "DRIVER"]))
    .min(1, "Choose at least one role.")
    .refine(
      (roles) => new Set(roles).size === roles.length,
      "Duplicate roles are not allowed.",
    ),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export const activeRoleSchema = z.object({
  role: z.enum(["BUYER", "SELLER", "DRIVER"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ActiveRoleInput = z.infer<typeof activeRoleSchema>;
