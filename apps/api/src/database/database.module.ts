import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { parkingZones } from "./schema/parking-zones";

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
                return drizzle(client, { schema: { parkingZones } });
            },
        },
    ],
    exports: [DRIZZLE],
})
export class DatabaseModule {}
