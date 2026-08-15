ALTER TABLE "cities" ADD COLUMN "center" geometry(Point,4326);--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(12.5683, 55.6761), 4326) WHERE "code" = 'COPENHAGEN' AND "center" IS NULL;--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(10.2039, 56.1629), 4326) WHERE "code" = 'AARHUS' AND "center" IS NULL;--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(10.3873, 55.4038), 4326) WHERE "code" = 'ODENSE' AND "center" IS NULL;--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(18.0686, 59.3293), 4326) WHERE "code" = 'STOCKHOLM' AND "center" IS NULL;--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(11.9746, 57.7089), 4326) WHERE "code" = 'GOTHENBURG' AND "center" IS NULL;--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(13.405, 52.52), 4326) WHERE "code" = 'BERLIN' AND "center" IS NULL;--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(9.9937, 53.5511), 4326) WHERE "code" = 'HAMBURG' AND "center" IS NULL;--> statement-breakpoint
UPDATE "cities" SET "center" = ST_SetSRID(ST_MakePoint(4.9041, 52.3676), 4326) WHERE "code" = 'AMSTERDAM' AND "center" IS NULL;--> statement-breakpoint
ALTER TABLE "cities" ALTER COLUMN "center" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "cities_center_gist_idx" ON "cities" USING gist ("center");--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_center_not_empty" CHECK (NOT ST_IsEmpty("cities"."center"));--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_center_valid" CHECK (ST_IsValid("cities"."center"));
