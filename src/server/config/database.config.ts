import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { envConfig } from "./env.config";

/**
 * Prisma Client instance
 * Singleton pattern to avoid multiple connections
 */
class DatabaseConfig {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance(): PrismaClient {
    if (!DatabaseConfig.instance) {
      const adapter = new PrismaPg({ connectionString: envConfig.databaseUrl });
      const prisma = new PrismaClient({ adapter });
      DatabaseConfig.instance = new PrismaClient({
        adapter,
        log: ["query", "error", "warn"],
      });
    }
    return DatabaseConfig.instance;
  }

  static async disconnect() {
    if (DatabaseConfig.instance) {
      await DatabaseConfig.instance.$disconnect();
    }
  }
}

export const prisma = DatabaseConfig.getInstance();
export const disconnectDatabase = DatabaseConfig.disconnect;
