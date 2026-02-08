import {
    pgTable,
    uuid,
    integer,
    numeric,
    timestamp,
    serial
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { stockings } from "./stockings";


export const holdings = pgTable("holdings", {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    stockId: uuid("stock_id")
        .notNull()
        .references(() => stockings.id, { onDelete: "cascade" }),

    quantity: integer("quantity").notNull(),

    purchasePrice: numeric("purchase_price", {
        precision: 12,
        scale: 2
    }).notNull(),

    purchasedAt: timestamp("purchased_at").defaultNow().notNull()
});
