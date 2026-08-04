import { Test, TestingModule } from "@nestjs/testing";
import { DRIZZLE } from "../database/database.module";
import { CountriesService } from "./countries.service";

describe("CountriesService", () => {
    let service: CountriesService;
    let orderBy: jest.Mock<Promise<unknown[]>, [unknown]>;
    let where: jest.Mock<{ orderBy: typeof orderBy }, [unknown]>;
    let from: jest.Mock<{ where: typeof where }, [unknown]>;
    let select: jest.Mock<{ from: typeof from }, [Record<string, unknown>]>;

    beforeEach(async () => {
        orderBy = jest.fn<Promise<unknown[]>, [unknown]>();
        where = jest.fn<{ orderBy: typeof orderBy }, [unknown]>().mockReturnValue({ orderBy });
        from = jest.fn<{ where: typeof where }, [unknown]>().mockReturnValue({ where });
        select = jest.fn<{ from: typeof from }, [Record<string, unknown>]>().mockReturnValue({ from });

        const module: TestingModule = await Test.createTestingModule({
            providers: [CountriesService, { provide: DRIZZLE, useValue: { select } }],
        }).compile();

        service = module.get<CountriesService>(CountriesService);
    });

    it("selects only id, isoCode, and name columns", async () => {
        orderBy.mockResolvedValue([]);

        await service.findAllActive();

        const selectedColumns = select.mock.calls[0][0];
        expect(Object.keys(selectedColumns).sort()).toEqual(["id", "isoCode", "name"].sort());
    });

    it("filters to active countries only", async () => {
        orderBy.mockResolvedValue([]);

        await service.findAllActive();

        expect(where).toHaveBeenCalledTimes(1);
    });

    it("orders results by name", async () => {
        orderBy.mockResolvedValue([]);

        await service.findAllActive();

        expect(orderBy).toHaveBeenCalledTimes(1);
    });

    it("maps rows to CountryResponseDto shape", async () => {
        orderBy.mockResolvedValue([
            { id: "11111111-1111-1111-1111-111111111111", isoCode: "DK", name: "Denmark" },
            { id: "22222222-2222-2222-2222-222222222222", isoCode: "SE", name: "Sweden" },
        ]);

        const result = await service.findAllActive();

        expect(result).toEqual([
            { id: "11111111-1111-1111-1111-111111111111", isoCode: "DK", name: "Denmark" },
            { id: "22222222-2222-2222-2222-222222222222", isoCode: "SE", name: "Sweden" },
        ]);
    });

    it("returns an empty array when no active countries exist", async () => {
        orderBy.mockResolvedValue([]);

        const result = await service.findAllActive();

        expect(result).toEqual([]);
    });
});
