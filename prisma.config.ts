import path from "node:path";
import { defineConfig } from "prisma/config";

// Load environment variables
import "dotenv/config";

const databaseUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL or DIRECT_URL environment variable is required"
  );
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: databaseUrl,
  },
});
