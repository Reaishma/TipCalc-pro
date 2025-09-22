import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalculationSchema } from "@shared/schema";
import { z } from "zod";

const calculateTipSchema = z.object({
  currency: z.string().min(1),
  billAmount: z.number().min(0),
  tipPercentage: z.number().min(0).max(100),
  peopleCount: z.number().int().min(1).max(50),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Calculate tip endpoint
  app.post("/api/calculate", async (req, res) => {
    try {
      const { currency, billAmount, tipPercentage, peopleCount } = calculateTipSchema.parse(req.body);
      
      const tipAmount = billAmount * (tipPercentage / 100);
      const totalAmount = billAmount + tipAmount;
      const amountPerPerson = totalAmount / peopleCount;

      const calculation = await storage.saveCalculation({
        currency,
        billAmount: billAmount.toString(),
        tipPercentage: tipPercentage.toString(),
        peopleCount,
        tipAmount: tipAmount.toString(),
        totalAmount: totalAmount.toString(),
        amountPerPerson: amountPerPerson.toString(),
      });

      res.json({
        tipAmount,
        totalAmount,
        amountPerPerson,
        calculation
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid input" });
    }
  });

  // Get recent calculations
  app.get("/api/calculations", async (req, res) => {
    try {
      const calculations = await storage.getRecentCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });

  // Get currency exchange rates (mock endpoint for future enhancement)
  app.get("/api/currencies", async (req, res) => {
    const currencies = [
      { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
      { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
      { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
      { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
      { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
      { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
      { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
    ];
    res.json(currencies);
  });

  const httpServer = createServer(app);

  return httpServer;
}

