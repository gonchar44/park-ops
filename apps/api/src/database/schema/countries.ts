import { sql } from "drizzle-orm";
import { boolean, check, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const countries = pgTable(
    "countries",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        isoCode: varchar("iso_code", { length: 2 }).notNull(),
        name: varchar("name", { length: 160 }).notNull(),
        isActive: boolean("is_active").default(true).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        uniqueIndex("countries_iso_code_unique_idx").on(table.isoCode),
        check("countries_iso_code_format", sql`${table.isoCode} ~ '^[A-Z]{2}$'`),
        check("countries_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    ],
);

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;
