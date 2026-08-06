import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getCities, getCountries, getMunicipalities, type City, type Country, type Municipality } from "./geography";

const GEOGRAPHY_STALE_TIME_MS = 5 * 60 * 1000;

export const geographyKeys = {
    countries: () => ["geography", "countries"] as const,
    municipalities: (countryId: string) => ["geography", "municipalities", countryId] as const,
    cities: (countryId: string, municipalityId: string) => ["geography", "cities", countryId, municipalityId] as const,
};

export function useCountries(): UseQueryResult<Country[]> {
    return useQuery({
        queryKey: geographyKeys.countries(),
        queryFn: ({ signal }) => getCountries(signal),
        staleTime: GEOGRAPHY_STALE_TIME_MS,
    });
}

export function useMunicipalities(countryId: string | null): UseQueryResult<Municipality[]> {
    return useQuery({
        queryKey: geographyKeys.municipalities(countryId ?? ""),
        queryFn: ({ signal }) => getMunicipalities(countryId as string, signal),
        enabled: countryId !== null,
        staleTime: GEOGRAPHY_STALE_TIME_MS,
    });
}

export function useCities(countryId: string | null, municipalityId: string | null): UseQueryResult<City[]> {
    return useQuery({
        queryKey: geographyKeys.cities(countryId ?? "", municipalityId ?? ""),
        queryFn: ({ signal }) => getCities(countryId as string, municipalityId as string, signal),
        enabled: countryId !== null && municipalityId !== null,
        staleTime: GEOGRAPHY_STALE_TIME_MS,
    });
}
