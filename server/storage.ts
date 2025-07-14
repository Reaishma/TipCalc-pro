
import { calculations, users, type Calculation, type InsertCalculation, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getRecentCalculations(limit?: number): Promise<Calculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calculations: Map<number, Calculation>;
  private currentUserId: number;
  private currentCalculationId: number;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.currentUserId = 1;
    this.currentCalculationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = this.currentCalculationId++;
    const calculation: Calculation = { 
      ...insertCalculation,
      currency: insertCalculation.currency || "USD",
      peopleCount: insertCalculation.peopleCount || 1,
      id,
      createdAt: new Date()
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async getRecentCalculations(limit: number = 10): Promise<Calculation[]> {
    return Array.from(this.calculations.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
