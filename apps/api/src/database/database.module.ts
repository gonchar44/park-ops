import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const DRIZZLE = Symbol("DRIZZLE");

@Global()
@Module({
    providers: [
        {
            provide: DRIZZLE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const connectionString = configService.getOrThrow<string>("DATABASE_URL");
                const client = postgres(connectionString);
                // TODO: once real table modules exist under src/database/schema,
                // import their schema objects directly (no barrel index.ts) and
                // pass drizzle(client, { schema }) to enable relational queries.
                return drizzle(client);
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DatabaseModule {}
