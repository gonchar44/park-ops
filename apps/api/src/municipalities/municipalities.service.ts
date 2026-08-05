import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DRIZZLE } from "../database/database.module";
import { municipalities } from "../database/schema/municipalities";
import { type MunicipalityResponseDto, toMunicipalityResponseDto } from "./dto/municipality-response.dto";
import type { ListMunicipalitiesQueryDto } from "./dto/list-municipalities-query.dto";

const MAX_MUNICIPALITIES_RESULTS = 500;

@Injectable()
export class MunicipalitiesService {
    constructor(@Inject(DRIZZLE) private readonly db: PostgresJsDatabase) {}

    async findFiltered(filters: ListMunicipalitiesQueryDto): Promise<MunicipalityResponseDto[]> {
        const conditions = [eq(municipalities.isActive, true)];

        if (filters.countryId) {
            conditions.push(eq(municipalities.countryId, filters.countryId));
        }

        const rows = await this.db
            .select({
                id: municipalities.id,
                code: municipalities.code,
                name: municipalities.name,
                countryId: municipalities.countryId,
            })
            .from(municipalities)
            .where(and(...conditions))
            .orderBy(asc(municipalities.name))
            .limit(MAX_MUNICIPALITIES_RESULTS);

        return rows.map(toMunicipalityResponseDto);
    }
}
