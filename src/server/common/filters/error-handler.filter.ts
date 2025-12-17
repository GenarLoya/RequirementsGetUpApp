import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions';

/**
 * Global error handler middleware
 * Handles HttpException instances and unknown errors
 * Must be the last middleware in the chain
 */
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Known HttpException (400, 401, 404, etc.)
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json(error.toJSON());
  }

  // Unknown error - treat as 500 Internal Server Error
  console.error('Fatal Error:', error);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return res.status(500).json({
    statusCode: 500,
    message: isDevelopment ? error.message : 'Internal Server Error',
    error: 'Internal Server Error',
    ...(isDevelopment && { stack: error.stack }),
  });
};
