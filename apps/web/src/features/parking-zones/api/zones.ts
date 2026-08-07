import { z } from "zod";

import { apiFetch } from "@/shared/lib/api-client";

export const PARKING_ZONE_STATUSES = ["active", "maintenance", "closed"] as const;

const parkingZoneStatusSchema = z.enum(PARKING_ZONE_STATUSES);

export type ParkingZoneStatus = z.infer<typeof parkingZoneStatusSchema>;

const MIN_LINEAR_RING_POSITIONS = 4;

const linearRingSchema = z
    .array(z.tuple([z.number(), z.number()]))
    .min(MIN_LINEAR_RING_POSITIONS)
    .refine(
        (ring) => {
            const [firstLng, firstLat] = ring[0];
            const [lastLng, lastLat] = ring[ring.length - 1];
            return firstLng === lastLng && firstLat === lastLat;
        },
        { message: "Polygon ring must start and end with the same position" },
    );

const parkingZonePolygonSchema = z.object({
    type: z.literal("Polygon"),
    coordinates: z.array(linearRingSchema).min(1),
});

export type ParkingZonePolygon = z.infer<typeof parkingZonePolygonSchema>;

const parkingZoneSchema = z.object({
    id: z.string(),
    status: parkingZoneStatusSchema,
    polygon: parkingZonePolygonSchema,
});

export type ParkingZone = z.infer<typeof parkingZoneSchema>;

export async function getParkingZones(cityId: string, signal?: AbortSignal): Promise<ParkingZone[]> {
    const search = new URLSearchParams({ cityId });
    const data = await apiFetch(`/parking-zones?${search.toString()}`, { signal });
    return z.array(parkingZoneSchema).parse(data);
}
