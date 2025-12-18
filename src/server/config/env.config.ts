import dotenv from "dotenv";
dotenv.config();
import z from "zod";

const envSchema = z.object({
  nodeEnv: z.enum(["development", "production", "test"]),
  port: z.number().min(1).max(65535),
  databaseUrl: z.url(),
  jwtSecret: z
    .string()
    .min(32, { message: "JWT secret must be at least 32 characters long" }),
  jwtExpiresIn: z.string(),
  domain: z.url(),
});

export const envConfig = envSchema.safeParse({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  domain: process.env.DOMAIN || "http://localhost:3000",
});
