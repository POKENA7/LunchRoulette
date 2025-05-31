import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const shops = pgTable("shops", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  memo: text("memo"),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shopTags = pgTable("shop_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  shopId: uuid("shop_id")
    .references(() => shops.id, { onDelete: "cascade" })
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
