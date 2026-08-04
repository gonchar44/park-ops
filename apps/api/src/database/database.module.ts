import { Global, Inject, Module, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { cities } from "./schema/cities";
import { countries } from "./schema/countries";
import {
    citiesRelations,
    countriesRelations,
    municipalitiesRelations,
    parkingZonesRelations,
} from "./schema/location-relations";
import { municipalities } from "./schema/municipalities";
import { parkingZones } from "./schema/parking-zones";

export const DRIZZLE = Symbol("DRIZZLE");
export const POSTGRES_CLIENT = Symbol("POSTGRES_CLIENT");

@Global()
@Module({
    providers: [
        {
            provide: POSTGRES_CLIENT,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const connectionString = configService.getOrThrow<string>("DATABASE_URL");
                return postgres(connectionString);
            },
        },
        {
            provide: DRIZZLE,
            inject: [POSTGRES_CLIENT],
            useFactory: (client: postgres.Sql) =>
                drizzle(client, {
                    schema: {
                        cities,
                        citiesRelations,
                        countries,
                        countriesRelations,
                        municipalities,
                        municipalitiesRelations,
                        parkingZones,
                        parkingZonesRelations,
                    },
                }),
        },
    ],
    exports: [DRIZZLE],
})
export class DatabaseModule implements OnModuleDestroy {
    constructor(@Inject(POSTGRES_CLIENT) private readonly client: postgres.Sql) {}

    async onModuleDestroy() {
        await this.client.end();
    }
}
