import { sql } from "drizzle-orm";
import {
    check,
    customType,
    index,
    integer,
    jsonb,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const parkingZoneStatuses = ["active", "maintenance", "closed"] as const;
export const parkingZoneStatusEnum = pgEnum("parking_zone_status", parkingZoneStatuses);

export const parkingWeekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export const parkingWeekdayEnum = pgEnum("parking_weekday", parkingWeekdays);

export type ParkingWeekday = (typeof parkingWeekdays)[number];

export type OpeningHoursInterval = {
    opensAt: string;
    closesAt: string;
};

export type OpeningHours = Record<ParkingWeekday, OpeningHoursInterval[]>;

export const allowedVehicleTypes = ["car", "motorcycle", "van", "bus", "truck"] as const;
export type AllowedVehicleType = (typeof allowedVehicleTypes)[number];

export type VehicleRestrictions = {
    allowedVehicleTypes?: AllowedVehicleType[];
    electricVehiclesOnly?: boolean;
    maxHeightMeters?: number;
    maxWeightKilograms?: number;
};

const postgisPolygon = customType<{ data: string; driverData: string }>({
    dataType() {
        return "geometry(Polygon,4326)";
    },
});

export const parkingZones = pgTable(
    "parking_zones",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        code: varchar("code", { length: 32 }).notNull(),
        name: varchar("name", { length: 160 }).notNull(),
        description: text("description"),
        polygon: postgisPolygon("polygon").notNull(),
        capacity: integer("capacity"),
        occupiedSpaces: integer("occupied_spaces"),
        vehicleRestrictions: jsonb("vehicle_restrictions")
            .$type<VehicleRestrictions>()
            .default(sql`'{}'::jsonb`)
            .notNull(),
        pricePerHour: numeric("price_per_hour", { precision: 10, scale: 2 }).notNull(),
        currency: varchar("currency", { length: 3 }).default("DKK").notNull(),
        openingHours: jsonb("opening_hours").$type<OpeningHours>().notNull(),
        timezone: varchar("timezone", { length: 64 }).default("Europe/Copenhagen").notNull(),
        freeParkingWeekdays: parkingWeekdayEnum("free_parking_weekdays")
            .array()
            .default(sql`ARRAY[]::parking_weekday[]`)
            .notNull(),
        freeParkingMinutes: integer("free_parking_minutes").default(0).notNull(),
        status: parkingZoneStatusEnum("status").default("active").notNull(),
        warningOccupancyPercent: integer("warning_occupancy_percent").default(75).notNull(),
        criticalOccupancyPercent: integer("critical_occupancy_percent").default(90).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex("parking_zones_code_unique_idx").on(table.code),
        index("parking_zones_polygon_gist_idx").using("gist", table.polygon),
        check("parking_zones_code_not_blank", sql`length(btrim(${table.code})) > 0`),
        check("parking_zones_name_not_blank", sql`length(btrim(${table.name})) > 0`),
        check("parking_zones_capacity_non_negative", sql`${table.capacity} IS NULL OR ${table.capacity} >= 0`),
        check(
            "parking_zones_occupied_spaces_non_negative",
            sql`${table.occupiedSpaces} IS NULL OR ${table.occupiedSpaces} >= 0`,
        ),
        check(
            "parking_zones_occupied_within_capacity",
            sql`${table.capacity} IS NULL OR ${table.occupiedSpaces} IS NULL OR ${table.occupiedSpaces} <= ${table.capacity}`,
        ),
        check("parking_zones_price_per_hour_non_negative", sql`${table.pricePerHour} >= 0`),
        check("parking_zones_currency_iso_code", sql`${table.currency} ~ '^[A-Z]{3}$'`),
        check("parking_zones_vehicle_restrictions_object", sql`jsonb_typeof(${table.vehicleRestrictions}) = 'object'`),
        check("parking_zones_opening_hours_object", sql`jsonb_typeof(${table.openingHours}) = 'object'`),
        check("parking_zones_free_parking_minutes_range", sql`${table.freeParkingMinutes} BETWEEN 0 AND 1440`),
        check("parking_zones_warning_occupancy_range", sql`${table.warningOccupancyPercent} BETWEEN 0 AND 100`),
        check("parking_zones_critical_occupancy_range", sql`${table.criticalOccupancyPercent} BETWEEN 0 AND 100`),
        check(
            "parking_zones_occupancy_threshold_order",
            sql`${table.warningOccupancyPercent} < ${table.criticalOccupancyPercent}`,
        ),
        check("parking_zones_polygon_not_empty", sql`NOT ST_IsEmpty(${table.polygon})`),
        check("parking_zones_polygon_valid", sql`ST_IsValid(${table.polygon})`),
    ],
);

export type ParkingZone = typeof parkingZones.$inferSelect;
export type NewParkingZone = typeof parkingZones.$inferInsert;
