import type { Role } from "@prisma/client";

// Roles a non-admin user can own and select as their active role.
export const NON_ADMIN_ROLES = [
  "BUYER",
  "SELLER",
  "DRIVER",
] as const satisfies Role[];

export type NonAdminRole = (typeof NON_ADMIN_ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  BUYER: "Buyer",
  SELLER: "Seller",
  DRIVER: "Driver",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  ADMIN: "Monitor the marketplace and manage operations.",
  BUYER: "Browse, fill your cart, and check out orders.",
  SELLER: "Manage your store and products, and process orders.",
  DRIVER: "Find delivery jobs, deliver them, and track earnings.",
};

export const SESSION_COOKIE = "seapedia_session";

// Session lifetime in seconds (7 days).
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
