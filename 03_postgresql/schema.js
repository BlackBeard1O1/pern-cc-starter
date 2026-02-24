import { integer, timestamp, numeric, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core"; // or from your db helper
// if pgTable is imported elsewhere, keep that as is

export const cars = pgTable("cars", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(), // or .autoincrement() depending on version
    make: varchar("make", { length: 255 }).notNull(),
    model: varchar("model", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    timestamp: timestamp("created_at").defaultNow(),
});
