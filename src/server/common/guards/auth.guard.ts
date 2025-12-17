import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '../exceptions';

/**
 * Auth guard
 * Simple wrapper to ensure user is authenticated
 * Use this when you need authentication check inline
 */
export const authGuard = (req: Request, _res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user) {
    throw new UnauthorizedException('Authentication required');
  }
  
  next();
};
