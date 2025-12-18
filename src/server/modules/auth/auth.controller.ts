import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { BadRequestException } from '../../common/exceptions';
import { registerSchema, loginSchema } from './dto';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    // Validate request body
    const result = registerSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }

    const { token, user } = await this.authService.register(result.data);
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,      // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',     // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
    
    // Return user data (NOT the token)
    res.status(201).json({ user });
  };

  login = async (req: Request, res: Response) => {
    // Validate request body
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }

    const { token, user } = await this.authService.login(result.data);
    
    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    
    // Return user data (NOT the token)
    res.json({ user });
  };

  me = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userData = await this.authService.findById(user.id);
    
    res.json(userData);
  };

  logout = async (req: Request, res: Response) => {
    // Clear the auth cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    res.status(204).send();
  };
}
