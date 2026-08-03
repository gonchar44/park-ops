CREATE TYPE "public"."parking_weekday" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."parking_zone_status" AS ENUM('active', 'maintenance', 'closed');--> statement-breakpoint
CREATE TABLE "parking_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text,
	"polygon" geometry(Polygon,4326) NOT NULL,
	"capacity" integer,
	"occupied_spaces" integer,
	"vehicle_restrictions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"price_per_hour" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'DKK' NOT NULL,
	"opening_hours" jsonb NOT NULL,
	"timezone" varchar(64) DEFAULT 'Europe/Copenhagen' NOT NULL,
	"free_parking_weekdays" "parking_weekday"[] DEFAULT ARRAY[]::parking_weekday[] NOT NULL,
	"free_parking_minutes" integer DEFAULT 0 NOT NULL,
	"status" "parking_zone_status" DEFAULT 'active' NOT NULL,
	"warning_occupancy_percent" integer DEFAULT 75 NOT NULL,
	"critical_occupancy_percent" integer DEFAULT 90 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parking_zones_code_not_blank" CHECK (length(btrim("parking_zones"."code")) > 0),
	CONSTRAINT "parking_zones_name_not_blank" CHECK (length(btrim("parking_zones"."name")) > 0),
	CONSTRAINT "parking_zones_capacity_non_negative" CHECK ("parking_zones"."capacity" IS NULL OR "parking_zones"."capacity" >= 0),
	CONSTRAINT "parking_zones_occupied_spaces_non_negative" CHECK ("parking_zones"."occupied_spaces" IS NULL OR "parking_zones"."occupied_spaces" >= 0),
	CONSTRAINT "parking_zones_occupied_within_capacity" CHECK ("parking_zones"."capacity" IS NULL OR "parking_zones"."occupied_spaces" IS NULL OR "parking_zones"."occupied_spaces" <= "parking_zones"."capacity"),
	CONSTRAINT "parking_zones_price_per_hour_non_negative" CHECK ("parking_zones"."price_per_hour" >= 0),
	CONSTRAINT "parking_zones_currency_iso_code" CHECK ("parking_zones"."currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "parking_zones_vehicle_restrictions_object" CHECK (jsonb_typeof("parking_zones"."vehicle_restrictions") = 'object'),
	CONSTRAINT "parking_zones_opening_hours_object" CHECK (jsonb_typeof("parking_zones"."opening_hours") = 'object'),
	CONSTRAINT "parking_zones_free_parking_minutes_range" CHECK ("parking_zones"."free_parking_minutes" BETWEEN 0 AND 1440),
	CONSTRAINT "parking_zones_warning_occupancy_range" CHECK ("parking_zones"."warning_occupancy_percent" BETWEEN 0 AND 100),
	CONSTRAINT "parking_zones_critical_occupancy_range" CHECK ("parking_zones"."critical_occupancy_percent" BETWEEN 0 AND 100),
	CONSTRAINT "parking_zones_occupancy_threshold_order" CHECK ("parking_zones"."warning_occupancy_percent" < "parking_zones"."critical_occupancy_percent"),
	CONSTRAINT "parking_zones_polygon_not_empty" CHECK (NOT ST_IsEmpty("parking_zones"."polygon")),
	CONSTRAINT "parking_zones_polygon_valid" CHECK (ST_IsValid("parking_zones"."polygon"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "parking_zones_code_unique_idx" ON "parking_zones" USING btree ("code");--> statement-breakpoint
CREATE INDEX "parking_zones_polygon_gist_idx" ON "parking_zones" USING gist ("polygon");