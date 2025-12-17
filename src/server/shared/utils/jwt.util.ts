import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt.config';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Sign a JWT token
 */
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  } as any);
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtConfig.secret) as JwtPayload;
};
