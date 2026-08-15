import { z } from "zod";
import { parkingZoneStatuses } from "../../database/schema/parking-zones";

export const listParkingZonesQuerySchema = z
    .object({
        cityId: z.string().uuid(),
        status: z.enum(parkingZoneStatuses).optional(),
    })
    .strict();

export type ListParkingZonesQueryDto = z.infer<typeof listParkingZonesQuerySchema>;
