import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../common/middleware/async-handler.middleware';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

// Initialize dependencies
const authService = new AuthService();
const authController = new AuthController(authService);

// Public routes
router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));

// Protected routes
router.get('/me', authMiddleware, asyncHandler(authController.me));

export default router;
