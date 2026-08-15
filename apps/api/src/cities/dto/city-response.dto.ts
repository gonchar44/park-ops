import { z } from "zod";

const geoJsonPointSchema = z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number().finite(), z.number().finite()]),
});

export type GeoJsonPoint = z.infer<typeof geoJsonPointSchema>;

export type CityResponseDto = {
    id: string;
    code: string;
    name: string;
    municipalityId: string;
    center: GeoJsonPoint;
};

type CityRow = {
    id: string;
    code: string;
    name: string;
    municipalityId: string;
    center: string;
};

export function toCityResponseDto(row: CityRow): CityResponseDto {
    return {
        id: row.id,
        code: row.code,
        name: row.name,
        municipalityId: row.municipalityId,
        center: geoJsonPointSchema.parse(JSON.parse(row.center)),
    };
}
