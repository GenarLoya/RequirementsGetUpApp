import dotenv from "dotenv";
dotenv.config();
import z from "zod";

const envSchema = z.object({
  nodeEnv: z.enum(["development", "production", "test"]),
  port: z.coerce.number().min(1).max(65535),
  databaseUrl: z.url(),
  jwtSecret: z
    .string()
    .min(32, { message: "JWT secret must be at least 32 characters long" }),
  jwtExpiresIn: z.string(),
  domain: z.url(),
});

console.log("Loading environment variables...");

export const envConfig = await envSchema
  .parseAsync({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    domain: process.env.DOMAIN,
  })
  .then((config) => {
    console.log("Environment variables loaded and validated successfully.");
    return config;
  })
  .catch((error) => {
    console.error("Error loading environment variables:", error);
    process.exit(1);
  });
