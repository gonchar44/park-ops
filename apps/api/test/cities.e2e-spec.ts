import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { inArray } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { cities } from "../src/database/schema/cities";
import { countries } from "../src/database/schema/countries";
import { municipalities } from "../src/database/schema/municipalities";
import { DRIZZLE } from "../src/database/database.module";

const TEST_NAME_PREFIX = "E2E Test City";

describe("CitiesController (e2e)", () => {
    let app: INestApplication<App>;
    let db: PostgresJsDatabase;

    let countryAId: string;
    let countryBId: string;
    let municipalityAId: string;
    let municipalityBId: string;
    let insertedCountryIds: string[];
    let insertedMunicipalityIds: string[];
    let insertedCityIds: string[];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        db = moduleFixture.get<PostgresJsDatabase>(DRIZZLE);
        await app.init();
    });

    beforeEach(async () => {
        const insertedCountries = await db
            .insert(countries)
            .values([
                { isoCode: "ZX", name: `${TEST_NAME_PREFIX} Country A`, isActive: true },
                { isoCode: "ZY", name: `${TEST_NAME_PREFIX} Country B`, isActive: true },
            ])
            .returning({ id: countries.id });
        [countryAId, countryBId] = insertedCountries.map((row) => row.id);
        insertedCountryIds = [countryAId, countryBId];

        const insertedMunicipalities = await db
            .insert(municipalities)
            .values([
                { countryId: countryAId, code: "MUN-A", name: `${TEST_NAME_PREFIX} Municipality A`, isActive: true },
                { countryId: countryBId, code: "MUN-B", name: `${TEST_NAME_PREFIX} Municipality B`, isActive: true },
            ])
            .returning({ id: municipalities.id });
        [municipalityAId, municipalityBId] = insertedMunicipalities.map((row) => row.id);
        insertedMunicipalityIds = [municipalityAId, municipalityBId];

        const insertedCities = await db
            .insert(cities)
            .values([
                { municipalityId: municipalityAId, code: "CTB", name: `${TEST_NAME_PREFIX} Beta`, isActive: true },
                { municipalityId: municipalityAId, code: "CTA", name: `${TEST_NAME_PREFIX} Alpha`, isActive: true },
                { municipalityId: municipalityAId, code: "CTC", name: `${TEST_NAME_PREFIX} Closed`, isActive: false },
                { municipalityId: municipalityBId, code: "CTD", name: `${TEST_NAME_PREFIX} Delta`, isActive: true },
            ])
            .returning({ id: cities.id });
        insertedCityIds = insertedCities.map((row) => row.id);
    });

    afterEach(async () => {
        await db.delete(cities).where(inArray(cities.id, insertedCityIds));
        await db.delete(municipalities).where(inArray(municipalities.id, insertedMunicipalityIds));
        await db.delete(countries).where(inArray(countries.id, insertedCountryIds));
    });

    afterAll(async () => {
        await app.close();
    });

    function testEntries(body: unknown) {
        return (body as unknown[]).filter(
            (entry): entry is { id: string; code: string; name: string; municipalityId: string } =>
                typeof entry === "object" &&
                entry !== null &&
                "name" in entry &&
                typeof entry.name === "string" &&
                (entry as { name: string }).name.startsWith(TEST_NAME_PREFIX),
        );
    }

    it("returns only active cities, sorted alphabetically by name, in the response DTO shape", async () => {
        const response = await request(app.getHttpServer()).get("/cities").expect(200);

        const entries = testEntries(response.body);

        expect(entries).toEqual([
            { id: insertedCityIds[1], code: "CTA", name: `${TEST_NAME_PREFIX} Alpha`, municipalityId: municipalityAId },
            { id: insertedCityIds[0], code: "CTB", name: `${TEST_NAME_PREFIX} Beta`, municipalityId: municipalityAId },
            { id: insertedCityIds[3], code: "CTD", name: `${TEST_NAME_PREFIX} Delta`, municipalityId: municipalityBId },
        ]);
        for (const entry of entries) {
            expect(Object.keys(entry).sort()).toEqual(["code", "id", "municipalityId", "name"]);
        }
    });

    it("filters by municipalityId", async () => {
        const response = await request(app.getHttpServer())
            .get("/cities")
            .query({ municipalityId: municipalityBId })
            .expect(200);

        expect(testEntries(response.body)).toEqual([
            { id: insertedCityIds[3], code: "CTD", name: `${TEST_NAME_PREFIX} Delta`, municipalityId: municipalityBId },
        ]);
    });

    it("filters by countryId", async () => {
        const response = await request(app.getHttpServer()).get("/cities").query({ countryId: countryAId }).expect(200);

        expect(testEntries(response.body)).toEqual([
            { id: insertedCityIds[1], code: "CTA", name: `${TEST_NAME_PREFIX} Alpha`, municipalityId: municipalityAId },
            { id: insertedCityIds[0], code: "CTB", name: `${TEST_NAME_PREFIX} Beta`, municipalityId: municipalityAId },
        ]);
    });

    it("rejects an invalid municipalityId with a 400 and a safe validation error body", async () => {
        const response = await request(app.getHttpServer())
            .get("/cities")
            .query({ municipalityId: "not-a-uuid" })
            .expect(400);

        expect(response.body).toMatchObject({
            message: "Validation failed",
            errors: [{ path: "municipalityId" }],
        });
    });

    it("rejects an unknown query parameter with a 400", async () => {
        await request(app.getHttpServer()).get("/cities").query({ unexpectedParam: "x" }).expect(400);
    });
});
