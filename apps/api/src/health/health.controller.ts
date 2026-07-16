import { Controller, Get, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DRIZZLE } from "../database/database.module";

@Controller("health")
export class HealthController {
    constructor(@Inject(DRIZZLE) private readonly db: PostgresJsDatabase) {}

    @Get()
    async check() {
        try {
            await this.db.execute(sql`select 1`);
        } catch {
            throw new HttpException(
                {
                    status: "error",
                    database: "error",
                    timestamp: new Date().toISOString(),
                },
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }

        return {
            status: "ok",
            database: "ok",
            timestamp: new Date().toISOString(),
        };
    }
}
