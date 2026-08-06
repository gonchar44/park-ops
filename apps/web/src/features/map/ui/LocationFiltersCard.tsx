"use client";

import type { UseQueryResult } from "@tanstack/react-query";

import { useCities, useCountries, useMunicipalities } from "@/features/map/api/geography-queries";
import { useMapStore } from "@/features/map/model/map-store";
import { cn } from "@/shared/lib/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

type NamedOption = { id: string; name: string };

function getRootPlaceholder(query: UseQueryResult<NamedOption[]>, noun: string): string {
    if (query.isLoading) return `Loading ${noun}…`;
    if (query.isError) return `Failed to load ${noun}`;
    if (query.data && query.data.length === 0) return `No ${noun} available`;
    return `Select ${noun.replace(/s$/, "")}`;
}

function getDependentPlaceholder(
    query: UseQueryResult<NamedOption[]>,
    upstreamId: string | null,
    upstreamPrompt: string,
    noun: string,
): string {
    if (!upstreamId) return upstreamPrompt;
    return getRootPlaceholder(query, noun);
}

type LocationSelectFieldProps = {
    label: string;
    placeholder: string;
    value: string | null;
    onValueChange: (value: string) => void;
    disabled: boolean;
    options: NamedOption[];
    className?: string;
};

function LocationSelectField({
    label,
    placeholder,
    value,
    onValueChange,
    disabled,
    options,
    className,
}: LocationSelectFieldProps) {
    return (
        <Select value={value ?? ""} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                aria-label={label}
                className={cn(
                    "items-center gap-0.5 rounded-xl border border-black/10 bg-white/40 px-3 py-2 text-left transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                    className,
                )}
            >
                <div className="flex flex-col truncate">
                    <span className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                        {label}
                    </span>
                    <span
                        className={cn(
                            "w-full truncate text-left text-sm",
                            value ? "font-medium text-zinc-900 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-500",
                        )}
                    >
                        <SelectValue placeholder={placeholder} />
                    </span>
                </div>
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                        {option.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function LocationFiltersCard() {
    const countryId = useMapStore((state) => state.countryId);
    const municipalityId = useMapStore((state) => state.municipalityId);
    const cityId = useMapStore((state) => state.cityId);
    const setCountryId = useMapStore((state) => state.setCountryId);
    const setMunicipalityId = useMapStore((state) => state.setMunicipalityId);
    const setCityId = useMapStore((state) => state.setCityId);

    const countriesQuery = useCountries();
    const municipalitiesQuery = useMunicipalities(countryId);
    const citiesQuery = useCities(countryId, municipalityId);

    const countries = countriesQuery.data ?? [];
    const municipalities = municipalitiesQuery.data ?? [];
    const cities = citiesQuery.data ?? [];

    return (
        <Card className="pointer-events-auto w-72 gap-3 py-4">
            <CardHeader className="px-4">
                <CardTitle className="text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                    Location filters
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2 px-4">
                <LocationSelectField
                    label="Country"
                    placeholder={getRootPlaceholder(countriesQuery, "countries")}
                    value={countryId}
                    onValueChange={setCountryId}
                    disabled={countriesQuery.isLoading || countriesQuery.isError || countries.length === 0}
                    options={countries}
                />
                <LocationSelectField
                    label="Municipality"
                    placeholder={getDependentPlaceholder(
                        municipalitiesQuery,
                        countryId,
                        "Select country first",
                        "municipalities",
                    )}
                    value={municipalityId}
                    onValueChange={setMunicipalityId}
                    disabled={
                        !countryId ||
                        municipalitiesQuery.isLoading ||
                        municipalitiesQuery.isError ||
                        municipalities.length === 0
                    }
                    options={municipalities}
                />
                <LocationSelectField
                    label="City"
                    placeholder={getDependentPlaceholder(
                        citiesQuery,
                        municipalityId,
                        "Select municipality first",
                        "cities",
                    )}
                    value={cityId}
                    onValueChange={setCityId}
                    disabled={!municipalityId || citiesQuery.isLoading || citiesQuery.isError || cities.length === 0}
                    options={cities}
                    className="col-span-2"
                />
            </CardContent>
        </Card>
    );
}
