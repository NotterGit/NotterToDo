import fs from "node:fs";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ override: true });

const nixSchemaEngine = "/run/current-system/sw/bin/schema-engine";
if (
  !process.env.PRISMA_SCHEMA_ENGINE_BINARY &&
  process.platform === "linux" &&
  fs.existsSync(nixSchemaEngine)
) {
  process.env.PRISMA_SCHEMA_ENGINE_BINARY = nixSchemaEngine;
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
