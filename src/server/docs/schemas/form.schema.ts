/**
 * @swagger
 * components:
 *   schemas:
 *     Form:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the form
 *         title:
 *           type: string
 *           maxLength: 200
 *           description: Form title
 *         description:
 *           type: string
 *           nullable: true
 *           description: Form description
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the form
 *         isActive:
 *           type: boolean
 *           description: Whether the form is active and accepting responses
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the form was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the form was last updated
 *         questions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Question'
 *           description: List of questions in the form
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         title: "Customer Feedback Form"
 *         description: "Collect customer feedback on our products and services"
 *         userId: "660e8400-e29b-41d4-a716-446655440000"
 *         isActive: true
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 *         questions: []
 *
 *     CreateFormRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *           minLength: 1
 *           description: Form title
 *         description:
 *           type: string
 *           description: Form description (optional)
 *       example:
 *         title: "Customer Feedback Form"
 *         description: "Collect customer feedback on our products and services"
 *
 *     UpdateFormRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 200
 *           minLength: 1
 *           description: Form title
 *         description:
 *           type: string
 *           description: Form description
 *         isActive:
 *           type: boolean
 *           description: Whether the form is active
 *       example:
 *         title: "Updated Customer Feedback Form"
 *         description: "Updated description"
 *         isActive: true
 *
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the question
 *         formId:
 *           type: string
 *           format: uuid
 *           description: ID of the form this question belongs to
 *         text:
 *           type: string
 *           description: The question text
 *         type:
 *           type: string
 *           enum: [TEXT, TEXTAREA, NUMBER, EMAIL, RADIO, CHECKBOX, SELECT, DATE]
 *           description: Type of the question
 *         order:
 *           type: integer
 *           description: Order of the question in the form
 *         required:
 *           type: boolean
 *           description: Whether this question is required
 *         options:
 *           type: object
 *           nullable: true
 *           description: Additional options for the question (e.g., choices for RADIO/CHECKBOX)
 *       example:
 *         id: "770e8400-e29b-41d4-a716-446655440000"
 *         formId: "550e8400-e29b-41d4-a716-446655440000"
 *         text: "How would you rate our service?"
 *         type: "RADIO"
 *         order: 1
 *         required: true
 *         options:
 *           choices: ["Excellent", "Good", "Fair", "Poor"]
 */

// This file is used only for Swagger documentation
export {};
