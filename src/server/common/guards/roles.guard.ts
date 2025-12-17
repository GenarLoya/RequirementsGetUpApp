import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '../exceptions';

/**
 * Role guard
 * Checks if the authenticated user has required role(s)
 */
export const roleGuard = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    next();
  };
};
