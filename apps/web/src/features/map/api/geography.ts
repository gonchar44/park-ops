import { z } from "zod";

import { apiFetch } from "@/shared/lib/api-client";

const countrySchema = z.object({
    id: z.string(),
    isoCode: z.string(),
    name: z.string(),
});

export type Country = z.infer<typeof countrySchema>;

const municipalitySchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    countryId: z.string(),
});

export type Municipality = z.infer<typeof municipalitySchema>;

const geoJsonPointSchema = z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
});

const citySchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    municipalityId: z.string(),
    center: geoJsonPointSchema,
});

export type City = z.infer<typeof citySchema>;

export async function getCountries(signal?: AbortSignal): Promise<Country[]> {
    const data = await apiFetch("/countries", { signal });
    return z.array(countrySchema).parse(data);
}

export async function getMunicipalities(countryId: string, signal?: AbortSignal): Promise<Municipality[]> {
    const search = new URLSearchParams({ countryId });
    const data = await apiFetch(`/municipalities?${search.toString()}`, { signal });
    return z.array(municipalitySchema).parse(data);
}

export async function getCities(countryId: string, municipalityId: string, signal?: AbortSignal): Promise<City[]> {
    const search = new URLSearchParams({ countryId, municipalityId });
    const data = await apiFetch(`/cities?${search.toString()}`, { signal });
    return z.array(citySchema).parse(data);
}
