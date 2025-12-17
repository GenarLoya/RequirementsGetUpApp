import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ViteExpress from 'vite-express';
import { setupFatalErrorHandlers } from './common/filters/fatal-error.filter';
import { errorHandler } from './common/filters/error-handler.filter';
import { prismaErrorHandler } from './common/filters/prisma-error.filter';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import { validateEnv } from './config/env.config';

// Import modules
import authModule from './modules/auth/auth.module';
import formsModule from './modules/forms/forms.module';

// Validate environment variables
validateEnv();

// Create Express app
const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// API routes
app.use('/api/auth', authModule);
app.use('/api/forms', formsModule);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (MUST be last)
app.use(prismaErrorHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const httpServer = ViteExpress.listen(app, Number(PORT), () => {
  console.log(`
╔════════════════════════════════════════╗
║  Server is running!                    ║
║  Port: ${PORT}                            ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  API: http://localhost:${PORT}/api        ║
╚════════════════════════════════════════╝
  `);
});

// Setup fatal error handlers with server instance
setupFatalErrorHandlers(httpServer);

export default app;
