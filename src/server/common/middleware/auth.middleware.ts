import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../shared/utils/jwt.util';
import { UnauthorizedException } from '../exceptions';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }
    
    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization format. Use: Bearer <token>');
    }
    
    // Extract token
    const token = authHeader.substring(7);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    
    // Verify token
    const payload = verifyToken(token);
    
    // Attach user to request
    (req as any).user = payload;
    
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedException('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedException('Token expired'));
    } else {
      next(error);
    }
  }
};
