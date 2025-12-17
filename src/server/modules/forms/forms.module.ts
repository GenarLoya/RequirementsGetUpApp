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

/**
 * @swagger
 * /api/forms:
 *   get:
 *     summary: Get all forms
 *     description: Retrieve all forms created by the authenticated user
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of forms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Form'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', asyncHandler(formsController.findAll));

/**
 * @swagger
 * /api/forms:
 *   post:
 *     summary: Create a new form
 *     description: Create a new form for the authenticated user
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFormRequest'
 *     responses:
 *       201:
 *         description: Form successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', asyncHandler(formsController.create));

/**
 * @swagger
 * /api/forms/{id}:
 *   get:
 *     summary: Get form by ID
 *     description: Retrieve a specific form by its ID (must be owned by authenticated user)
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Form ID
 *     responses:
 *       200:
 *         description: Form details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', asyncHandler(formsController.findOne));

/**
 * @swagger
 * /api/forms/{id}:
 *   put:
 *     summary: Update form
 *     description: Update a form's details (must be owned by authenticated user)
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Form ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFormRequest'
 *     responses:
 *       200:
 *         description: Form successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', asyncHandler(formsController.update));

/**
 * @swagger
 * /api/forms/{id}:
 *   delete:
 *     summary: Delete form
 *     description: Delete a form (must be owned by authenticated user)
 *     tags: [Forms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Form ID
 *     responses:
 *       204:
 *         description: Form successfully deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', asyncHandler(formsController.delete));

export default router;
