import type { ParkingZone, ParkingZonePolygon, ParkingZoneStatus } from "@/features/parking-zones/api/zones";

export type ParkingZoneFeatureProperties = {
    id: string;
    status: ParkingZoneStatus;
};

export type ParkingZoneFeature = {
    type: "Feature";
    geometry: ParkingZonePolygon;
    properties: ParkingZoneFeatureProperties;
};

export type ParkingZonesFeatureCollection = {
    type: "FeatureCollection";
    features: ParkingZoneFeature[];
};

export function toZonesFeatureCollection(zones: ParkingZone[]): ParkingZonesFeatureCollection {
    return {
        type: "FeatureCollection",
        features: zones.map((zone) => ({
            type: "Feature",
            geometry: zone.polygon,
            properties: { id: zone.id, status: zone.status },
        })),
    };
}
