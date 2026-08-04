import type {
    OpeningHours,
    ParkingWeekday,
    parkingZoneStatuses,
    VehicleRestrictions,
} from "../../database/schema/parking-zones";

type ParkingZoneStatus = (typeof parkingZoneStatuses)[number];

export type GeoJsonPolygon = {
    type: "Polygon";
    coordinates: number[][][];
};

export type ParkingZoneResponseDto = {
    id: string;
    cityId: string;
    code: string;
    name: string;
    description: string | null;
    polygon: GeoJsonPolygon;
    capacity: number | null;
    occupiedSpaces: number | null;
    vehicleRestrictions: VehicleRestrictions;
    pricePerHour: string;
    currency: string;
    openingHours: OpeningHours;
    timezone: string;
    freeParkingWeekdays: ParkingWeekday[];
    freeParkingMinutes: number;
    status: ParkingZoneStatus;
    warningOccupancyPercent: number;
    criticalOccupancyPercent: number;
    createdAt: string;
    updatedAt: string;
};

type ParkingZoneRow = {
    id: string;
    cityId: string;
    code: string;
    name: string;
    description: string | null;
    polygon: string;
    capacity: number | null;
    occupiedSpaces: number | null;
    vehicleRestrictions: VehicleRestrictions;
    pricePerHour: string;
    currency: string;
    openingHours: OpeningHours;
    timezone: string;
    freeParkingWeekdays: ParkingWeekday[];
    freeParkingMinutes: number;
    status: ParkingZoneStatus;
    warningOccupancyPercent: number;
    criticalOccupancyPercent: number;
    createdAt: Date;
    updatedAt: Date;
};

export function toParkingZoneResponseDto(row: ParkingZoneRow): ParkingZoneResponseDto {
    return {
        id: row.id,
        cityId: row.cityId,
        code: row.code,
        name: row.name,
        description: row.description,
        polygon: JSON.parse(row.polygon) as GeoJsonPolygon,
        capacity: row.capacity,
        occupiedSpaces: row.occupiedSpaces,
        vehicleRestrictions: row.vehicleRestrictions,
        pricePerHour: row.pricePerHour,
        currency: row.currency,
        openingHours: row.openingHours,
        timezone: row.timezone,
        freeParkingWeekdays: row.freeParkingWeekdays,
        freeParkingMinutes: row.freeParkingMinutes,
        status: row.status,
        warningOccupancyPercent: row.warningOccupancyPercent,
        criticalOccupancyPercent: row.criticalOccupancyPercent,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    };
}
