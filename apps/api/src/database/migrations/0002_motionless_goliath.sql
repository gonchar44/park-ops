CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"municipality_id" uuid NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(160) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cities_code_not_blank" CHECK (length(btrim("cities"."code")) > 0),
	CONSTRAINT "cities_name_not_blank" CHECK (length(btrim("cities"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"iso_code" varchar(2) NOT NULL,
	"name" varchar(160) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "countries_iso_code_format" CHECK ("countries"."iso_code" ~ '^[A-Z]{2}$'),
	CONSTRAINT "countries_name_not_blank" CHECK (length(btrim("countries"."name")) > 0)
);
--> statement-breakpoint
CREATE TABLE "municipalities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"country_id" uuid NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(160) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "municipalities_code_not_blank" CHECK (length(btrim("municipalities"."code")) > 0),
	CONSTRAINT "municipalities_name_not_blank" CHECK (length(btrim("municipalities"."name")) > 0)
);
--> statement-breakpoint
ALTER TABLE "parking_zones" ADD COLUMN "city_id" uuid;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_municipality_id_municipalities_id_fk" FOREIGN KEY ("municipality_id") REFERENCES "public"."municipalities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cities_municipality_code_unique_idx" ON "cities" USING btree ("municipality_id","code");--> statement-breakpoint
CREATE INDEX "cities_municipality_id_idx" ON "cities" USING btree ("municipality_id");--> statement-breakpoint
CREATE UNIQUE INDEX "countries_iso_code_unique_idx" ON "countries" USING btree ("iso_code");--> statement-breakpoint
CREATE UNIQUE INDEX "municipalities_country_code_unique_idx" ON "municipalities" USING btree ("country_id","code");--> statement-breakpoint
CREATE INDEX "municipalities_country_id_idx" ON "municipalities" USING btree ("country_id");--> statement-breakpoint
INSERT INTO "countries" ("iso_code", "name") VALUES ('DK', 'Denmark');--> statement-breakpoint
INSERT INTO "municipalities" ("country_id", "code", "name")
SELECT "id", 'COPENHAGEN', 'Copenhagen Municipality'
FROM "countries"
WHERE "iso_code" = 'DK';--> statement-breakpoint
INSERT INTO "cities" ("municipality_id", "code", "name")
SELECT "id", 'COPENHAGEN', 'Copenhagen'
FROM "municipalities"
WHERE "code" = 'COPENHAGEN';--> statement-breakpoint
UPDATE "parking_zones"
SET "city_id" = (
	SELECT "cities"."id"
	FROM "cities"
	INNER JOIN "municipalities" ON "municipalities"."id" = "cities"."municipality_id"
	INNER JOIN "countries" ON "countries"."id" = "municipalities"."country_id"
	WHERE "countries"."iso_code" = 'DK'
		AND "municipalities"."code" = 'COPENHAGEN'
		AND "cities"."code" = 'COPENHAGEN'
)
WHERE "code" IN ('CPH-1042', 'CPH-2048', 'CPH-3107', 'CPH-4015');--> statement-breakpoint
ALTER TABLE "parking_zones" ALTER COLUMN "city_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "parking_zones" ADD CONSTRAINT "parking_zones_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "parking_zones_city_id_idx" ON "parking_zones" USING btree ("city_id");
