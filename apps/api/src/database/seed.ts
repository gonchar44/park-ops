import "dotenv/config";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { type NewParkingZone, type OpeningHours, parkingZones } from "./schema/parking-zones";

type GeoJsonPolygon = {
    type: "Polygon";
    coordinates: number[][][];
};

type ParkingZoneSeed = Omit<NewParkingZone, "id" | "polygon" | "createdAt" | "updatedAt"> & {
    polygon: GeoJsonPolygon;
};

const weekdayAndSaturdayHours: OpeningHours = {
    monday: [{ opensAt: "07:00", closesAt: "22:00" }],
    tuesday: [{ opensAt: "07:00", closesAt: "22:00" }],
    wednesday: [{ opensAt: "07:00", closesAt: "22:00" }],
    thursday: [{ opensAt: "07:00", closesAt: "22:00" }],
    friday: [{ opensAt: "07:00", closesAt: "23:00" }],
    saturday: [{ opensAt: "08:00", closesAt: "23:00" }],
    sunday: [],
};

const alwaysOpenHours: OpeningHours = {
    monday: [{ opensAt: "00:00", closesAt: "23:59" }],
    tuesday: [{ opensAt: "00:00", closesAt: "23:59" }],
    wednesday: [{ opensAt: "00:00", closesAt: "23:59" }],
    thursday: [{ opensAt: "00:00", closesAt: "23:59" }],
    friday: [{ opensAt: "00:00", closesAt: "23:59" }],
    saturday: [{ opensAt: "00:00", closesAt: "23:59" }],
    sunday: [{ opensAt: "00:00", closesAt: "23:59" }],
};

const closedHours: OpeningHours = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
};

const parkingZoneSeeds: ParkingZoneSeed[] = [
    {
        code: "CPH-1042",
        name: "Nyhavn Waterfront Parking",
        description: "Parkering nær Nyhavn med adgang for personbiler og motorcykler.",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [12.5891, 55.67955],
                    [12.5901, 55.67955],
                    [12.5901, 55.68005],
                    [12.5891, 55.68005],
                    [12.5891, 55.67955],
                ],
            ],
        },
        capacity: 120,
        occupiedSpaces: 76,
        vehicleRestrictions: {
            allowedVehicleTypes: ["car", "motorcycle"],
            maxHeightMeters: 2.1,
        },
        pricePerHour: "32.00",
        currency: "DKK",
        openingHours: weekdayAndSaturdayHours,
        timezone: "Europe/Copenhagen",
        freeParkingWeekdays: [],
        freeParkingMinutes: 0,
        status: "active",
        warningOccupancyPercent: 75,
        criticalOccupancyPercent: 90,
    },
    {
        code: "CPH-2048",
        name: "Nørreport Central Zone",
        description: "Central parkeringszone med gratis parkering om søndagen.",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [12.5709, 55.68305],
                    [12.572, 55.68305],
                    [12.572, 55.68355],
                    [12.5709, 55.68355],
                    [12.5709, 55.68305],
                ],
            ],
        },
        capacity: 180,
        occupiedSpaces: 122,
        vehicleRestrictions: {
            allowedVehicleTypes: ["car", "motorcycle", "van"],
            maxHeightMeters: 2.4,
        },
        pricePerHour: "38.00",
        currency: "DKK",
        openingHours: alwaysOpenHours,
        timezone: "Europe/Copenhagen",
        freeParkingWeekdays: ["sunday"],
        freeParkingMinutes: 0,
        status: "active",
        warningOccupancyPercent: 70,
        criticalOccupancyPercent: 90,
    },
    {
        code: "CPH-3107",
        name: "Østerbro Residential Parking",
        description: null,
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [12.5764, 55.70275],
                    [12.5775, 55.70275],
                    [12.5775, 55.70325],
                    [12.5764, 55.70325],
                    [12.5764, 55.70275],
                ],
            ],
        },
        capacity: null,
        occupiedSpaces: null,
        vehicleRestrictions: {
            allowedVehicleTypes: ["car", "motorcycle", "van"],
        },
        pricePerHour: "24.00",
        currency: "DKK",
        openingHours: alwaysOpenHours,
        timezone: "Europe/Copenhagen",
        freeParkingWeekdays: [],
        freeParkingMinutes: 120,
        status: "maintenance",
        warningOccupancyPercent: 75,
        criticalOccupancyPercent: 90,
    },
    {
        code: "CPH-4015",
        name: "Vesterbro Event Parking",
        description: "Midlertidigt lukket område, der bruges ved større arrangementer.",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [12.5574, 55.6687],
                    [12.5585, 55.6687],
                    [12.5585, 55.6692],
                    [12.5574, 55.6692],
                    [12.5574, 55.6687],
                ],
            ],
        },
        capacity: 64,
        occupiedSpaces: 0,
        vehicleRestrictions: {
            allowedVehicleTypes: ["car", "van", "bus"],
            maxWeightKilograms: 7500,
        },
        pricePerHour: "0.00",
        currency: "DKK",
        openingHours: closedHours,
        timezone: "Europe/Copenhagen",
        freeParkingWeekdays: [],
        freeParkingMinutes: 0,
        status: "closed",
        warningOccupancyPercent: 75,
        criticalOccupancyPercent: 90,
    },
];

async function seedParkingZones() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is required but was not set.");
    }

    const client = postgres(databaseUrl, { max: 1 });
    const database = drizzle(client);

    try {
        await database.transaction(async (transaction) => {
            for (const seed of parkingZoneSeeds) {
                const { code, polygon, ...mutableValues } = seed;
                const polygonSql = sql<string>`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(polygon)}), 4326)`;

                await transaction
                    .insert(parkingZones)
                    .values({ code, polygon: polygonSql, ...mutableValues })
                    .onConflictDoUpdate({
                        target: parkingZones.code,
                        set: {
                            polygon: polygonSql,
                            ...mutableValues,
                            updatedAt: new Date(),
                        },
                    });
            }
        });

        console.info(`Seeded ${parkingZoneSeeds.length} parking zones.`);
    } finally {
        await client.end();
    }
}

void seedParkingZones().catch(() => {
    console.error("Failed to seed parking zones.");
    process.exitCode = 1;
});
