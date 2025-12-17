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

    const data = await this.authService.register(result.data);
    
    res.status(201).json(data);
  };

  login = async (req: Request, res: Response) => {
    // Validate request body
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }

    const data = await this.authService.login(result.data);
    
    res.json(data);
  };

  me = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userData = await this.authService.findById(user.id);
    
    res.json(userData);
  };
}
