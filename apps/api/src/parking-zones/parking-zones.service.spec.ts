import { and, eq } from "drizzle-orm";
import { parkingZones } from "../database/schema/parking-zones";
import { ParkingZonesService } from "./parking-zones.service";

describe("ParkingZonesService", () => {
    const cityId = "11111111-1111-1111-1111-111111111111";

    const rawRow = {
        id: "22222222-2222-2222-2222-222222222222",
        cityId,
        code: "PZ-1",
        name: "Central Garage",
        description: "Underground garage",
        polygon: JSON.stringify({
            type: "Polygon",
            coordinates: [
                [
                    [12.0, 55.0],
                    [12.0, 55.1],
                    [12.1, 55.1],
                    [12.1, 55.0],
                    [12.0, 55.0],
                ],
            ],
        }),
        capacity: 100,
        occupiedSpaces: 40,
        vehicleRestrictions: {},
        pricePerHour: "12.50",
        currency: "DKK",
        openingHours: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
        },
        timezone: "Europe/Copenhagen",
        freeParkingWeekdays: [],
        freeParkingMinutes: 0,
        status: "active" as const,
        warningOccupancyPercent: 75,
        criticalOccupancyPercent: 90,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    function createDbMock(rows: unknown[]) {
        const limit = jest.fn().mockResolvedValue(rows);
        const orderBy = jest.fn().mockReturnValue({ limit });
        const where = jest.fn().mockReturnValue({ orderBy });
        const from = jest.fn().mockReturnValue({ where });
        const select = jest.fn().mockReturnValue({ from });

        return { select, from, where, orderBy, limit };
    }

    it("filters by cityId and maps rows to response DTOs", async () => {
        const db = createDbMock([rawRow]);
        const service = new ParkingZonesService(db as never);

        const result = await service.findFiltered({ cityId });

        expect(db.where).toHaveBeenCalledWith(and(eq(parkingZones.cityId, cityId)));
        expect(result).toEqual([
            {
                id: rawRow.id,
                cityId,
                code: rawRow.code,
                name: rawRow.name,
                description: rawRow.description,
                polygon: JSON.parse(rawRow.polygon) as unknown,
                capacity: rawRow.capacity,
                occupiedSpaces: rawRow.occupiedSpaces,
                vehicleRestrictions: rawRow.vehicleRestrictions,
                pricePerHour: rawRow.pricePerHour,
                currency: rawRow.currency,
                openingHours: rawRow.openingHours,
                timezone: rawRow.timezone,
                freeParkingWeekdays: rawRow.freeParkingWeekdays,
                freeParkingMinutes: rawRow.freeParkingMinutes,
                status: rawRow.status,
                warningOccupancyPercent: rawRow.warningOccupancyPercent,
                criticalOccupancyPercent: rawRow.criticalOccupancyPercent,
                createdAt: rawRow.createdAt.toISOString(),
                updatedAt: rawRow.updatedAt.toISOString(),
            },
        ]);
    });

    it("adds a status condition when status filter is provided", async () => {
        const db = createDbMock([rawRow]);
        const service = new ParkingZonesService(db as never);

        await service.findFiltered({ cityId, status: "maintenance" });

        expect(db.where).toHaveBeenCalledWith(
            and(eq(parkingZones.cityId, cityId), eq(parkingZones.status, "maintenance")),
        );
    });

    it("returns an empty list when the repository has no matching rows", async () => {
        const db = createDbMock([]);
        const service = new ParkingZonesService(db as never);

        const result = await service.findFiltered({ cityId });

        expect(result).toEqual([]);
    });
});
