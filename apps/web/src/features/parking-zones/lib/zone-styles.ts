import type { ParkingZoneStatus } from "@/features/parking-zones/api/zones";

type ParkingZoneStatusStyle = {
    fillColor: string;
    fillOpacity: number;
    lineColor: string;
    lineWidth: number;
    /** MapLibre requires an array for line-dasharray; [1, 0] renders a solid line. */
    lineDasharray: [number, number];
};

export const PARKING_ZONE_STATUS_STYLES: Record<ParkingZoneStatus, ParkingZoneStatusStyle> = {
    active: {
        fillColor: "#0d9488",
        fillOpacity: 0.35,
        lineColor: "#0f766e",
        lineWidth: 2,
        lineDasharray: [1, 0],
    },
    maintenance: {
        fillColor: "#f59e0b",
        fillOpacity: 0.35,
        lineColor: "#b45309",
        lineWidth: 2,
        lineDasharray: [3, 2],
    },
    closed: {
        fillColor: "#78716c",
        fillOpacity: 0.3,
        lineColor: "#57534e",
        lineWidth: 2,
        lineDasharray: [1, 3],
    },
};
