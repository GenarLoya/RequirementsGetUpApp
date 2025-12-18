import { Options } from "swagger-jsdoc";
import { envConfig } from "./env.config";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Form Builder API",
      version: "1.0.0",
      description: `
        A comprehensive API for creating and managing requirement gathering forms.

        ## Features
        - User authentication with JWT
        - Form creation and management
        - Question types: TEXT, TEXTAREA, NUMBER, EMAIL, RADIO, CHECKBOX, SELECT, DATE
        - Form responses and analytics

        ## Authentication
        Most endpoints require authentication. Use the **Authorize** button to set your Bearer token.

        1. Register a new user at \`/api/auth/register\`
        2. Login at \`/api/auth/login\` to get your JWT token
        3. Click the **Authorize** button and enter: \`Bearer <your-token>\`
      `,
      contact: {
        name: "API Support",
        email: "support@formbuilder.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `${envConfig.domain}/api`,
        description: "Server",
      },
    ],
    tags: [
      {
        name: "Auth",
        description:
          "Authentication endpoints - Register, login, and user management",
      },
      {
        name: "Forms",
        description: "Form management - Create, read, update, and delete forms",
      },
      {
        name: "Questions",
        description:
          "Question management - Add and manage questions within forms",
      },
      {
        name: "Responses",
        description: "Form responses - Submit and view form responses",
      },
      {
        name: "Health",
        description: "Health check endpoints",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from /api/auth/login",
        },
      },
      schemas: {
        // These will be defined in separate schema files
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  statusCode: {
                    type: "number",
                    example: 401,
                  },
                  message: {
                    type: "string",
                    example: "Unauthorized",
                  },
                  error: {
                    type: "string",
                    example: "Unauthorized",
                  },
                },
              },
            },
          },
        },
        BadRequestError: {
          description: "Invalid request data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  statusCode: {
                    type: "number",
                    example: 400,
                  },
                  message: {
                    type: "string",
                    example: "Invalid input",
                  },
                  error: {
                    type: "string",
                    example: "Bad Request",
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  statusCode: {
                    type: "number",
                    example: 404,
                  },
                  message: {
                    type: "string",
                    example: "Resource not found",
                  },
                  error: {
                    type: "string",
                    example: "Not Found",
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: "Access forbidden",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  statusCode: {
                    type: "number",
                    example: 403,
                  },
                  message: {
                    type: "string",
                    example: "You do not have access to this resource",
                  },
                  error: {
                    type: "string",
                    example: "Forbidden",
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/server/modules/**/*.ts",
    "./src/server/docs/schemas/*.ts",
    "./src/server/main.ts",
  ],
};
