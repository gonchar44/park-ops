import { sql } from "drizzle-orm";
import { boolean, check, index, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { countries } from "./countries";

export const municipalities = pgTable(
    "municipalities",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        countryId: uuid("country_id")
            .notNull()
            .references(() => countries.id, { onDelete: "restrict" }),
        code: varchar("code", { length: 32 }).notNull(),
        name: varchar("name", { length: 160 }).notNull(),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex("municipalities_country_code_unique_idx").on(table.countryId, table.code),
        index("municipalities_country_id_idx").on(table.countryId),
        check("municipalities_code_not_blank", sql`length(btrim(${table.code})) > 0`),
        check("municipalities_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    ],
);

export type Municipality = typeof municipalities.$inferSelect;
export type NewMunicipality = typeof municipalities.$inferInsert;
