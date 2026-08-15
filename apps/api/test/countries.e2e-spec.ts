import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { inArray } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { DRIZZLE } from "../src/database/database.module";
import { countries } from "../src/database/schema/countries";

const TEST_NAME_PREFIX = "E2E Test Country";

describe("CountriesController (e2e)", () => {
    let app: INestApplication<App>;
    let db: PostgresJsDatabase;
    let insertedIds: string[];

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        db = moduleFixture.get<PostgresJsDatabase>(DRIZZLE);
        await app.init();
    });

    beforeEach(async () => {
        const inserted = await db
            .insert(countries)
            .values([
                { isoCode: "ZB", name: `${TEST_NAME_PREFIX} Beta`, isActive: true },
                { isoCode: "ZA", name: `${TEST_NAME_PREFIX} Alpha`, isActive: true },
                { isoCode: "ZC", name: `${TEST_NAME_PREFIX} Closed`, isActive: false },
            ])
            .returning({ id: countries.id });

        insertedIds = inserted.map((row) => row.id);
    });

    afterEach(async () => {
        await db.delete(countries).where(inArray(countries.id, insertedIds));
    });

    afterAll(async () => {
        await app.close();
    });

    it("returns only active countries, sorted alphabetically by name, in the response DTO shape", async () => {
        const response = await request(app.getHttpServer()).get("/countries").expect(200);

        const testEntries = (response.body as unknown[]).filter(
            (entry): entry is { id: string; isoCode: string; name: string } =>
                typeof entry === "object" &&
                entry !== null &&
                "id" in entry &&
                typeof entry.id === "string" &&
                "isoCode" in entry &&
                typeof entry.isoCode === "string" &&
                "name" in entry &&
                typeof entry.name === "string" &&
                entry.name.startsWith(TEST_NAME_PREFIX),
        );

        expect(testEntries).toEqual([
            { id: insertedIds[1], isoCode: "ZA", name: `${TEST_NAME_PREFIX} Alpha` },
            { id: insertedIds[0], isoCode: "ZB", name: `${TEST_NAME_PREFIX} Beta` },
        ]);
        for (const entry of testEntries) {
            expect(Object.keys(entry).sort()).toEqual(["id", "isoCode", "name"]);
        }
    });
});
