import { relations } from "drizzle-orm";

import { cities } from "./cities";
import { countries } from "./countries";
import { municipalities } from "./municipalities";
import { parkingZones } from "./parking-zones";

export const countriesRelations = relations(countries, ({ many }) => ({
    municipalities: many(municipalities),
}));

export const municipalitiesRelations = relations(municipalities, ({ many, one }) => ({
    country: one(countries, {
        fields: [municipalities.countryId],
        references: [countries.id],
    }),
    cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ many, one }) => ({
    municipality: one(municipalities, {
        fields: [cities.municipalityId],
        references: [municipalities.id],
    }),
    parkingZones: many(parkingZones),
}));

export const parkingZonesRelations = relations(parkingZones, ({ one }) => ({
    city: one(cities, {
        fields: [parkingZones.cityId],
        references: [cities.id],
    }),
}));
