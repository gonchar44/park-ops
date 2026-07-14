import { Controller, Get, Inject } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DRIZZLE } from "../database/database.module";

@Controller("health")
export class HealthController {
    constructor(@Inject(DRIZZLE) private readonly db: PostgresJsDatabase) {}

    @Get()
    async check() {
        let database: "ok" | "error" = "ok";
        try {
            await this.db.execute(sql`select 1`);
        } catch {
            database = "error";
        }

        return {
            status: "ok",
            database,
            timestamp: new Date().toISOString(),
        };
    }
}
