import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  // Runtime uses the pooled (pgbouncer) connection string.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

// In dev, hot reload can keep a stale PrismaClient from before a schema change.
// Recreate when expected models are missing (e.g. after `prisma generate`).
function getClient() {
  const existing = globalForPrisma.prisma;
  if (existing && "store" in existing) {
    return existing;
  }
  const client = createClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const db = getClient();
