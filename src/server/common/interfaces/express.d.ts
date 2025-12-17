import { Request } from 'express';
import { JwtPayload } from '../../shared/utils/jwt.util';

/**
 * Extended Express Request with authenticated user
 */
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
