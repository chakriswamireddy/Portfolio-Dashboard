import {
    pgTable,
    serial,
    varchar,
    numeric,
    integer,
    timestamp
  } from "drizzle-orm/pg-core";
  
  export const stockings = pgTable("stockings", {
    id: serial("id").primaryKey(),
  
    symbol: varchar("symbol", { length: 20 }).notNull(),
    exchange: varchar("exchange", { length: 10 }).notNull(),
  
    stockName: varchar("stock_name", { length: 100 }).notNull(),
    sector: varchar("sector", { length: 50 }).notNull(),
  
    purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }),
    quantity: integer("quantity").notNull(),
  
    cmp: numeric("cmp", { precision: 12, scale: 2 }),
    cmpUpdatedAt: timestamp("cmp_updated_at"),
  
    peRatio: numeric("pe_ratio", { precision: 8, scale: 2 }),
    earnings: numeric("earnings", { precision: 16, scale: 2 }),
    fundamentalsUpdatedAt: timestamp("fundamentals_updated_at"),
  
    createdAt: timestamp("created_at").defaultNow(),
    // updatedAt: timestamp("updated_at").defaultNow()
  });
  