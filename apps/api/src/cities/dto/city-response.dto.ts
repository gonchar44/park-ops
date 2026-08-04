import type { City } from "../../database/schema/cities";

export type CityResponseDto = {
    id: string;
    code: string;
    name: string;
    municipalityId: string;
};

export function toCityResponseDto(city: Pick<City, "id" | "code" | "name" | "municipalityId">): CityResponseDto {
    return {
        id: city.id,
        code: city.code,
        name: city.name,
        municipalityId: city.municipalityId,
    };
}
