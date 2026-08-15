import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getParkingZones, type ParkingZone } from "./zones";

const PARKING_ZONES_STALE_TIME_MS = 30 * 1000;

export const parkingZoneKeys = {
    list: (cityId: string) => ["parking-zones", "list", cityId] as const,
};

export function useParkingZones(cityId: string | null): UseQueryResult<ParkingZone[]> {
    return useQuery({
        queryKey: parkingZoneKeys.list(cityId ?? ""),
        queryFn: ({ signal }) => getParkingZones(cityId as string, signal),
        enabled: cityId !== null,
        staleTime: PARKING_ZONES_STALE_TIME_MS,
    });
}
