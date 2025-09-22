import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  currency: text("currency").notNull().default("USD"),
  billAmount: decimal("bill_amount", { precision: 10, scale: 2 }).notNull(),
  tipPercentage: decimal("tip_percentage", { precision: 5, scale: 2 }).notNull(),
  peopleCount: integer("people_count").notNull().default(1),
  tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  amountPerPerson: decimal("amount_per_person", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  currency: true,
  billAmount: true,
  tipPercentage: true,
  peopleCount: true,
  tipAmount: true,
  totalAmount: true,
  amountPerPerson: true,
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

