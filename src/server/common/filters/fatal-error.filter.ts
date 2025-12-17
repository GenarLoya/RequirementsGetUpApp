import { Server } from 'http';

/**
 * Fatal error handler
 * Handles uncaught exceptions and unhandled promise rejections
 * Performs graceful shutdown
 */
export const setupFatalErrorHandlers = (server?: Server) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Graceful shutdown function
   */
  const gracefulShutdown = (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    if (server) {
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  };

  /**
   * Uncaught Exception Handler
   */
  process.on('uncaughtException', (error: Error) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error('Error:', error.name);
    console.error('Message:', error.message);
    
    if (isDevelopment) {
      console.error('Stack:', error.stack);
    }
    
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  /**
   * Unhandled Promise Rejection Handler
   */
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error('Reason:', reason);
    
    if (isDevelopment) {
      console.error('Promise:', promise);
      if (reason?.stack) {
        console.error('Stack:', reason.stack);
      }
    }
    
    gracefulShutdown('UNHANDLED_REJECTION');
  });

  /**
   * SIGTERM Handler (e.g., from process manager)
   */
  process.on('SIGTERM', () => {
    gracefulShutdown('SIGTERM');
  });

  /**
   * SIGINT Handler (Ctrl+C)
   */
  process.on('SIGINT', () => {
    gracefulShutdown('SIGINT');
  });

  console.log('Fatal error handlers initialized');
};
