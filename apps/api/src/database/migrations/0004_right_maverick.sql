CREATE OR REPLACE FUNCTION is_valid_parking_zone_opening_hours(opening_hours jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT
        CASE
            WHEN jsonb_typeof(opening_hours) != 'object' THEN false
            WHEN NOT (opening_hours ?& ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']) THEN false
            WHEN EXISTS (
                SELECT 1
                FROM jsonb_object_keys(opening_hours) AS key
                WHERE key NOT IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
            ) THEN false
            ELSE (
                SELECT bool_and(
                    CASE WHEN jsonb_typeof(day_value) = 'array' THEN
                        COALESCE(
                            (
                                SELECT bool_and(
                                    COALESCE(
                                        jsonb_typeof(interval_value) = 'object'
                                        AND jsonb_typeof(interval_value -> 'opensAt') = 'string'
                                        AND jsonb_typeof(interval_value -> 'closesAt') = 'string',
                                        false
                                    )
                                )
                                FROM jsonb_array_elements(day_value) AS interval_value
                            ),
                            true
                        )
                    ELSE false END
                )
                FROM jsonb_each(opening_hours) AS t(day_key, day_value)
            )
        END;
$$;--> statement-breakpoint
ALTER TABLE "parking_zones" DROP CONSTRAINT "parking_zones_opening_hours_object";--> statement-breakpoint
ALTER TABLE "parking_zones" ADD CONSTRAINT "parking_zones_opening_hours_object" CHECK (is_valid_parking_zone_opening_hours("parking_zones"."opening_hours")) NOT VALID;
