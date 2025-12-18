import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../shared/utils/jwt.util';
import { UnauthorizedException } from '../exceptions';

/**
 * Authentication middleware
 * Verifies JWT token from HTTP-only cookie or Authorization header
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Try cookie first (frontend web apps - most secure)
    let token = req.cookies?.auth_token;
    
    // Fallback to Authorization header (API testing tools, mobile apps)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      throw new UnauthorizedException('Authentication required');
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
