/**
 * @swagger
 * components:
 *   schemas:
 *     CreateQuestionRequest:
 *       type: object
 *       required:
 *         - text
 *         - type
 *       properties:
 *         text:
 *           type: string
 *           maxLength: 500
 *           minLength: 1
 *           description: The question text
 *         type:
 *           type: string
 *           enum: [TEXT, TEXTAREA, NUMBER, EMAIL, RADIO, CHECKBOX, SELECT, DATE]
 *           description: Question type
 *         required:
 *           type: boolean
 *           default: false
 *           description: Whether the question is required
 *         options:
 *           type: object
 *           properties:
 *             choices:
 *               type: array
 *               items:
 *                 type: string
 *               minItems: 2
 *               description: Available choices (required for RADIO, CHECKBOX, SELECT)
 *           description: Additional options for the question
 *       example:
 *         text: "What is your preferred contact method?"
 *         type: "RADIO"
 *         required: true
 *         options:
 *           choices: ["Email", "Phone", "SMS"]
 *
 *     UpdateQuestionRequest:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           maxLength: 500
 *           minLength: 1
 *           description: The question text
 *         type:
 *           type: string
 *           enum: [TEXT, TEXTAREA, NUMBER, EMAIL, RADIO, CHECKBOX, SELECT, DATE]
 *           description: Question type
 *         required:
 *           type: boolean
 *           description: Whether the question is required
 *         options:
 *           type: object
 *           properties:
 *             choices:
 *               type: array
 *               items:
 *                 type: string
 *               minItems: 2
 *           description: Additional options for the question
 *       example:
 *         text: "Updated question text"
 *         required: false
 *
 *     ReorderQuestionsRequest:
 *       type: object
 *       required:
 *         - questions
 *       properties:
 *         questions:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - id
 *               - order
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Question ID
 *               order:
 *                 type: integer
 *                 minimum: 0
 *                 description: New order position (0-based)
 *           description: Array of questions with their new order
 *       example:
 *         questions:
 *           - id: "770e8400-e29b-41d4-a716-446655440000"
 *             order: 0
 *           - id: "880e8400-e29b-41d4-a716-446655440000"
 *             order: 1
 *           - id: "990e8400-e29b-41d4-a716-446655440000"
 *             order: 2
 */

// This file is used only for Swagger documentation
export {};
