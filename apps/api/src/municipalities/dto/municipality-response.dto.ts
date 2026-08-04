import type { Municipality } from "../../database/schema/municipalities";

export type MunicipalityResponseDto = {
    id: string;
    code: string;
    name: string;
    countryId: string;
};

export function toMunicipalityResponseDto(
    municipality: Pick<Municipality, "id" | "code" | "name" | "countryId">,
): MunicipalityResponseDto {
    return {
        id: municipality.id,
        code: municipality.code,
        name: municipality.name,
        countryId: municipality.countryId,
    };
}
