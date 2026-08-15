import "dotenv/config";

import { type ExtractTablesWithRelations, sql } from "drizzle-orm";
import { drizzle, type PostgresJsTransaction } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { cities } from "./schema/cities";
import { countries } from "./schema/countries";
import { municipalities } from "./schema/municipalities";
import { type NewParkingZone, type OpeningHours, parkingZones } from "./schema/parking-zones";

type GeoJsonPolygon = {
    type: "Polygon";
    coordinates: number[][][];
};

type ParkingZoneSeed = Omit<NewParkingZone, "id" | "cityId" | "polygon" | "createdAt" | "updatedAt"> & {
    polygon: GeoJsonPolygon;
};

type GeoJsonPoint = {
    type: "Point";
    coordinates: [number, number];
};

type CitySeed = {
    code: string;
    name: string;
    center: GeoJsonPoint;
};

type MunicipalitySeed = {
    code: string;
    name: string;
    cities: CitySeed[];
};

type CountrySeed = {
    isoCode: string;
    name: string;
    municipalities: MunicipalitySeed[];
};

const COPENHAGEN_CITY_KEY = "DK/COPENHAGEN/COPENHAGEN";

function point(longitude: number, latitude: number): GeoJsonPoint {
    return { type: "Point", coordinates: [longitude, latitude] };
}

const locationSeeds: CountrySeed[] = [
    {
        isoCode: "DK",
        name: "Denmark",
        municipalities: [
            {
                code: "COPENHAGEN",
                name: "Copenhagen Municipality",
                cities: [{ code: "COPENHAGEN", name: "Copenhagen", center: point(12.5683, 55.6761) }],
            },
            {
                code: "AARHUS",
                name: "Aarhus Municipality",
                cities: [{ code: "AARHUS", name: "Aarhus", center: point(10.2039, 56.1629) }],
            },
            {
                code: "ODENSE",
                name: "Odense Municipality",
                cities: [{ code: "ODENSE", name: "Odense", center: point(10.3873, 55.4038) }],
            },
        ],
    },
    {
        isoCode: "SE",
        name: "Sweden",
        municipalities: [
            {
                code: "STOCKHOLM",
                name: "Stockholm Municipality",
                cities: [{ code: "STOCKHOLM", name: "Stockholm", center: point(18.0686, 59.3293) }],
            },
            {
                code: "GOTHENBURG",
                name: "Gothenburg Municipality",
                cities: [{ code: "GOTHENBURG", name: "Gothenburg", center: point(11.9746, 57.7089) }],
            },
        ],
    },
    {
        isoCode: "DE",
        name: "Germany",
        municipalities: [
            {
                code: "BERLIN",
                name: "Berlin Municipality",
                cities: [{ code: "BERLIN", name: "Berlin", center: point(13.405, 52.52) }],
            },
            {
                code: "HAMBURG",
                name: "Hamburg Municipality",
                cities: [{ code: "HAMBURG", name: "Hamburg", center: point(9.9937, 53.5511) }],
            },
        ],
    },
    {
        isoCode: "NL",
        name: "Netherlands",
        municipalities: [
            {
                code: "AMSTERDAM",
                name: "Amsterdam Municipality",
                cities: [{ code: "AMSTERDAM", name: "Amsterdam", center: point(4.9041, 52.3676) }],
            },
        ],
    },
];

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

async function seedLocations(
    transaction: PostgresJsTransaction<Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>,
): Promise<Map<string, string>> {
    const cityIdByLocationKey = new Map<string, string>();

    for (const country of locationSeeds) {
        const [countryRow] = await transaction
            .insert(countries)
            .values({ isoCode: country.isoCode, name: country.name })
            .onConflictDoUpdate({
                target: countries.isoCode,
                set: { name: country.name, isActive: true, updatedAt: new Date() },
            })
            .returning({ id: countries.id });

        for (const municipality of country.municipalities) {
            const [municipalityRow] = await transaction
                .insert(municipalities)
                .values({ countryId: countryRow.id, code: municipality.code, name: municipality.name })
                .onConflictDoUpdate({
                    target: [municipalities.countryId, municipalities.code],
                    set: { name: municipality.name, isActive: true, updatedAt: new Date() },
                })
                .returning({ id: municipalities.id });

            for (const city of municipality.cities) {
                const centerSql = sql<string>`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(city.center)}), 4326)`;
                const [cityRow] = await transaction
                    .insert(cities)
                    .values({ municipalityId: municipalityRow.id, code: city.code, name: city.name, center: centerSql })
                    .onConflictDoUpdate({
                        target: [cities.municipalityId, cities.code],
                        set: { name: city.name, center: centerSql, isActive: true, updatedAt: new Date() },
                    })
                    .returning({ id: cities.id });

                cityIdByLocationKey.set(`${country.isoCode}/${municipality.code}/${city.code}`, cityRow.id);
            }
        }
    }

    return cityIdByLocationKey;
}

async function seedParkingZones() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error("DATABASE_URL environment variable is required but was not set.");
    }

    const client = postgres(databaseUrl, { max: 1 });
    const database = drizzle(client);

    try {
        await database.transaction(async (transaction) => {
            const cityIdByLocationKey = await seedLocations(transaction);
            const copenhagenId = cityIdByLocationKey.get(COPENHAGEN_CITY_KEY);

            if (!copenhagenId) {
                throw new Error(`Expected seeded city for key "${COPENHAGEN_CITY_KEY}" but none was found.`);
            }

            for (const seed of parkingZoneSeeds) {
                const { code, polygon, ...mutableValues } = seed;
                const polygonSql = sql<string>`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(polygon)}), 4326)`;

                await transaction
                    .insert(parkingZones)
                    .values({ cityId: copenhagenId, code, polygon: polygonSql, ...mutableValues })
                    .onConflictDoUpdate({
                        target: parkingZones.code,
                        set: {
                            cityId: copenhagenId,
                            polygon: polygonSql,
                            ...mutableValues,
                            updatedAt: new Date(),
                        },
                    });
            }
        });

        console.info(`Seeded ${locationSeeds.length} countries and ${parkingZoneSeeds.length} parking zones.`);
    } finally {
        await client.end();
    }
}

void seedParkingZones().catch(() => {
    console.error("Failed to seed parking zones.");
    process.exitCode = 1;
});
