import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, type SQL } from "drizzle-orm";
import { DRIZZLE } from "../database/database.module";
import { municipalities, type Municipality } from "../database/schema/municipalities";
import { type MunicipalityResponseDto, toMunicipalityResponseDto } from "./dto/municipality-response.dto";
import type { ListMunicipalitiesQueryDto } from "./dto/list-municipalities-query.dto";

const MAX_MUNICIPALITIES_RESULTS = 500;

export type SelectedMunicipalityRow = Pick<Municipality, "id" | "code" | "name" | "countryId">;

// Narrow port for the select().from().where().orderBy().limit() chain this service uses, so tests can pass a structurally-typed mock instead of casting a full PostgresJsDatabase.
export type MunicipalitiesDb = {
    select: (fields: {
        id: typeof municipalities.id;
        code: typeof municipalities.code;
        name: typeof municipalities.name;
        countryId: typeof municipalities.countryId;
    }) => {
        from: (table: typeof municipalities) => {
            where: (condition: SQL | undefined) => {
                orderBy: (column: SQL) => {
                    limit: (count: number) => Promise<SelectedMunicipalityRow[]>;
                };
            };
        };
    };
};

@Injectable()
export class MunicipalitiesService {
    constructor(@Inject(DRIZZLE) private readonly db: MunicipalitiesDb) {}

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
