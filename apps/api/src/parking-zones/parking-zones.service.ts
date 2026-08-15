import { Inject, Injectable } from "@nestjs/common";
import { and, asc, eq, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { DRIZZLE } from "../database/database.module";
import { parkingZones } from "../database/schema/parking-zones";
import { type ParkingZoneResponseDto, toParkingZoneResponseDto } from "./dto/parking-zone-response.dto";
import type { ListParkingZonesQueryDto } from "./dto/list-parking-zones-query.dto";

const MAX_PARKING_ZONES_RESULTS = 500;

@Injectable()
export class ParkingZonesService {
    constructor(@Inject(DRIZZLE) private readonly db: PostgresJsDatabase) {}

    async findFiltered(filters: ListParkingZonesQueryDto): Promise<ParkingZoneResponseDto[]> {
        const conditions = [eq(parkingZones.cityId, filters.cityId)];

        if (filters.status) {
            conditions.push(eq(parkingZones.status, filters.status));
        }

        const rows = await this.db
            .select({
                id: parkingZones.id,
                cityId: parkingZones.cityId,
                code: parkingZones.code,
                name: parkingZones.name,
                description: parkingZones.description,
                polygon: sql<string>`ST_AsGeoJSON(${parkingZones.polygon})`,
                capacity: parkingZones.capacity,
                occupiedSpaces: parkingZones.occupiedSpaces,
                vehicleRestrictions: parkingZones.vehicleRestrictions,
                pricePerHour: parkingZones.pricePerHour,
                currency: parkingZones.currency,
                openingHours: parkingZones.openingHours,
                timezone: parkingZones.timezone,
                freeParkingWeekdays: parkingZones.freeParkingWeekdays,
                freeParkingMinutes: parkingZones.freeParkingMinutes,
                status: parkingZones.status,
                warningOccupancyPercent: parkingZones.warningOccupancyPercent,
                criticalOccupancyPercent: parkingZones.criticalOccupancyPercent,
                createdAt: parkingZones.createdAt,
                updatedAt: parkingZones.updatedAt,
            })
            .from(parkingZones)
            .where(and(...conditions))
            .orderBy(asc(parkingZones.name))
            .limit(MAX_PARKING_ZONES_RESULTS);

        return rows.map(toParkingZoneResponseDto);
    }
}
