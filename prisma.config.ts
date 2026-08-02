import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ override: true });

if (!process.env.PRISMA_SCHEMA_ENGINE_BINARY && process.platform === "linux") {
  process.env.PRISMA_SCHEMA_ENGINE_BINARY = "/run/current-system/sw/bin/schema-engine";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
