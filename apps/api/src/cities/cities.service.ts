import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DRIZZLE } from "../database/database.module";
import { cities } from "../database/schema/cities";
import { municipalities } from "../database/schema/municipalities";
import type { CityResponseDto } from "./dto/city-response.dto";
import type { ListCitiesQueryDto } from "./dto/list-cities-query.dto";

const MAX_CITIES_RESULTS = 500;

type CityRow = {
    id: string;
    code: string;
    name: string;
    municipalityId: string;
};

function toCityResponseDto(city: CityRow): CityResponseDto {
    return {
        id: city.id,
        code: city.code,
        name: city.name,
        municipalityId: city.municipalityId,
    };
}

@Injectable()
export class CitiesService {
    constructor(@Inject(DRIZZLE) private readonly db: PostgresJsDatabase) {}

    async findFiltered(filters: ListCitiesQueryDto): Promise<CityResponseDto[]> {
        const conditions = [eq(cities.isActive, true)];

        if (filters.municipalityId) {
            conditions.push(eq(cities.municipalityId, filters.municipalityId));
        }

        if (filters.countryId) {
            conditions.push(eq(municipalities.countryId, filters.countryId));
        }

        const rows = await this.db
            .select({
                id: cities.id,
                code: cities.code,
                name: cities.name,
                municipalityId: cities.municipalityId,
            })
            .from(cities)
            .innerJoin(municipalities, eq(municipalities.id, cities.municipalityId))
            .where(and(...conditions))
            .orderBy(asc(cities.name))
            .limit(MAX_CITIES_RESULTS);

        return rows.map(toCityResponseDto);
    }
}
