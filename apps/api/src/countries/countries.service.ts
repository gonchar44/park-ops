import { Inject, Injectable } from "@nestjs/common";
import { asc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DRIZZLE } from "../database/database.module";
import { countries } from "../database/schema/countries";
import { type CountryResponseDto, toCountryResponseDto } from "./dto/country-response.dto";

@Injectable()
export class CountriesService {
    constructor(@Inject(DRIZZLE) private readonly db: PostgresJsDatabase) {}

    async findAllActive(): Promise<CountryResponseDto[]> {
        const rows = await this.db
            .select({
                id: countries.id,
                isoCode: countries.isoCode,
                name: countries.name,
            })
            .from(countries)
            .where(eq(countries.isActive, true))
            .orderBy(asc(countries.name));

        return rows.map(toCountryResponseDto);
    }
}
