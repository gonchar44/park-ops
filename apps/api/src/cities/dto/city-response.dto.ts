export type GeoJsonPoint = {
    type: "Point";
    coordinates: [number, number];
};

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
        center: JSON.parse(row.center) as GeoJsonPoint,
    };
}
