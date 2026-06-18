import "dotenv/config";
import { defineConfig, env } from "prisma/config";

type Env = {
  // Direct (non-pooled) connection. Required by Prisma Migrate / CLI.
  DIRECT_URL: string;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env<Env>("DIRECT_URL"),
  },
});
