import { and, asc, eq } from "drizzle-orm";
import { municipalities } from "../database/schema/municipalities";
import { MunicipalitiesService } from "./municipalities.service";

describe("MunicipalitiesService", () => {
    const activeRow = {
        id: "11111111-1111-1111-1111-111111111111",
        code: "AMS",
        name: "Amsterdam",
        countryId: "22222222-2222-2222-2222-222222222222",
    };

    function createDbMock(rows: unknown[]) {
        const limit = jest.fn().mockResolvedValue(rows);
        const orderBy = jest.fn().mockReturnValue({ limit });
        const where = jest.fn().mockReturnValue({ orderBy });
        const from = jest.fn().mockReturnValue({ where });
        const select = jest.fn().mockReturnValue({ from });

        return { select, from, where, orderBy, limit };
    }

    it("returns active municipalities mapped to response DTOs when no filter is given", async () => {
        const db = createDbMock([activeRow]);
        const service = new MunicipalitiesService(db as never);

        const result = await service.findFiltered({});

        expect(db.where).toHaveBeenCalledWith(and(eq(municipalities.isActive, true)));
        expect(db.orderBy).toHaveBeenCalledWith(asc(municipalities.name));
        expect(db.limit).toHaveBeenCalledWith(500);
        expect(result).toEqual([
            {
                id: activeRow.id,
                code: activeRow.code,
                name: activeRow.name,
                countryId: activeRow.countryId,
            },
        ]);
    });

    it("adds a countryId condition when countryId filter is provided", async () => {
        const db = createDbMock([activeRow]);
        const service = new MunicipalitiesService(db as never);

        await service.findFiltered({ countryId: activeRow.countryId });

        expect(db.where).toHaveBeenCalledWith(
            and(eq(municipalities.isActive, true), eq(municipalities.countryId, activeRow.countryId)),
        );
    });

    it("returns an empty list when the repository has no matching rows", async () => {
        const db = createDbMock([]);
        const service = new MunicipalitiesService(db as never);

        const result = await service.findFiltered({ countryId: "33333333-3333-3333-3333-333333333333" });

        expect(result).toEqual([]);
    });
});
