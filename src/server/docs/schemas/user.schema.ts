/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's full name
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           description: User's role in the system
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         email: "user@example.com"
 *         name: "John Doe"
 *         role: "USER"
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT authentication token
 *       example:
 *         user:
 *           id: "550e8400-e29b-41d4-a716-446655440000"
 *           email: "user@example.com"
 *           name: "John Doe"
 *           role: "USER"
 *           createdAt: "2024-01-01T00:00:00.000Z"
 *           updatedAt: "2024-01-01T00:00:00.000Z"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: User's password (minimum 6 characters)
 *         name:
 *           type: string
 *           minLength: 1
 *           description: User's full name
 *       example:
 *         email: "user@example.com"
 *         password: "password123"
 *         name: "John Doe"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: "user@example.com"
 *         password: "password123"
 */

// This file is used only for Swagger documentation
export {};
