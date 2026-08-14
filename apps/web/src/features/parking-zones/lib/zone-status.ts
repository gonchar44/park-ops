import type { BadgeTone } from "@/shared/ui/badge";
import type { ParkingZoneStatus } from "@/features/parking-zones/api/zones";

type ParkingZoneStatusBadge = {
    label: string;
    tone: BadgeTone;
};

export const PARKING_ZONE_STATUS_BADGES: Record<ParkingZoneStatus, ParkingZoneStatusBadge> = {
    active: { label: "Active", tone: "success" },
    maintenance: { label: "Maintenance", tone: "warning" },
    closed: { label: "Closed", tone: "neutral" },
};
