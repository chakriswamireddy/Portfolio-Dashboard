import {
    pgTable,
    serial,
    varchar,
    numeric,
    integer,
    timestamp,
    uuid
  } from "drizzle-orm/pg-core";


  export interface StockingInterface {
    id: string;
    symbol: string;
    exchange: string;
    stockName: string;
    sector: string;
    cmp: number | null;
    cmpUpdatedAt: Date | null;
    peRatio: number | null;
    earnings: number | null;
    fundamentalsUpdatedAt: Date | null;
    createdAt: Date;
  }
  
  export const stockings = pgTable("stockings", {
    id: uuid("id").defaultRandom().primaryKey(),
  
    symbol: varchar("symbol", { length: 20 }).unique().notNull(),
    exchange: varchar("exchange", { length: 10 }).notNull(),
  
    stockName: varchar("stock_name", { length: 100 }).notNull(),
    sector: varchar("sector", { length: 50 }).notNull(),

    cmp: numeric("cmp", { precision: 12, scale: 2 }),
    cmpUpdatedAt: timestamp("cmp_updated_at"),
  
    peRatio: numeric("pe_ratio", { precision: 8, scale: 2 }),
    earnings: numeric("earnings", { precision: 16, scale: 2 }),
    fundamentalsUpdatedAt: timestamp("fundamentals_updated_at"),
  
    createdAt: timestamp("created_at").defaultNow(),
  });
  