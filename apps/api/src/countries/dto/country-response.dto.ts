import type { Country } from "../../database/schema/countries";

export type CountryResponseDto = {
    id: string;
    isoCode: string;
    name: string;
};

export function toCountryResponseDto(country: Pick<Country, "id" | "isoCode" | "name">): CountryResponseDto {
    return {
        id: country.id,
        isoCode: country.isoCode,
        name: country.name,
    };
}
