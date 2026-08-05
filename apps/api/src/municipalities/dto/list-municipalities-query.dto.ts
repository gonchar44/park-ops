import { z } from "zod";

export const listMunicipalitiesQuerySchema = z
    .object({
        countryId: z.string().uuid().optional(),
    })
    .strict();

export type ListMunicipalitiesQueryDto = z.infer<typeof listMunicipalitiesQuerySchema>;
