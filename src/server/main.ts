import "dotenv/config";
import "./config/env.config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerJsdoc from "swagger-jsdoc";
import { apiReference } from "@scalar/express-api-reference";
import ViteExpress from "vite-express";
import { setupFatalErrorHandlers } from "./common/filters/fatal-error.filter";
import { errorHandler } from "./common/filters/error-handler.filter";
import { prismaErrorHandler } from "./common/filters/prisma-error.filter";
import { loggerMiddleware } from "./common/middleware/logger.middleware";
import { swaggerOptions } from "./config/swagger.config";

// Import modules
import authModule from "./modules/auth/auth.module";
import formsModule from "./modules/forms/forms.module";

// Create Express app
const app = express();

// Global middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for Swagger UI to work
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Scalar API Reference - Beautiful, modern API documentation
app.use(
  "/reference",
  apiReference({
    spec: {
      content: swaggerSpec,
    },
    theme: "default",
    layout: "modern",
    defaultOpenAllTags: true,
  }),
);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API server is running
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authModule);
app.use("/api/forms", formsModule);

// Error handling middleware (MUST be last)
app.use(prismaErrorHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

const httpServer = ViteExpress.listen(app, Number(PORT), () => {
  console.log(`
╔═════════════════════════════════════════════════════╗
║  Server is running!                                 ║
║  Port: ${PORT}                                      ║
║  Environment: ${process.env.NODE_ENV || "development"}                   ║
║  API: http://localhost:${PORT}/api                  ║
║  API Reference: http://localhost:${PORT}/reference  ║
╚═════════════════════════════════════════════════════╝
  `);
});

// Setup fatal error handlers with server instance
setupFatalErrorHandlers(httpServer);

export default app;
