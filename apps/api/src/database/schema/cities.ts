import { sql } from "drizzle-orm";
import { boolean, check, index, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { municipalities } from "./municipalities";

export const cities = pgTable(
    "cities",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        municipalityId: uuid("municipality_id")
            .notNull()
            .references(() => municipalities.id, { onDelete: "restrict" }),
        code: varchar("code", { length: 32 }).notNull(),
        name: varchar("name", { length: 160 }).notNull(),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex("cities_municipality_code_unique_idx").on(table.municipalityId, table.code),
        index("cities_municipality_id_idx").on(table.municipalityId),
        check("cities_code_not_blank", sql`length(btrim(${table.code})) > 0`),
        check("cities_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    ],
);

export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;
