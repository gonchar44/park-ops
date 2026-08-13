import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { inArray, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { cities } from "../src/database/schema/cities";
import { countries } from "../src/database/schema/countries";
import { municipalities } from "../src/database/schema/municipalities";
import { type OpeningHours, parkingZones } from "../src/database/schema/parking-zones";
import { DRIZZLE } from "../src/database/database.module";

const TEST_NAME_PREFIX = "E2E Test Zone";

const closedHours: OpeningHours = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
};

function squarePolygon(lon: number, lat: number) {
    const east = Number((lon + 0.001).toFixed(5));
    const north = Number((lat + 0.001).toFixed(5));

    return {
        type: "Polygon" as const,
        coordinates: [
            [
                [lon, lat],
                [east, lat],
                [east, north],
                [lon, north],
                [lon, lat],
            ],
        ],
    };
}

describe("ParkingZonesController (e2e)", () => {
    let app: INestApplication<App>;
    let db: PostgresJsDatabase;

    let cityAId: string;
    let cityBId: string;
    let insertedCountryIds: string[];
    let insertedMunicipalityIds: string[];
    let insertedCityIds: string[];
    let insertedZoneIds: string[];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        db = moduleFixture.get<PostgresJsDatabase>(DRIZZLE);
        await app.init();
    });

    beforeEach(async () => {
        const [country] = await db
            .insert(countries)
            .values({ isoCode: "ZZ", name: `${TEST_NAME_PREFIX} Country`, isActive: true })
            .returning({ id: countries.id });
        insertedCountryIds = [country.id];

        const [municipality] = await db
            .insert(municipalities)
            .values({
                countryId: country.id,
                code: "ZONE-MUN",
                name: `${TEST_NAME_PREFIX} Municipality`,
                isActive: true,
            })
            .returning({ id: municipalities.id });
        insertedMunicipalityIds = [municipality.id];

        const insertedCities = await db
            .insert(cities)
            .values([
                {
                    municipalityId: municipality.id,
                    code: "ZONE-CTA",
                    name: `${TEST_NAME_PREFIX} City A`,
                    center: sql<string>`ST_SetSRID(ST_MakePoint(12.5683, 55.6761), 4326)`,
                    isActive: true,
                },
                {
                    municipalityId: municipality.id,
                    code: "ZONE-CTB",
                    name: `${TEST_NAME_PREFIX} City B`,
                    center: sql<string>`ST_SetSRID(ST_MakePoint(12.5683, 55.6761), 4326)`,
                    isActive: true,
                },
            ])
            .returning({ id: cities.id });
        [cityAId, cityBId] = insertedCities.map((row) => row.id);
        insertedCityIds = [cityAId, cityBId];

        const zoneValues = [
            {
                cityId: cityAId,
                code: "ZONE-A-BETA",
                name: `${TEST_NAME_PREFIX} Beta`,
                status: "active" as const,
                polygon: sql<string>`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(squarePolygon(12.0, 55.0))}), 4326)`,
            },
            {
                cityId: cityAId,
                code: "ZONE-A-ALPHA",
                name: `${TEST_NAME_PREFIX} Alpha`,
                status: "active" as const,
                polygon: sql<string>`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(squarePolygon(12.1, 55.1))}), 4326)`,
            },
            {
                cityId: cityAId,
                code: "ZONE-A-CLOSED",
                name: `${TEST_NAME_PREFIX} Closed`,
                status: "closed" as const,
                polygon: sql<string>`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(squarePolygon(12.2, 55.2))}), 4326)`,
            },
            {
                cityId: cityBId,
                code: "ZONE-B-DELTA",
                name: `${TEST_NAME_PREFIX} Delta`,
                status: "active" as const,
                polygon: sql<string>`ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(squarePolygon(12.3, 55.3))}), 4326)`,
            },
        ];

        const insertedZones = await db
            .insert(parkingZones)
            .values(
                zoneValues.map((zone) => ({
                    ...zone,
                    pricePerHour: "10.00",
                    openingHours: closedHours,
                })),
            )
            .returning({ id: parkingZones.id });
        insertedZoneIds = insertedZones.map((row) => row.id);
    });

    afterEach(async () => {
        await db.delete(parkingZones).where(inArray(parkingZones.id, insertedZoneIds));
        await db.delete(cities).where(inArray(cities.id, insertedCityIds));
        await db.delete(municipalities).where(inArray(municipalities.id, insertedMunicipalityIds));
        await db.delete(countries).where(inArray(countries.id, insertedCountryIds));
    });

    afterAll(async () => {
        await app.close();
    });

    function testEntries(body: unknown) {
        return (body as { name: string; cityId: string; polygon: unknown }[]).filter((entry) =>
            entry.name.startsWith(TEST_NAME_PREFIX),
        );
    }

    it("returns only the requested city's zones, sorted by name, with a parsed GeoJSON polygon", async () => {
        const response = await request(app.getHttpServer())
            .get("/parking-zones")
            .query({ cityId: cityAId })
            .expect(200);

        const entries = testEntries(response.body);

        expect(entries.map((entry) => entry.name)).toEqual([
            `${TEST_NAME_PREFIX} Alpha`,
            `${TEST_NAME_PREFIX} Beta`,
            `${TEST_NAME_PREFIX} Closed`,
        ]);
        expect(entries[0].polygon).toEqual(squarePolygon(12.1, 55.1));
        for (const entry of entries) {
            expect(entry.cityId).toBe(cityAId);
        }
    });

    it("filters by status", async () => {
        const response = await request(app.getHttpServer())
            .get("/parking-zones")
            .query({ cityId: cityAId, status: "closed" })
            .expect(200);

        expect(testEntries(response.body).map((entry) => entry.name)).toEqual([`${TEST_NAME_PREFIX} Closed`]);
    });

    it("requires cityId", async () => {
        const response = await request(app.getHttpServer()).get("/parking-zones").expect(400);

        expect(response.body).toMatchObject({
            message: "Validation failed",
            errors: [{ path: "cityId" }],
        });
    });

    it("rejects an invalid cityId with a 400 and a safe validation error body", async () => {
        const response = await request(app.getHttpServer())
            .get("/parking-zones")
            .query({ cityId: "not-a-uuid" })
            .expect(400);

        expect(response.body).toMatchObject({
            message: "Validation failed",
            errors: [{ path: "cityId" }],
        });
    });

    it("rejects an unknown query parameter with a 400", async () => {
        await request(app.getHttpServer())
            .get("/parking-zones")
            .query({ cityId: cityAId, unexpectedParam: "x" })
            .expect(400);
    });
});
