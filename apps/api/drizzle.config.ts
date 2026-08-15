import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required but was not set.");
}

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/database/schema/**/*.ts",
    out: "./src/database/migrations",
    dbCredentials: {
        url: databaseUrl,
    },
});
