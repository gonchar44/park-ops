import type { ParkingZone } from "@/features/parking-zones/api/zones";
import { getOccupancyThresholds, hasOccupancyData } from "@/features/parking-zones/lib/zone-occupancy";
import { PARKING_ZONE_STATUS_BADGES } from "@/features/parking-zones/lib/zone-status";
import { BadgeDot } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";

type ParkingZoneListItemProps = {
    zone: ParkingZone;
};

export function ParkingZoneListItem({ zone }: ParkingZoneListItemProps) {
    const statusBadge = PARKING_ZONE_STATUS_BADGES[zone.status];

    return (
        <li className="flex items-center justify-between gap-x-3">
            <div className="flex items-start gap-x-2 min-w-0">
                <BadgeDot tone={statusBadge.tone} className="mt-1.5" />
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">{zone.code}</span>
                    <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">{zone.name}</span>
                </div>
            </div>

            {hasOccupancyData(zone) ? (
                <Progress
                    value={zone.occupiedSpaces}
                    max={zone.capacity}
                    thresholds={getOccupancyThresholds(zone)}
                    className="w-12 shrink-0 text-right"
                />
            ) : null}
        </li>
    );
}
