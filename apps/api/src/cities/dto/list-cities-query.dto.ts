import { z } from "zod";

export const listCitiesQuerySchema = z
    .object({
        municipalityId: z.string().uuid().optional(),
        countryId: z.string().uuid().optional(),
    })
    .strict();

export type ListCitiesQueryDto = z.infer<typeof listCitiesQuerySchema>;
