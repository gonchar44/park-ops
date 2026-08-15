import type { ProgressThreshold } from "@/shared/ui/progress";
import type { ParkingZone } from "@/features/parking-zones/api/zones";

type ParkingZoneOccupancyFields = Pick<ParkingZone, "capacity" | "occupiedSpaces">;

type ParkingZoneWithOccupancy = ParkingZoneOccupancyFields & {
    capacity: number;
    occupiedSpaces: number;
};

/** A zone with no configured capacity, or capacity of zero, has no meaningful occupancy percentage. */
export function hasOccupancyData(zone: ParkingZoneOccupancyFields): zone is ParkingZoneWithOccupancy {
    return zone.capacity !== null && zone.capacity > 0 && zone.occupiedSpaces !== null;
}

export function getOccupancyThresholds(
    zone: Pick<ParkingZone, "warningOccupancyPercent" | "criticalOccupancyPercent">,
): ProgressThreshold[] {
    return [
        { min: 0, tone: "success" },
        { min: zone.warningOccupancyPercent, tone: "warning" },
        { min: zone.criticalOccupancyPercent, tone: "danger" },
    ];
}
