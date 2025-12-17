import { Request, Response, NextFunction } from 'express';
import { ConflictException, NotFoundException, BadRequestException } from '../exceptions';

/**
 * Prisma error handler middleware
 * Converts Prisma-specific errors to HTTP exceptions
 */
export const prismaErrorHandler = (
  error: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Prisma unique constraint violation
  if (error.code === 'P2002') {
    const field = (error.meta?.target as string[])?.join(', ') || 'field';
    return next(new ConflictException(`${field} already exists`));
  }
  
  // Record not found
  if (error.code === 'P2025') {
    return next(new NotFoundException('Record not found'));
  }
  
  // Foreign key constraint failed
  if (error.code === 'P2003') {
    return next(new BadRequestException('Invalid reference'));
  }
  
  // Prisma validation error
  if (error.name === 'PrismaClientValidationError') {
    return next(new BadRequestException('Invalid data provided'));
  }
  
  // Not a Prisma error, pass to next handler
  next(error);
};
