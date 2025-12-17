import { Router } from 'express';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { FormsRepository } from './forms.repository';
import { authMiddleware } from '../../common/middleware/auth.middleware';
import { asyncHandler } from '../../common/middleware/async-handler.middleware';

const router = Router();

// Initialize dependencies
const formsRepository = new FormsRepository();
const formsService = new FormsService(formsRepository);
const formsController = new FormsController(formsService);

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', asyncHandler(formsController.findAll));
router.post('/', asyncHandler(formsController.create));
router.get('/:id', asyncHandler(formsController.findOne));
router.put('/:id', asyncHandler(formsController.update));
router.delete('/:id', asyncHandler(formsController.delete));

export default router;
